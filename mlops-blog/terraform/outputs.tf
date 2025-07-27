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