// lambda/subscribe/index.js
const AWS = require('aws-sdk');
const crypto = require('crypto');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: 'us-east-1' });
const cloudWatch = new AWS.CloudWatch();

const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;
const FROM_EMAIL = process.env.FROM_EMAIL;
const DOMAIN_NAME = process.env.DOMAIN_NAME;

// Get subscriber count
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

// Track subscription metrics
const trackSubscriptionMetric = async (source = 'website') => {
  await cloudWatch.putMetricData({
    Namespace: 'Newsletter',
    MetricData: [{
      MetricName: 'Subscriptions',
      Value: 1,
      Unit: 'Count',
      Dimensions: [{
        Name: 'Source',
        Value: source
      }]
    }]
  }).promise();
};

exports.handler = async (event) => {
    console.log('Subscribe Event:', JSON.stringify(event, null, 2));
    
    // Parse request body
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        console.error('Error parsing request body:', error);
        return createResponse(400, { error: 'Invalid request body' });
    }
    
    const { email, name } = body;
    
    // Validate email
    if (!email || !isValidEmail(email)) {
        return createResponse(400, { error: 'Invalid email address' });
    }
    
    try {
        // Check if already subscribed
        const existing = await dynamodb.get({
            TableName: DYNAMODB_TABLE,
            Key: { email }
        }).promise();
        
        if (existing.Item && existing.Item.status === 'active') {
            return createResponse(200, { 
                success: true, 
                message: 'You are already subscribed!' 
            });
        }
        
        // Check if email was previously bounced or complained
        if (existing.Item && (existing.Item.status === 'bounced' || existing.Item.status === 'complained')) {
            console.warn(`Attempt to subscribe previously ${existing.Item.status} email: ${email}`);
            return createResponse(400, { 
                error: 'This email address cannot be subscribed. Please use a different email address.' 
            });
        }
        
        // Generate confirmation token
        const confirmToken = crypto.randomBytes(32).toString('hex');
        const timestamp = new Date().toISOString();
        
        // Save to DynamoDB
        await dynamodb.put({
            TableName: DYNAMODB_TABLE,
            Item: {
                email,
                name: name || '',
                status: 'pending',
                confirmToken,
                subscribedAt: timestamp,
                source: 'website',
                tags: ['general'],
                metadata: {
                    userAgent: event.headers['User-Agent'] || '',
                    ip: event.headers['X-Forwarded-For'] || ''
                }
            }
        }).promise();
        
        // Track the subscription attempt metric
        await trackSubscriptionMetric('website');
        
        // Send confirmation email
        const confirmUrl = `https://${DOMAIN_NAME}/confirm?token=${confirmToken}&email=${encodeURIComponent(email)}`;
        
        await ses.sendEmail({
            Source: FROM_EMAIL,
            Destination: { ToAddresses: [email] },
            Message: {
                Subject: { Data: 'Confirm your Build MLOps subscription' },
                Body: {
                    Html: {
                        Data: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h1 style="color: #3b82f6;">Welcome to Build MLOps!</h1>
                                <p>Hi${name ? ' ' + name : ''},</p>
                                <p>Thanks for subscribing to our newsletter. Please confirm your email address by clicking the button below:</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${confirmUrl}" style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                                        Confirm Subscription
                                    </a>
                                </div>
                                <p style="color: #666; font-size: 14px;">Or copy and paste this link: ${confirmUrl}</p>
                                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                                <p style="color: #666; font-size: 12px;">If you didn't subscribe, you can safely ignore this email.</p>
                            </div>
                        `
                    }
                }
            }
        }).promise();
        
        return createResponse(200, {
            success: true,
            message: 'Please check your email to confirm your subscription.'
        });
        
    } catch (error) {
        console.error('Error:', error);
        return createResponse(500, { 
            error: 'Failed to subscribe. Please try again.' 
        });
    }
};

// Confirm email endpoint
exports.confirmHandler = async (event) => {
    const { token, email } = event.queryStringParameters || {};
    
    if (!token || !email) {
        return createResponse(400, { error: 'Invalid confirmation link' });
    }
    
    try {
        // Get subscriber
        const result = await dynamodb.get({
            TableName: DYNAMODB_TABLE,
            Key: { email }
        }).promise();
        
        if (!result.Item || result.Item.confirmToken !== token) {
            return createResponse(400, { error: 'Invalid confirmation link' });
        }
        
        // Update status
        await dynamodb.update({
            TableName: DYNAMODB_TABLE,
            Key: { email },
            UpdateExpression: 'SET #status = :status, confirmedAt = :timestamp REMOVE confirmToken',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': 'active',
                ':timestamp': new Date().toISOString()
            }
        }).promise();
        
        // Send welcome email
        await ses.sendEmail({
            Source: FROM_EMAIL,
            Destination: { ToAddresses: [email] },
            Message: {
                Subject: { Data: 'Welcome to Build MLOps!' },
                Body: {
                    Html: {
                        Data: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h1 style="color: #3b82f6;">You're all set!</h1>
                                <p>Your subscription to Build MLOps is now active.</p>
                                <p>You'll receive our newsletter with:</p>
                                <ul>
                                    <li>Weekly MLOps insights and tutorials</li>
                                    <li>Production ML best practices</li>
                                    <li>Tool reviews and comparisons</li>
                                    <li>Real-world case studies</li>
                                </ul>
                                <p>Stay tuned for our next edition!</p>
                            </div>
                        `
                    }
                }
            }
        }).promise();
        
        // Redirect to success page
        return {
            statusCode: 302,
            headers: {
                Location: `https://${DOMAIN_NAME}/subscribed?success=true`
            }
        };
        
    } catch (error) {
        console.error('Error confirming:', error);
        return createResponse(500, { error: 'Failed to confirm subscription' });
    }
};

// SES Event Handler for bounces and complaints
exports.sesEventHandler = async (event) => {
    console.log('SES Event:', JSON.stringify(event, null, 2));
    
    try {
        // Parse SNS message containing SES event
        const snsMessage = JSON.parse(event.Records[0].Sns.Message);
        const eventType = snsMessage.eventType || snsMessage.notificationType;
        
        switch (eventType) {
            case 'Bounce':
                await handleBounceEvent(snsMessage);
                break;
            case 'Complaint':
                await handleComplaintEvent(snsMessage);
                break;
            default:
                console.log(`Unhandled SES event type: ${eventType}`);
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Error processing SES event:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process SES event' })
        };
    }
};

// Handle bounce events
const handleBounceEvent = async (sesMessage) => {
    const bounce = sesMessage.bounce;
    const bouncedRecipients = bounce.bouncedRecipients;
    
    for (const recipient of bouncedRecipients) {
        const email = recipient.emailAddress;
        const bounceType = bounce.bounceType;
        const bounceSubType = bounce.bounceSubType;
        
        console.log(`Processing bounce for ${email}: ${bounceType}/${bounceSubType}`);
        
        // Update subscriber status based on bounce type
        if (bounceType === 'Permanent') {
            // Permanent bounces should be marked as invalid
            await dynamodb.update({
                TableName: DYNAMODB_TABLE,
                Key: { email },
                UpdateExpression: 'SET #status = :status, bouncedAt = :timestamp, bounceType = :bounceType, bounceSubType = :bounceSubType',
                ExpressionAttributeNames: { '#status': 'status' },
                ExpressionAttributeValues: {
                    ':status': 'bounced',
                    ':timestamp': new Date().toISOString(),
                    ':bounceType': bounceType,
                    ':bounceSubType': bounceSubType
                }
            }).promise();
        } else if (bounceType === 'Transient') {
            // Transient bounces - increment bounce count
            await dynamodb.update({
                TableName: DYNAMODB_TABLE,
                Key: { email },
                UpdateExpression: 'SET transientBounceCount = if_not_exists(transientBounceCount, :zero) + :one, lastTransientBounce = :timestamp',
                ExpressionAttributeValues: {
                    ':zero': 0,
                    ':one': 1,
                    ':timestamp': new Date().toISOString()
                }
            }).promise();
        }
    }
};

// Handle complaint events
const handleComplaintEvent = async (sesMessage) => {
    const complaint = sesMessage.complaint;
    const complainedRecipients = complaint.complainedRecipients;
    
    for (const recipient of complainedRecipients) {
        const email = recipient.emailAddress;
        
        console.log(`Processing complaint for ${email}`);
        
        // Mark as complained and unsubscribe
        await dynamodb.update({
            TableName: DYNAMODB_TABLE,
            Key: { email },
            UpdateExpression: 'SET #status = :status, complainedAt = :timestamp, complaintFeedbackType = :feedbackType',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: {
                ':status': 'complained',
                ':timestamp': new Date().toISOString(),
                ':feedbackType': complaint.complaintFeedbackType || 'not-specified'
            }
        }).promise();
    }
};

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': `https://${DOMAIN_NAME}`,
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        body: JSON.stringify(body)
    };
}