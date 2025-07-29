output "cloudfront_distribution_id" {
  value       = aws_cloudfront_distribution.blog.id
  description = "CloudFront distribution ID for cache invalidation"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.blog.id
  description = "S3 bucket name for deployment"
}

output "cloudfront_url" {
  value       = "https://${aws_cloudfront_distribution.blog.domain_name}"
  description = "CloudFront URL"
}

output "website_url" {
  value       = "https://${var.domain_name}"
  description = "Your website URL"
}

output "name_servers" {
  value       = aws_route53_zone.main.name_servers
  description = "Name servers for your domain (if hosted zone was created)"
}

output "redirect_nameservers" {
  value       = aws_route53_zone.redirect.name_servers
  description = "Nameservers for redirect domain"
}

# Output the role ARN for use in GitHub Actions
output "github_actions_role_arn" {
  value       = aws_iam_role.github_actions.arn
  description = "ARN of the IAM role for GitHub Actions OIDC"
}

output "subscribe_endpoint" {
  value = "${aws_apigatewayv2_stage.newsletter_stage.invoke_url}/subscribe"
}

output "publish_endpoint" {
  value = "${aws_apigatewayv2_stage.newsletter_stage.invoke_url}/publish"
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.newsletter_subscribers.name
}

output "dashboard_url" {
  value = "https://console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${aws_cloudwatch_dashboard.newsletter.dashboard_name}"
}

output "sns_topic_arn" {
  value = aws_sns_topic.alerts.arn
}

output "cloudtrail_name" {
  value = aws_cloudtrail.newsletter_audit.name
}

output "security_alerts_topic" {
  value = aws_sns_topic.security_alerts.arn
}

output "newsletter_api_endpoint" {
  description = "API Gateway endpoint for newsletter operations"
  value       = aws_apigatewayv2_stage.newsletter_stage.invoke_url
}

output "ses_configuration_set" {
  description = "SES Configuration Set name for tracking"
  value       = aws_ses_configuration_set.newsletter.name
}

output "dynamodb_tables" {
  description = "DynamoDB table names"
  value = {
    subscribers = aws_dynamodb_table.newsletter_subscribers.name
    logs        = aws_dynamodb_table.newsletter_logs.name
  }
}

output "lambda_functions" {
  description = "Lambda function names"
  value = {
    subscribe   = aws_lambda_function.subscribe_handler.function_name
    publish     = aws_lambda_function.publish_handler.function_name
    unsubscribe = aws_lambda_function.unsubscribe_handler.function_name
    confirm     = aws_lambda_function.confirm_handler.function_name
    ses_events  = aws_lambda_function.ses_event_handler.function_name
  }
}

output "sns_topic" {
  description = "SNS topic for SES events"
  value       = aws_sns_topic.ses_notifications.arn
}

output "newsletter_endpoints" {
  description = "All newsletter API endpoints"
  value = {
    subscribe = "${aws_apigatewayv2_stage.newsletter_stage.invoke_url}/subscribe"
    publish   = "${aws_apigatewayv2_stage.newsletter_stage.invoke_url}/publish"
    confirm   = "${aws_apigatewayv2_stage.newsletter_stage.invoke_url}/confirm"
    unsubscribe = {
      link        = "${aws_apigatewayv2_stage.newsletter_stage.invoke_url}/unsubscribe"
      api         = "${aws_apigatewayv2_stage.newsletter_stage.invoke_url}/api/unsubscribe"
      resubscribe = "${aws_apigatewayv2_stage.newsletter_stage.invoke_url}/api/resubscribe"
      stats       = "${aws_apigatewayv2_stage.newsletter_stage.invoke_url}/api/unsubscribe/stats"
    }
  }
}

output "example_unsubscribe_url" {
  description = "Example unsubscribe URL format"
  value       = "https://${var.domain_name}/unsubscribe?email=USER_EMAIL&token=USER_TOKEN"
}