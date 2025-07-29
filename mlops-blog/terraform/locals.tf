// locals.tf

locals {
  s3_origin_id         = "S3-${var.domain_name}"
  redirect_domain_name = var.redirect_domain_name != "" ? var.redirect_domain_name : "www.${var.domain_name}"
  security_alert_email = var.security_alert_email != "" ? var.security_alert_email : var.alert_email

  # Tags to apply to all resources
  common_tags = {
    Project     = var.domain_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}