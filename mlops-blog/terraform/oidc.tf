# github-oidc.tf

# Create the GitHub OIDC provider
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  # GitHub's OIDC thumbprint
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

# Create the IAM role for GitHub Actions
resource "aws_iam_role" "github_actions" {
  name = "github-actions-buildmlops"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            # IMPORTANT: Replace YOUR_GITHUB_USERNAME with your actual GitHub username
            "token.actions.githubusercontent.com:sub" = "repo:YOUR_GITHUB_USERNAME/buildmlops:*"
          }
        }
      }
    ]
  })

  tags = {
    Name = "GitHub Actions Deploy Role for buildmlops.com"
  }
}

# Create IAM policy for S3 and CloudFront access
resource "aws_iam_role_policy" "github_actions_deploy" {
  name = "buildmlops-deploy-policy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket",
          "s3:GetBucketLocation"
        ]
        Resource = [
          aws_s3_bucket.blog.arn,
          aws_s3_bucket.redirect.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:PutObjectAcl"
        ]
        Resource = [
          "${aws_s3_bucket.blog.arn}/*",
          "${aws_s3_bucket.redirect.arn}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations"
        ]
        Resource = [
          aws_cloudfront_distribution.blog.arn,
          aws_cloudfront_distribution.redirect.arn
        ]
      }
    ]
  })
}