// lambda/publish/index.js
const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: 'us-east-1' });
const cloudWatch = new AWS.CloudWatch();

const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;
const FROM_EMAIL = process.env.FROM_EMAIL;
const DOMAIN_NAME = process.env.DOMAIN_NAME;

// Batch size for SES (max 50 per batch)
const BATCH_SIZE = 50;

// Get subscriber count directly from DynamoDB
const getSubscriberCount = async () => {
  const result = await dynamodb.scan({
    TableName: DYNAMODB_TABLE,
    Select: 'COUNT',
    FilterExpression: '#status = :status',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: { ':status': 'active' }
  }).promise();
  
  return result.Count;
};

// Track newsletter metrics
const trackNewsletterMetric = async (metricName, value, unit = 'Count') => {
  await cloudWatch.putMetricData({
    Namespace: 'Newsletter',
    MetricData: [{
      MetricName: metricName,
      Value: value,
      Unit: unit,
      Timestamp: new Date()
    }]
  }).promise();
};

exports.handler = async (event) => {
    console.log('Publish Event:', JSON.stringify(event, null, 2));
    
    // Parse request body
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        console.error('Error parsing request body:', error);
        return createResponse(400, { error: 'Invalid request body' });
    }
    
    const { 
        subject, 
        htmlContent, 
        textContent, 
        testMode = false,
        testEmail,
        apiKey 
    } = body;
    
    // Simple API key check (in production, use AWS API Gateway authorizers)
    if (apiKey !== process.env.PUBLISH_API_KEY) {
        return createResponse(401, { error: 'Unauthorized' });
    }
    
    // Validate inputs
    if (!subject || !htmlContent) {
        return createResponse(400, { 
            error: 'Missing required fields: subject and htmlContent' 
        });
    }
    
    try {
        // Get all active subscribers
        const subscribers = await getActiveSubscribers();
        
        if (subscribers.length === 0) {
            return createResponse(200, {
                success: true,
                message: 'No active subscribers found',
                stats: { total: 0, sent: 0 }
            });
        }
        
        // Test mode - send only to test email
        if (testMode) {
            if (!testEmail) {
                return createResponse(400, { 
                    error: 'Test email required in test mode' 
                });
            }
            
            await sendEmail({
                to: [testEmail],
                subject: `[TEST] ${subject}`,
                htmlContent: addNewsletterFooter(htmlContent, testEmail, 'test-token'),
                textContent: textContent || stripHtml(htmlContent)
            });
            
            return createResponse(200, {
                success: true,
                message: 'Test email sent',
                stats: { total: 1, sent: 1, testMode: true }
            });
        }
        
        // Production mode - send to all subscribers
        const results = await sendBulkEmails(subscribers, {
            subject,
            htmlContent,
            textContent: textContent || stripHtml(htmlContent)
        });
        
        // Track metrics
        await trackNewsletterMetric('NewslettersSent', 1);
        await trackNewsletterMetric('EmailsSentTotal', results.success);
        await trackNewsletterMetric('EmailsFailed', results.failed);
        
        // Log newsletter send event
        await logNewsletterSend({
            subject,
            subscriberCount: subscribers.length,
            successCount: results.success,
            failureCount: results.failed,
            timestamp: new Date().toISOString()
        });
        
        return createResponse(200, {
            success: true,
            message: 'Newsletter sent successfully',
            stats: {
                total: subscribers.length,
                sent: results.success,
                failed: results.failed,
                errors: results.errors
            }
        });
        
    } catch (error) {
        console.error('Error publishing newsletter:', error);
        return createResponse(500, { 
            error: 'Failed to publish newsletter',
            details: error.message 
        });
    }
};

async function getActiveSubscribers() {
    const params = {
        TableName: DYNAMODB_TABLE,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
            '#status': 'status'
        },
        ExpressionAttributeValues: {
            ':status': 'active'
        }
    };
    
    const subscribers = [];
    let lastEvaluatedKey;
    
    do {
        if (lastEvaluatedKey) {
            params.ExclusiveStartKey = lastEvaluatedKey;
        }
        
        const result = await dynamodb.scan(params).promise();
        subscribers.push(...result.Items);
        lastEvaluatedKey = result.LastEvaluatedKey;
        
    } while (lastEvaluatedKey);
    
    return subscribers;
}

async function sendBulkEmails(subscribers, { subject, htmlContent, textContent }) {
    const results = {
        success: 0,
        failed: 0,
        errors: []
    };
    
    // Process in batches
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
        const batch = subscribers.slice(i, i + BATCH_SIZE);
        
        try {
            // Send individual emails (more reliable than bulk templated email)
            const promises = batch.map(async (subscriber) => {
                try {
                    // Generate unsubscribe token if not exists
                    const unsubscribeToken = subscriber.unsubscribeToken || generateUnsubscribeToken(subscriber.email);
                    
                    await sendEmail({
                        to: [subscriber.email],
                        subject,
                        htmlContent: addNewsletterFooter(
                            personalizeContent(htmlContent, subscriber),
                            subscriber.email,
                            unsubscribeToken
                        ),
                        textContent: personalizeContent(textContent, subscriber)
                    });
                    
                    // Update unsubscribe token if it was generated
                    if (!subscriber.unsubscribeToken) {
                        await updateUnsubscribeToken(subscriber.email, unsubscribeToken);
                    }
                    
                    return { success: true, email: subscriber.email };
                } catch (error) {
                    console.error(`Failed to send to ${subscriber.email}:`, error);
                    return { success: false, email: subscriber.email, error: error.message };
                }
            });
            
            const batchResults = await Promise.all(promises);
            
            // Count results
            batchResults.forEach(result => {
                if (result.success) {
                    results.success++;
                } else {
                    results.failed++;
                    results.errors.push({
                        email: result.email,
                        error: result.error
                    });
                }
            });
            
        } catch (error) {
            console.error('Batch processing error:', error);
            results.failed += batch.length;
            results.errors.push({
                batch: `${i}-${i + batch.length}`,
                error: error.message
            });
        }
        
        // Rate limiting pause (14 emails/second limit for SES)
        if (i + BATCH_SIZE < subscribers.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    return results;
}

async function sendEmail({ to, subject, htmlContent, textContent }) {
    return ses.sendEmail({
        Source: FROM_EMAIL,
        Destination: { ToAddresses: to },
        Message: {
            Subject: { Data: subject },
            Body: {
                Html: { Data: htmlContent },
                Text: { Data: textContent || stripHtml(htmlContent) }
            }
        },
        ConfigurationSetName: process.env.SES_CONFIGURATION_SET // For bounce/complaint tracking
    }).promise();
}

function personalizeContent(content, subscriber) {
    if (!content) return '';
    
    // Replace personalization tokens
    return content
        .replace(/{{name}}/g, subscriber.name || 'Subscriber')
        .replace(/{{email}}/g, subscriber.email)
        .replace(/{{firstName}}/g, subscriber.name ? subscriber.name.split(' ')[0] : 'Friend');
}

function generateUnsubscribeToken(email) {
    const crypto = require('crypto');
    return crypto.createHash('sha256')
        .update(email + process.env.UNSUBSCRIBE_SALT || 'default-salt')
        .digest('hex')
        .substring(0, 32);
}

async function updateUnsubscribeToken(email, token) {
    try {
        await dynamodb.update({
            TableName: DYNAMODB_TABLE,
            Key: { email },
            UpdateExpression: 'SET unsubscribeToken = :token',
            ExpressionAttributeValues: {
                ':token': token
            }
        }).promise();
    } catch (error) {
        console.error(`Failed to update unsubscribe token for ${email}:`, error);
    }
}

function addNewsletterFooter(htmlContent, email, unsubscribeToken) {
    const unsubscribeUrl = `https://${DOMAIN_NAME}/unsubscribe?email=${encodeURIComponent(email)}&token=${unsubscribeToken}`;
    
    const footer = `
        <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px; font-family: Arial, sans-serif;">
            <p>
                You're receiving this because you subscribed to Build MLOps newsletter.
                <br>
                <a href="${unsubscribeUrl}" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a> | 
                <a href="https://${DOMAIN_NAME}" style="color: #3b82f6; text-decoration: none;">Visit Website</a>
            </p>
            <p style="margin-top: 10px;">
                Build MLOps • Production ML Engineering
            </p>
            <p style="margin-top: 10px; font-size: 10px;">
                ${email}
            </p>
        </div>
    `;
    
    // Insert footer before closing body tag if it exists, otherwise just append
    if (htmlContent.includes('</body>')) {
        return htmlContent.replace('</body>', footer + '</body>');
    } else {
        return htmlContent + footer;
    }
}

function stripHtml(html) {
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .trim();
}

async function logNewsletterSend(stats) {
    // Log to CloudWatch Logs
    console.log('Newsletter sent:', JSON.stringify(stats, null, 2));
    
    // Optionally store in DynamoDB for analytics
    const logTableName = process.env.NEWSLETTER_LOGS_TABLE || `${DYNAMODB_TABLE}-logs`;
    
    try {
        await dynamodb.put({
            TableName: logTableName,
            Item: {
                id: `newsletter-${Date.now()}`,
                type: 'newsletter_send',
                timestamp: stats.timestamp,
                ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60), // 90 days TTL
                ...stats
            }
        }).promise();
    } catch (error) {
        // Don't fail the whole operation if logging fails
        console.error('Failed to log newsletter send:', error);
    }
}

function createResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Restrict this in production
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify(body)
    };
}