# cloudwatch.tf

resource "aws_cloudwatch_log_group" "subscribe_lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.subscribe_handler.function_name}"
  retention_in_days = 30

  tags = {
    Name = "${var.domain_name}-subscribe-logs"
  }
}

resource "aws_cloudwatch_log_group" "publish_lambda_logs" {
  name              = "/aws/lambda/${aws_lambda_function.publish_handler.function_name}"
  retention_in_days = 30

  tags = {
    Name = "${var.domain_name}-publish-logs"
  }
}

resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  name              = "/aws/apigateway/${aws_apigatewayv2_api.newsletter_api.name}"
  retention_in_days = 30

  tags = {
    Name = "${var.domain_name}-api-logs"
  }
}

# Count subscription attempts
resource "aws_cloudwatch_log_metric_filter" "subscription_attempts" {
  name           = "${var.domain_name}-subscription-attempts"
  log_group_name = aws_cloudwatch_log_group.subscribe_lambda_logs.name
  pattern        = "[time, request_id, event_type=Subscribe Event]"

  metric_transformation {
    name      = "SubscriptionAttempts"
    namespace = "Newsletter/${var.domain_name}"
    value     = "1"
    unit      = "Count"
  }
}

# Count subscription errors
resource "aws_cloudwatch_log_metric_filter" "subscription_errors" {
  name           = "${var.domain_name}-subscription-errors"
  log_group_name = aws_cloudwatch_log_group.subscribe_lambda_logs.name
  pattern        = "[time, request_id, level=ERROR]"

  metric_transformation {
    name      = "SubscriptionErrors"
    namespace = "Newsletter/${var.domain_name}"
    value     = "1"
    unit      = "Count"
  }
}

# Count newsletters sent
resource "aws_cloudwatch_log_metric_filter" "newsletters_sent" {
  name           = "${var.domain_name}-newsletters-sent"
  log_group_name = aws_cloudwatch_log_group.publish_lambda_logs.name
  pattern        = "{ $.message = \"Newsletter sent successfully\" }"

  metric_transformation {
    name      = "NewslettersSent"
    namespace = "Newsletter/${var.domain_name}"
    value     = "1"
    unit      = "Count"
  }
}

# High error rate alarm for Subscribe Lambda
resource "aws_cloudwatch_metric_alarm" "subscribe_error_rate" {
  alarm_name          = "${var.domain_name}-subscribe-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors subscribe lambda errors"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.subscribe_handler.function_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# High error rate alarm for Publish Lambda
resource "aws_cloudwatch_metric_alarm" "publish_error_rate" {
  alarm_name          = "${var.domain_name}-publish-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "This metric monitors publish lambda errors"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.publish_handler.function_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# Lambda throttling alarm
resource "aws_cloudwatch_metric_alarm" "lambda_throttles" {
  alarm_name          = "${var.domain_name}-lambda-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "This metric monitors lambda throttling"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = aws_lambda_function.subscribe_handler.function_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# DynamoDB throttling alarm
resource "aws_cloudwatch_metric_alarm" "dynamodb_throttles" {
  alarm_name          = "${var.domain_name}-dynamodb-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "SystemErrors"
  namespace           = "AWS/DynamoDB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "This metric monitors DynamoDB throttling"
  treat_missing_data  = "notBreaching"

  dimensions = {
    TableName = aws_dynamodb_table.newsletter_subscribers.name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# API Gateway 4XX errors
resource "aws_cloudwatch_metric_alarm" "api_4xx_errors" {
  alarm_name          = "${var.domain_name}-api-4xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "4xx"
  namespace           = "AWS/ApiGateway"
  period              = "300"
  statistic           = "Sum"
  threshold           = "50"
  alarm_description   = "This metric monitors API Gateway 4XX errors"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ApiId = aws_apigatewayv2_api.newsletter_api.id
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# SES bounce rate alarm
resource "aws_cloudwatch_metric_alarm" "ses_bounce_rate" {
  alarm_name          = "${var.domain_name}-ses-high-bounce-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Bounce"
  namespace           = "AWS/SES"
  period              = "300"
  statistic           = "Average"
  threshold           = "0.05" # 5% bounce rate
  alarm_description   = "This metric monitors SES bounce rate"
  treat_missing_data  = "notBreaching"

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# sns topic for alerts
resource "aws_sns_topic" "alerts" {
  name = "${replace(var.domain_name, ".", "-")}-newsletter-alerts"

  tags = {
    Name = "${var.domain_name}-alerts"
  }
}

resource "aws_sns_topic_subscription" "alert_email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# cloudwatch dashboard for newsletter metrics
resource "aws_cloudwatch_dashboard" "newsletter" {
  dashboard_name = "${replace(var.domain_name, ".", "-")}-newsletter"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["Newsletter/${var.domain_name}", "SubscriptionAttempts"],
            [".", "SubscriptionErrors"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Subscription Activity"
          period  = 300
          stat    = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", aws_lambda_function.subscribe_handler.function_name],
            [".", "Errors", ".", "."],
            [".", "Duration", ".", ".", { stat = "Average" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Subscribe Lambda Metrics"
          period  = 300
          stat    = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", aws_lambda_function.publish_handler.function_name],
            [".", "Errors", ".", "."],
            [".", "Duration", ".", ".", { stat = "Average" }]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Publish Lambda Metrics"
          period  = 300
          stat    = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", aws_dynamodb_table.newsletter_subscribers.name],
            [".", "ConsumedWriteCapacityUnits", ".", "."],
            [".", "SystemErrors", ".", "."]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "DynamoDB Metrics"
          period  = 300
          stat    = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 24
        height = 6

        properties = {
          metrics = [
            ["AWS/SES", "Send"],
            [".", "Bounce"],
            [".", "Complaint"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Email Sending Metrics"
          period  = 300
          stat    = "Sum"
        }
      }
    ]
  })
}

# cloudwatch insight queries for CloudTrail logs
resource "aws_cloudwatch_query_definition" "unauthorized_api_calls" {
  name = "${var.domain_name}-unauthorized-api-calls"

  log_group_names = [
    aws_cloudwatch_log_group.cloudtrail.name
  ]

  query_string = <<EOF
fields @timestamp, userIdentity.principalId, eventName, errorCode, sourceIPAddress
| filter errorCode like /Unauthorized|Forbidden|Denied/
| sort @timestamp desc
| limit 100
EOF
}

resource "aws_cloudwatch_query_definition" "newsletter_publish_audit" {
  name = "${var.domain_name}-newsletter-publish-audit"

  log_group_names = [
    aws_cloudwatch_log_group.cloudtrail.name
  ]

  query_string = <<EOF
fields @timestamp, userIdentity.principalId, sourceIPAddress, responseElements
| filter eventName = "Invoke" and resources.0.ARN = "${aws_lambda_function.publish_handler.arn}"
| sort @timestamp desc
| limit 50
EOF
}

resource "aws_cloudwatch_query_definition" "subscriber_data_access" {
  name = "${var.domain_name}-subscriber-data-access"

  log_group_names = [
    aws_cloudwatch_log_group.cloudtrail.name
  ]

  query_string = <<EOF
fields @timestamp, userIdentity.principalId, eventName, requestParameters.tableName
| filter requestParameters.tableName = "${aws_dynamodb_table.newsletter_subscribers.name}"
| sort @timestamp desc
| limit 100
EOF
}

# cloudwatch alarms for security monitoring
resource "aws_cloudwatch_log_metric_filter" "unauthorized_api_calls" {
  name           = "${var.domain_name}-unauthorized-api-calls"
  log_group_name = aws_cloudwatch_log_group.cloudtrail.name
  pattern        = "{ ($.errorCode = *UnauthorizedOperation) || ($.errorCode = AccessDenied*) }"

  metric_transformation {
    name      = "UnauthorizedAPICalls"
    namespace = "CloudTrail/${var.domain_name}"
    value     = "1"
    unit      = "Count"
  }
}

resource "aws_cloudwatch_metric_alarm" "unauthorized_api_calls" {
  alarm_name          = "${var.domain_name}-unauthorized-api-calls"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "UnauthorizedAPICalls"
  namespace           = "CloudTrail/${var.domain_name}"
  period              = "300"
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "This metric monitors unauthorized API calls"
  treat_missing_data  = "notBreaching"

  alarm_actions = [aws_sns_topic.security_alerts.arn]
}