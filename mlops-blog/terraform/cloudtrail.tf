# cloudtrail.tf

# CloudTrail for auditing newsletter system
resource "aws_cloudtrail" "newsletter_audit" {
  name                          = "${replace(var.domain_name, ".", "-")}-newsletter-audit"
  s3_bucket_name                = aws_s3_bucket.cloudtrail_logs.bucket
  include_global_service_events = true
  is_multi_region_trail         = true
  enable_logging                = true

  # Log all management events
  advanced_event_selector {
    name = "Log all management events"

    field_selector {
      field  = "eventCategory"
      equals = ["Management"]
    }
  }

  # Log Lambda function invocations
  advanced_event_selector {
    name = "Log Lambda data events"

    field_selector {
      field  = "eventCategory"
      equals = ["Data"]
    }

    field_selector {
      field  = "resources.type"
      equals = ["AWS::Lambda::Function"]
    }

    field_selector {
      field = "resources.ARN"
      equals = [
        aws_lambda_function.subscribe_handler.arn,
        aws_lambda_function.publish_handler.arn
      ]
    }
  }

  # Log DynamoDB operations
  advanced_event_selector {
    name = "Log newsletter DynamoDB operations"

    field_selector {
      field  = "eventCategory"
      equals = ["Data"]
    }

    field_selector {
      field  = "resources.type"
      equals = ["AWS::DynamoDB::Table"]
    }

    field_selector {
      field  = "resources.ARN"
      equals = [aws_dynamodb_table.newsletter_subscribers.arn]
    }
  }

  # Enable CloudWatch Logs
  cloud_watch_logs_group_arn = "${aws_cloudwatch_log_group.cloudtrail.arn}:*"
  cloud_watch_logs_role_arn  = aws_iam_role.cloudtrail_cloudwatch.arn

  tags = {
    Name = "${var.domain_name}-newsletter-audit"
  }

  depends_on = [aws_s3_bucket_policy.cloudtrail_logs]
}

# cloudtrail log group for CloudWatch
resource "aws_cloudwatch_log_group" "cloudtrail" {
  name              = "/aws/cloudtrail/${replace(var.domain_name, ".", "-")}-newsletter"
  retention_in_days = 90

  tags = {
    Name = "${var.domain_name}-cloudtrail"
  }
}

# sns topic for security alerts
resource "aws_sns_topic" "security_alerts" {
  name = "${replace(var.domain_name, ".", "-")}-security-alerts"

  tags = {
    Name = "${var.domain_name}-security-alerts"
  }
}

resource "aws_sns_topic_subscription" "security_alert_email" {
  topic_arn = aws_sns_topic.security_alerts.arn
  protocol  = "email"
  endpoint  = var.security_alert_email
}

# config rules for compliance
resource "aws_config_config_rule" "dynamodb_encryption" {
  name = "${replace(var.domain_name, ".", "-")}-dynamodb-encryption"

  source {
    owner             = "AWS"
    source_identifier = "DYNAMODB_TABLE_ENCRYPTION_ENABLED"
  }

  scope {
    compliance_resource_types = ["AWS::DynamoDB::Table"]
    compliance_resource_id    = aws_dynamodb_table.newsletter_subscribers.id
  }

  depends_on = [aws_config_configuration_recorder_status.main]
}

resource "aws_config_config_rule" "lambda_public_access" {
  name = "${replace(var.domain_name, ".", "-")}-lambda-public-access"

  source {
    owner             = "AWS"
    source_identifier = "LAMBDA_FUNCTION_PUBLIC_ACCESS_PROHIBITED"
  }

  scope {
    compliance_resource_types = ["AWS::Lambda::Function"]
  }

  depends_on = [aws_config_configuration_recorder_status.main]
}

# athena for cloudtrail analysis
resource "aws_athena_database" "cloudtrail_analysis" {
  name   = "${replace(var.domain_name, ".", "_")}_cloudtrail"
  bucket = aws_s3_bucket.cloudtrail_logs.bucket

  comment = "Database for analyzing CloudTrail logs for ${var.domain_name}"
}