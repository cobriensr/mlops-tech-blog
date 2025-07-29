// main.tf

# ACM Certificate
resource "aws_acm_certificate" "cert" {
  provider                  = aws.us_east_1
  domain_name               = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "cert" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# ACM certificate for redirect domain
resource "aws_acm_certificate" "redirect" {
  provider                  = aws.us_east_1
  domain_name               = var.redirect_domain_name
  subject_alternative_names = ["www.${var.redirect_domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "redirect" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.redirect.arn
  validation_record_fqdns = [for record in aws_route53_record.redirect_cert_validation : record.fqdn]
}

# Config Recorder prerequisites
resource "aws_config_configuration_recorder" "main" {
  name     = "${replace(var.domain_name, ".", "-")}-recorder"
  role_arn = aws_iam_role.config_role.arn

  recording_group {
    all_supported = true
  }

  depends_on = [aws_iam_role_policy_attachment.config_policy]
}

resource "aws_config_delivery_channel" "main" {
  name           = "${replace(var.domain_name, ".", "-")}-delivery-channel"
  s3_bucket_name = aws_s3_bucket.cloudtrail_logs.bucket

  depends_on = [
    aws_config_configuration_recorder.main,
    aws_s3_bucket_policy.config_logging
  ]
}

resource "aws_config_configuration_recorder_status" "main" {
  name       = aws_config_configuration_recorder.main.name
  is_enabled = true

  depends_on = [
    aws_config_configuration_recorder.main,
    aws_config_delivery_channel.main
  ]
}