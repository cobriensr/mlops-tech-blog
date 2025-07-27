#!/bin/bash
# scripts/deploy.sh

# Load environment variables
source .env.production

echo "🚀 Building Next.js site..."
npm run build

echo "📦 Syncing to S3..."
aws s3 sync ./out s3://$S3_BUCKET_NAME \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html"

aws s3 sync ./out s3://$S3_BUCKET_NAME \
  --cache-control "public, max-age=0, must-revalidate" \
  --exclude "*" \
  --include "*.html"

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*" \
  --query "Invalidation.Id" \
  --output text

echo "✅ Deployment complete!"