# ses.tf

# SNS topic for SES notifications (bounces, complaints)
resource "aws_sns_topic" "ses_notifications" {
  name = "${replace(var.domain_name, ".", "-")}-ses-notifications"

  tags = {
    Name = "${var.domain_name}-ses-notifications"
  }
}

# Subscribe Lambda to SNS topic
resource "aws_sns_topic_subscription" "ses_lambda" {
  topic_arn = aws_sns_topic.ses_notifications.arn
  protocol  = "lambda"
  endpoint  = aws_lambda_function.ses_event_handler.arn
}

# Lambda permission for SNS to invoke the function
resource "aws_lambda_permission" "ses_sns" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ses_event_handler.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.ses_notifications.arn
}

# SES Configuration Set for tracking
resource "aws_ses_configuration_set" "newsletter" {
  name                       = "${replace(var.domain_name, ".", "-")}-newsletter"
  reputation_metrics_enabled = true
}

# SES Event Destination for bounces and complaints
resource "aws_ses_event_destination" "sns" {
  name                   = "sns-destination"
  configuration_set_name = aws_ses_configuration_set.newsletter.name
  enabled                = true
  matching_types         = ["bounce", "complaint", "delivery", "reject"]

  sns_destination {
    topic_arn = aws_sns_topic.ses_notifications.arn
  }


}
