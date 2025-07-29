#!/bin/bash
# deploy-lambdas.sh

echo "Deploying Lambda functions..."

# Go up to parent directory where lambda folder is
cd ..

# Package Subscribe Lambda
echo "Packaging Subscribe Lambda..."
cd lambda/subscribe
rm -f subscribe.zip
zip -r subscribe.zip . -x "*.zip" -x "*.git*" -x ".env"
cd ../..

# Package Publish Lambda
echo "Packaging Publish Lambda..."
cd lambda/publish
rm -f publish.zip
zip -r publish.zip . -x "*.zip" -x "*.git*" -x ".env"
cd ../..

# Package Unsubscribe Lambda
echo "Packaging Unsubscribe Lambda..."
cd lambda/unsubscribe
rm -f unsubscribe.zip
zip -r unsubscribe.zip . -x "*.zip" -x "*.git*" -x ".env"
cd ../..

echo ""
echo "Lambda functions packaged successfully!"
echo "Zip files created:"
echo "  - lambda/subscribe/subscribe.zip"
echo "  - lambda/publish/publish.zip"
echo "  - lambda/unsubscribe/unsubscribe.zip"