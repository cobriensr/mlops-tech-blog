// lambda.tf

# Subscribe Lambda
resource "aws_lambda_function" "subscribe_handler" {
  s3_bucket     = aws_s3_bucket.lambda_deployments.id
  s3_key        = aws_s3_object.subscribe_lambda.key
  depends_on    = [aws_s3_object.subscribe_lambda]
  function_name = "${replace(var.domain_name, ".", "-")}-subscribe"
  role          = aws_iam_role.subscribe_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 30

  environment {
    variables = {
      DYNAMODB_TABLE  = aws_dynamodb_table.newsletter_subscribers.name
      DOMAIN_NAME     = var.domain_name
      FROM_EMAIL      = "newsletter@${var.domain_name}"
      PUBLISH_API_KEY = var.publish_api_key
    }
  }
}

# Publish Lambda
resource "aws_lambda_function" "publish_handler" {
  s3_bucket     = aws_s3_bucket.lambda_deployments.id
  s3_key        = aws_s3_object.publish_lambda.key
  depends_on    = [aws_s3_object.publish_lambda]
  function_name = "${replace(var.domain_name, ".", "-")}-publish"
  role          = aws_iam_role.publish_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 300

  environment {
    variables = {
      DYNAMODB_TABLE  = aws_dynamodb_table.newsletter_subscribers.name
      DOMAIN_NAME     = var.domain_name
      FROM_EMAIL      = "newsletter@${var.domain_name}"
      PUBLISH_API_KEY = var.publish_api_key
    }
  }
}

# Unsubscribe Lambda
resource "aws_lambda_function" "unsubscribe_handler" {
  s3_bucket  = aws_s3_bucket.lambda_deployments.id
  s3_key     = aws_s3_object.unsubscribe_lambda.key
  depends_on = [aws_s3_object.unsubscribe_lambda]

  function_name = "${replace(var.domain_name, ".", "-")}-unsubscribe"
  role          = aws_iam_role.unsubscribe_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  timeout       = 30

  environment {
    variables = {
      DYNAMODB_TABLE        = aws_dynamodb_table.newsletter_subscribers.name
      DOMAIN_NAME           = var.domain_name
      UNSUBSCRIBE_SALT      = var.unsubscribe_salt
      NEWSLETTER_LOGS_TABLE = aws_dynamodb_table.newsletter_logs.name
      STATS_API_KEY         = var.stats_api_key
    }
  }
}

# Lambda for handling different unsubscribe endpoints
resource "aws_lambda_function" "unsubscribe_api_handler" {
  s3_bucket  = aws_s3_bucket.lambda_deployments.id
  s3_key     = aws_s3_object.unsubscribe_lambda.key
  depends_on = [aws_s3_object.unsubscribe_lambda]

  function_name = "${replace(var.domain_name, ".", "-")}-unsubscribe-api"
  role          = aws_iam_role.unsubscribe_lambda_role.arn
  handler       = "index.apiHandler"
  runtime       = "nodejs20.x"
  timeout       = 30

  environment {
    variables = {
      DYNAMODB_TABLE        = aws_dynamodb_table.newsletter_subscribers.name
      DOMAIN_NAME           = var.domain_name
      UNSUBSCRIBE_SALT      = var.unsubscribe_salt
      NEWSLETTER_LOGS_TABLE = aws_dynamodb_table.newsletter_logs.name
    }
  }
}

resource "aws_lambda_function" "resubscribe_handler" {
  s3_bucket  = aws_s3_bucket.lambda_deployments.id
  s3_key     = aws_s3_object.unsubscribe_lambda.key
  depends_on = [aws_s3_object.unsubscribe_lambda]

  function_name = "${replace(var.domain_name, ".", "-")}-resubscribe"
  role          = aws_iam_role.unsubscribe_lambda_role.arn
  handler       = "index.resubscribeHandler"
  runtime       = "nodejs20.x"
  timeout       = 30

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.newsletter_subscribers.name
      DOMAIN_NAME    = var.domain_name
    }
  }
}

resource "aws_lambda_function" "unsubscribe_stats_handler" {
  s3_bucket  = aws_s3_bucket.lambda_deployments.id
  s3_key     = aws_s3_object.unsubscribe_lambda.key
  depends_on = [aws_s3_object.unsubscribe_lambda]

  function_name = "${replace(var.domain_name, ".", "-")}-unsubscribe-stats"
  role          = aws_iam_role.unsubscribe_lambda_role.arn
  handler       = "index.statsHandler"
  runtime       = "nodejs20.x"
  timeout       = 30

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.newsletter_subscribers.name
      STATS_API_KEY  = var.stats_api_key
    }
  }
}

# Update the confirmHandler in subscribe lambda
resource "aws_lambda_function" "confirm_handler" {
  s3_bucket  = aws_s3_bucket.lambda_deployments.id
  s3_key     = aws_s3_object.subscribe_lambda.key
  depends_on = [aws_s3_object.subscribe_lambda]

  function_name = "${replace(var.domain_name, ".", "-")}-confirm"
  role          = aws_iam_role.subscribe_lambda_role.arn
  handler       = "index.confirmHandler"
  runtime       = "nodejs20.x"
  timeout       = 30

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.newsletter_subscribers.name
      DOMAIN_NAME    = var.domain_name
      FROM_EMAIL     = "newsletter@${var.domain_name}"
    }
  }
}

# SES Event Handler Lambda
resource "aws_lambda_function" "ses_event_handler" {
  s3_bucket  = aws_s3_bucket.lambda_deployments.id
  s3_key     = aws_s3_object.subscribe_lambda.key
  depends_on = [aws_s3_object.subscribe_lambda]

  function_name = "${replace(var.domain_name, ".", "-")}-ses-events"
  role          = aws_iam_role.ses_event_lambda_role.arn
  handler       = "index.sesEventHandler"
  runtime       = "nodejs20.x"
  timeout       = 30

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.newsletter_subscribers.name
    }
  }
}
