# terraform/variables.tf

variable "environment" {
  description = "Environment for the resources (e.g., dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Your domain name (e.g., myblog.com)"
  type        = string
}

variable "redirect_domain_name" {
  description = "Domain name for redirects (e.g., www.myblog.com)"
  type        = string
  default     = ""
}

variable "create_hosted_zone" {
  description = "Create Route53 hosted zone (set to false if you already have one)"
  default     = true
  type        = bool
}

variable "github_repository" {
  description = "GitHub repository in format 'username/repo'"
  type        = string
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "alert_email" {
  description = "Email address for CloudWatch operational alerts"
  type        = string
}

variable "security_alert_email" {
  description = "Email address for security alerts"
  type        = string
}

variable "publish_api_key" {
  description = "API key for publishing newsletters"
  type        = string
  sensitive   = true
}

variable "lambda_timeout" {
  description = "Timeout for Lambda functions in seconds"
  type        = number
  default     = 30
}

variable "lambda_memory" {
  description = "Memory for Lambda functions in MB"
  type        = number
  default     = 256
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "cloudtrail_retention_days" {
  description = "CloudTrail log retention in days"
  type        = number
  default     = 365
}

variable "unsubscribe_salt" {
  description = "Salt for generating unsubscribe tokens"
  type        = string
  sensitive   = true
}

variable "stats_api_key" {
  description = "API key for accessing stats endpoint"
  type        = string
  sensitive   = true
}