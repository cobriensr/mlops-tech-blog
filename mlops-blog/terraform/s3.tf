// s3.tf

# S3 Bucket for hosting
resource "aws_s3_bucket" "blog" {
  bucket = var.domain_name
}

resource "aws_s3_bucket_public_access_block" "blog" {
  bucket = aws_s3_bucket.blog.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "blog" {
  bucket = aws_s3_bucket.blog.id

  versioning_configuration {
    status = "Enabled"
  }
}

# S3 bucket policy for CloudFront
resource "aws_s3_bucket_policy" "blog" {
  bucket = aws_s3_bucket.blog.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.blog.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.blog.arn
          }
        }
      }
    ]
  })
}

# Redirect domain S3 bucket
resource "aws_s3_bucket" "redirect" {
  bucket = var.redirect_domain_name
}

resource "aws_s3_bucket_website_configuration" "redirect" {
  bucket = aws_s3_bucket.redirect.id

  redirect_all_requests_to {
    host_name = var.domain_name
    protocol  = "https"
  }
}

resource "aws_s3_bucket_public_access_block" "redirect" {
  bucket = aws_s3_bucket.redirect.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# s3 bucket for cloudtrail logs
resource "aws_s3_bucket" "cloudtrail_logs" {
  bucket        = "${replace(var.domain_name, ".", "-")}-cloudtrail-logs"
  force_destroy = true

  tags = {
    Name = "${var.domain_name}-cloudtrail-logs"
  }
}

resource "aws_s3_bucket_public_access_block" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  rule {
    id     = "delete-old-logs"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    filter {}

    expiration {
      days = 365 # Keep logs for 1 year
    }
  }
}

# Create an S3 bucket for Lambda deployments
resource "aws_s3_bucket" "lambda_deployments" {
  bucket = "${var.domain_name}-lambda-deployments"
}

# Upload Lambda packages to S3
resource "aws_s3_object" "publish_lambda" {
  bucket = aws_s3_bucket.lambda_deployments.id
  key    = "publish/function.zip"
  source = "${path.module}/../lambda/publish/publish.zip"
  etag   = filemd5("${path.module}/../lambda/publish/publish.zip")
}

resource "aws_s3_object" "subscribe_lambda" {
  bucket = aws_s3_bucket.lambda_deployments.id
  key    = "subscribe/function.zip"
  source = "${path.module}/../lambda/subscribe/subscribe.zip"
  etag   = filemd5("${path.module}/../lambda/subscribe/subscribe.zip")
}

# S3 bucket policy for Config
resource "aws_s3_bucket_policy" "config_logging" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AWSConfigBucketPermissionsCheck"
        Effect = "Allow"
        Principal = {
          Service = "config.amazonaws.com"
        }
        Action   = "s3:GetBucketAcl"
        Resource = aws_s3_bucket.cloudtrail_logs.arn
        Condition = {
          StringEquals = {
            "AWS:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Sid    = "AWSConfigBucketExistenceCheck"
        Effect = "Allow"
        Principal = {
          Service = "config.amazonaws.com"
        }
        Action   = "s3:ListBucket"
        Resource = aws_s3_bucket.cloudtrail_logs.arn
        Condition = {
          StringEquals = {
            "AWS:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      },
      {
        Sid    = "AWSConfigBucketDelivery"
        Effect = "Allow"
        Principal = {
          Service = "config.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.cloudtrail_logs.arn}/AWSLogs/${data.aws_caller_identity.current.account_id}/Config/*"
        Condition = {
          StringEquals = {
            "s3:x-amz-acl"      = "bucket-owner-full-control"
            "AWS:SourceAccount" = data.aws_caller_identity.current.account_id
          }
        }
      }
    ]
  })
}

resource "aws_s3_bucket_policy" "cloudtrail_logs" {
  bucket = aws_s3_bucket.cloudtrail_logs.id

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AWSCloudTrailAclCheck",
            "Effect": "Allow",
            "Principal": {
              "Service": "cloudtrail.amazonaws.com"
            },
            "Action": "s3:GetBucketAcl",
            "Resource": "${aws_s3_bucket.cloudtrail_logs.arn}"
        },
        {
            "Sid": "AWSCloudTrailWrite",
            "Effect": "Allow",
            "Principal": {
              "Service": "cloudtrail.amazonaws.com"
            },
            "Action": "s3:PutObject",
            "Resource": "${aws_s3_bucket.cloudtrail_logs.arn}/AWSLogs/${data.aws_caller_identity.current.account_id}/*",
            "Condition": {
                "StringEquals": {
                    "s3:x-amz-acl": "bucket-owner-full-control"
                }
            }
        }
    ]
}
POLICY
}

resource "aws_s3_object" "unsubscribe_lambda" {
  bucket = aws_s3_bucket.lambda_deployments.id
  key    = "unsubscribe/function.zip"
  source = "${path.module}/../lambda/unsubscribe/unsubscribe.zip"
  etag   = filemd5("${path.module}/../lambda/unsubscribe/unsubscribe.zip")
}