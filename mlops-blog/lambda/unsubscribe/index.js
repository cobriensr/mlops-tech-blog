// lambda/unsubscribe/index.js
const AWS = require('aws-sdk');
const crypto = require('crypto');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const cloudWatch = new AWS.CloudWatch();

const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;
const DOMAIN_NAME = process.env.DOMAIN_NAME;
const UNSUBSCRIBE_SALT = process.env.UNSUBSCRIBE_SALT || 'default-salt';

// Generate unsubscribe token (same logic as in publish lambda)
function generateUnsubscribeToken(email) {
    return crypto.createHash('sha256')
        .update(email + UNSUBSCRIBE_SALT)
        .digest('hex')
        .substring(0, 32);
}

// Track unsubscribe metrics
const trackUnsubscribeMetric = async (source = 'link') => {
    try {
        await cloudWatch.putMetricData({
            Namespace: 'Newsletter',
            MetricData: [{
                MetricName: 'Unsubscribes',
                Value: 1,
                Unit: 'Count',
                Dimensions: [{
                    Name: 'Source',
                    Value: source
                }],
                Timestamp: new Date()
            }]
        }).promise();
    } catch (error) {
        console.error('Failed to track metric:', error);
    }
};

// Main unsubscribe handler - for GET requests from email links
// NOW REDIRECTS TO UNSUBSCRIBE PAGE FOR FEEDBACK INSTEAD OF IMMEDIATE UNSUBSCRIBE
exports.handler = async (event) => {
    console.log('Unsubscribe Event:', JSON.stringify(event, null, 2));
    
    const { email, token } = event.queryStringParameters || {};
    
    // Validate inputs
    if (!email || !token) {
        return {
            statusCode: 302,
            headers: {
                Location: `https://${DOMAIN_NAME}/unsubscribe-error?reason=invalid`
            }
        };
    }
    
    try {
        // Get subscriber to validate they exist
        const result = await dynamodb.get({
            TableName: DYNAMODB_TABLE,
            Key: { email: decodeURIComponent(email) }
        }).promise();
        
        if (!result.Item) {
            return {
                statusCode: 302,
                headers: {
                    Location: `https://${DOMAIN_NAME}/unsubscribe-error?reason=notfound`
                }
            };
        }
        
        // Verify token
        const expectedToken = result.Item.unsubscribeToken || generateUnsubscribeToken(email);
        
        if (token !== expectedToken) {
            console.warn(`Invalid unsubscribe token for ${email}`);
            return {
                statusCode: 302,
                headers: {
                    Location: `https://${DOMAIN_NAME}/unsubscribe-error?reason=invalid`
                }
            };
        }
        
        // Check if already unsubscribed
        if (result.Item.status === 'unsubscribed') {
            // If already unsubscribed, go straight to success page
            return {
                statusCode: 302,
                headers: {
                    Location: `https://${DOMAIN_NAME}/unsubscribe-success?email=${email}`
                }
            };
        }
        
        // REDIRECT TO UNSUBSCRIBE PAGE FOR FEEDBACK (instead of unsubscribing immediately)
        return {
            statusCode: 302,
            headers: {
                Location: `https://${DOMAIN_NAME}/unsubscribe?email=${email}&token=${token}`
            }
        };
        
    } catch (error) {
        console.error('Error processing unsubscribe:', error);
        return {
            statusCode: 302,
            headers: {
                Location: `https://${DOMAIN_NAME}/unsubscribe-error?reason=error`
            }
        };
    }
};

// API handler for POST requests (for forms or API calls)
// THIS HANDLER PERFORMS THE ACTUAL UNSUBSCRIBE
exports.apiHandler = async (event) => {
    console.log('Unsubscribe API Event:', JSON.stringify(event, null, 2));
    
    // Parse request body
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        console.error('Error parsing request body:', error);
        return createResponse(400, { error: 'Invalid request body' });
    }
    
    const { email, token, reason, feedback } = body;
    
    // Validate inputs
    if (!email) {
        return createResponse(400, { error: 'Email is required' });
    }
    
    try {
        // Get subscriber
        const result = await dynamodb.get({
            TableName: DYNAMODB_TABLE,
            Key: { email }
        }).promise();
        
        if (!result.Item) {
            return createResponse(404, { error: 'Email not found' });
        }
        
        // If token provided, verify it
        if (token) {
            const expectedToken = result.Item.unsubscribeToken || generateUnsubscribeToken(email);
            if (token !== expectedToken) {
                return createResponse(401, { error: 'Invalid token' });
            }
        }
        
        // Check if already unsubscribed
        if (result.Item.status === 'unsubscribed') {
            return createResponse(200, {
                success: true,
                message: 'Already unsubscribed'
            });
        }
        
        // Update subscriber status with additional info
        const updateParams = {
            TableName: DYNAMODB_TABLE,
            Key: { email },
            UpdateExpression: 'SET #status = :status, unsubscribedAt = :timestamp, unsubscribeMethod = :method',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': 'unsubscribed',
                ':timestamp': new Date().toISOString(),
                ':method': token ? 'link' : 'api'  // If token provided, came from email link
            }
        };
        
        // Add optional fields if provided
        if (reason) {
            updateParams.UpdateExpression += ', unsubscribeReason = :reason';
            updateParams.ExpressionAttributeValues[':reason'] = reason;
        }
        
        if (feedback) {
            updateParams.UpdateExpression += ', unsubscribeFeedback = :feedback';
            updateParams.ExpressionAttributeValues[':feedback'] = feedback;
        }
        
        await dynamodb.update(updateParams).promise();
        
        // Track metric
        await trackUnsubscribeMetric(token ? 'link' : 'api');
        
        // Log unsubscribe event
        await logUnsubscribeEvent({
            email,
            method: token ? 'link' : 'api',
            reason,
            feedback,
            timestamp: new Date().toISOString()
        });
        
        return createResponse(200, {
            success: true,
            message: 'Successfully unsubscribed'
        });
        
    } catch (error) {
        console.error('Error processing unsubscribe:', error);
        return createResponse(500, { 
            error: 'Failed to unsubscribe',
            details: error.message 
        });
    }
};

// Resubscribe handler - for users who want to rejoin
exports.resubscribeHandler = async (event) => {
    console.log('Resubscribe Event:', JSON.stringify(event, null, 2));
    
    // Parse request body
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        console.error('Error parsing request body:', error);
        return createResponse(400, { error: 'Invalid request body' });
    }
    
    const { email, confirmResubscribe } = body;
    
    if (!email || !confirmResubscribe) {
        return createResponse(400, { 
            error: 'Email and confirmation required' 
        });
    }
    
    try {
        // Get subscriber
        const result = await dynamodb.get({
            TableName: DYNAMODB_TABLE,
            Key: { email }
        }).promise();
        
        if (!result.Item) {
            return createResponse(404, { 
                error: 'Email not found. Please subscribe as a new user.' 
            });
        }
        
        // Check current status
        if (result.Item.status === 'active') {
            return createResponse(200, {
                success: true,
                message: 'Already subscribed'
            });
        }
        
        // Don't allow resubscribe for bounced or complained emails
        if (result.Item.status === 'bounced' || result.Item.status === 'complained') {
            return createResponse(400, {
                error: 'This email cannot be resubscribed. Please use a different email address.'
            });
        }
        
        // Reactivate subscription
        await dynamodb.update({
            TableName: DYNAMODB_TABLE,
            Key: { email },
            UpdateExpression: 'SET #status = :status, resubscribedAt = :timestamp REMOVE unsubscribeReason, unsubscribeFeedback',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': 'active',
                ':timestamp': new Date().toISOString()
            }
        }).promise();
        
        // Track metric
        await cloudWatch.putMetricData({
            Namespace: 'Newsletter',
            MetricData: [{
                MetricName: 'Resubscribes',
                Value: 1,
                Unit: 'Count',
                Timestamp: new Date()
            }]
        }).promise();
        
        return createResponse(200, {
            success: true,
            message: 'Successfully resubscribed to the newsletter!'
        });
        
    } catch (error) {
        console.error('Error processing resubscribe:', error);
        return createResponse(500, { 
            error: 'Failed to resubscribe',
            details: error.message 
        });
    }
};

// Get unsubscribe stats for a given period
exports.statsHandler = async (event) => {
    const { apiKey } = event.queryStringParameters || {};
    
    // Simple API key check
    if (apiKey !== process.env.STATS_API_KEY) {
        return createResponse(401, { error: 'Unauthorized' });
    }
    
    try {
        // Count unsubscribed users
        const params = {
            TableName: DYNAMODB_TABLE,
            FilterExpression: '#status = :status',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': 'unsubscribed'
            },
            Select: 'COUNT'
        };
        
        const result = await dynamodb.scan(params).promise();
        
        // Get reason breakdown (would need a more complex query in production)
        const reasonParams = {
            ...params,
            Select: 'SPECIFIC_ATTRIBUTES',
            ProjectionExpression: 'unsubscribeReason, unsubscribeMethod'
        };
        
        const reasonResult = await dynamodb.scan(reasonParams).promise();
        
        // Aggregate reasons
        const reasons = {};
        const methods = {};
        
        reasonResult.Items.forEach(item => {
            if (item.unsubscribeReason) {
                reasons[item.unsubscribeReason] = (reasons[item.unsubscribeReason] || 0) + 1;
            }
            if (item.unsubscribeMethod) {
                methods[item.unsubscribeMethod] = (methods[item.unsubscribeMethod] || 0) + 1;
            }
        });
        
        return createResponse(200, {
            totalUnsubscribed: result.Count,
            byReason: reasons,
            byMethod: methods
        });
        
    } catch (error) {
        console.error('Error getting stats:', error);
        return createResponse(500, { 
            error: 'Failed to get stats',
            details: error.message 
        });
    }
};

async function logUnsubscribeEvent(data) {
    const logTableName = process.env.NEWSLETTER_LOGS_TABLE || `${DYNAMODB_TABLE}-logs`;
    
    try {
        await dynamodb.put({
            TableName: logTableName,
            Item: {
                id: `unsubscribe-${Date.now()}-${data.email}`,
                type: 'unsubscribe',
                ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year TTL
                ...data
            }
        }).promise();
    } catch (error) {
        // Don't fail the operation if logging fails
        console.error('Failed to log unsubscribe event:', error);
    }
}

function createResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': `https://${DOMAIN_NAME}`,
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: JSON.stringify(body)
    };
}