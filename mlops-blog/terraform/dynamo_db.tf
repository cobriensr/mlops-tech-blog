// dynamo_db.tf

resource "aws_dynamodb_table" "newsletter_subscribers" {
  name         = "${replace(var.domain_name, ".", "-")}-subscribers"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "email"

  attribute {
    name = "email"
    type = "S"
  }

  # Global Secondary Index for querying active subscribers
  global_secondary_index {
    name            = "status-index"
    hash_key        = "status"
    projection_type = "ALL"
  }

  attribute {
    name = "status"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name = "${var.domain_name}-newsletter"
  }
}

# Newsletter logs table for analytics
resource "aws_dynamodb_table" "newsletter_logs" {
  name         = "${replace(var.domain_name, ".", "-")}-newsletter-logs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  # TTL to automatically delete old logs
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = {
    Name = "${var.domain_name}-newsletter-logs"
  }
}
