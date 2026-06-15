#!/bin/bash
set -e

STAGE=${1:-dev}
SERVICE_NAME="aws-reg-app-frontend"

pre_deploy() {
  echo "Creating dist folder and copying frontend assets..."
  mkdir -p dist
  cp -r css dist/
  cp -r js dist/
  cp index.html dist/
  cp register.html dist/
  cp login.html dist/
  cp home.html dist/
  cp about.html dist/
  echo "Frontend preparation complete."
}

post_deploy() {
  echo "Cleaning up dist folder..."
  rm -rf dist

  echo "Running CloudFront invalidation..."
  set +e
  DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name ${SERVICE_NAME}-${STAGE} \
    --query "Stacks[0].Outputs[?ExportName=='${STAGE}-CloudFrontDistributionId'].OutputValue" \
    --output text)

  if [ -n "$DISTRIBUTION_ID" ]; then
    INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" \
      --output text --query 'Invalidation.Id')

    DOMAIN_NAME=$(aws cloudformation describe-stacks --stack-name ${SERVICE_NAME}-${STAGE} \
      --query "Stacks[0].Outputs[?ExportName=='${STAGE}-CloudFrontDomainName'].OutputValue" \
      --output text)

    echo "✅ Invalidation submitted (ID: $INVALIDATION_ID)"
    echo "🌐 CloudFront CDN URL: https://$DOMAIN_NAME"
  else
    echo "⚠️ No Distribution ID found. Skipping invalidation."
  fi
}

case "$2" in
  pre)
    pre_deploy
    ;;
  post)
    post_deploy
    ;;
  *)
    echo "Usage: $0 <stage> {pre|post}"
    exit 1
    ;;
esac
