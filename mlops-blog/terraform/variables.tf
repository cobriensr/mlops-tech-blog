# terraform/variables.tf
variable "aws_region" {
  description = "AWS region for S3 bucket"
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Your domain name (e.g., myblog.com)"
  type        = string
}

variable "create_hosted_zone" {
  description = "Create Route53 hosted zone (set to false if you already have one)"
  default     = true
  type        = bool
}

variable "redirect_domain_name" {
  description = "Domain that redirects to primary domain"
  type        = string
  default     = ""
}