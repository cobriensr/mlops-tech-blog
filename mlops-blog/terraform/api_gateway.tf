// api_gateway.tf

# api gateway
resource "aws_apigatewayv2_api" "newsletter_api" {
  name          = "${replace(var.domain_name, ".", "-")}-newsletter-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["https://${var.domain_name}", "https://www.${var.domain_name}", "https://${var.redirect_domain_name}", "https://www.${var.redirect_domain_name}"]
    allow_methods = ["POST", "GET", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 86400
  }
}

# Subscribe Integration
resource "aws_apigatewayv2_integration" "subscribe_integration" {
  api_id             = aws_apigatewayv2_api.newsletter_api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.subscribe_handler.invoke_arn
}

# Subscribe Route
resource "aws_apigatewayv2_route" "subscribe_route" {
  api_id    = aws_apigatewayv2_api.newsletter_api.id
  route_key = "POST /subscribe"
  target    = "integrations/${aws_apigatewayv2_integration.subscribe_integration.id}"
}

# Publish Integration (protected with API key)
resource "aws_apigatewayv2_integration" "publish_integration" {
  api_id             = aws_apigatewayv2_api.newsletter_api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.publish_handler.invoke_arn
}

# Publish Route
resource "aws_apigatewayv2_route" "publish_route" {
  api_id    = aws_apigatewayv2_api.newsletter_api.id
  route_key = "POST /publish"
  target    = "integrations/${aws_apigatewayv2_integration.publish_integration.id}"
  # Note: Add authorizer for security
}

# API Stage
resource "aws_apigatewayv2_stage" "newsletter_stage" {
  api_id      = aws_apigatewayv2_api.newsletter_api.id
  name        = "prod"
  auto_deploy = true
}

# Lambda Permissions
resource "aws_lambda_permission" "subscribe_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.subscribe_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.newsletter_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "publish_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.publish_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.newsletter_api.execution_arn}/*/*"
}

# Unsubscribe Integration (GET)
resource "aws_apigatewayv2_integration" "unsubscribe_integration" {
  api_id             = aws_apigatewayv2_api.newsletter_api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.unsubscribe_handler.invoke_arn
}

# Unsubscribe Route (GET)
resource "aws_apigatewayv2_route" "unsubscribe_route" {
  api_id    = aws_apigatewayv2_api.newsletter_api.id
  route_key = "GET /unsubscribe"
  target    = "integrations/${aws_apigatewayv2_integration.unsubscribe_integration.id}"
}

# Unsubscribe API Integration (POST)
resource "aws_apigatewayv2_integration" "unsubscribe_api_integration" {
  api_id             = aws_apigatewayv2_api.newsletter_api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.unsubscribe_api_handler.invoke_arn
}

# Unsubscribe API Route (POST)
resource "aws_apigatewayv2_route" "unsubscribe_api_route" {
  api_id    = aws_apigatewayv2_api.newsletter_api.id
  route_key = "POST /api/unsubscribe"
  target    = "integrations/${aws_apigatewayv2_integration.unsubscribe_api_integration.id}"
}

# Resubscribe Integration
resource "aws_apigatewayv2_integration" "resubscribe_integration" {
  api_id             = aws_apigatewayv2_api.newsletter_api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.resubscribe_handler.invoke_arn
}

# Resubscribe Route
resource "aws_apigatewayv2_route" "resubscribe_route" {
  api_id    = aws_apigatewayv2_api.newsletter_api.id
  route_key = "POST /api/resubscribe"
  target    = "integrations/${aws_apigatewayv2_integration.resubscribe_integration.id}"
}

# Stats Integration
resource "aws_apigatewayv2_integration" "unsubscribe_stats_integration" {
  api_id             = aws_apigatewayv2_api.newsletter_api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.unsubscribe_stats_handler.invoke_arn
}

# Stats Route
resource "aws_apigatewayv2_route" "unsubscribe_stats_route" {
  api_id    = aws_apigatewayv2_api.newsletter_api.id
  route_key = "GET /api/unsubscribe/stats"
  target    = "integrations/${aws_apigatewayv2_integration.unsubscribe_stats_integration.id}"
}

# Confirm Integration
resource "aws_apigatewayv2_integration" "confirm_integration" {
  api_id             = aws_apigatewayv2_api.newsletter_api.id
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.confirm_handler.invoke_arn
}

# Confirm Route
resource "aws_apigatewayv2_route" "confirm_route" {
  api_id    = aws_apigatewayv2_api.newsletter_api.id
  route_key = "GET /confirm"
  target    = "integrations/${aws_apigatewayv2_integration.confirm_integration.id}"
}

# Lambda Permissions for API Gateway
resource "aws_lambda_permission" "unsubscribe_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.unsubscribe_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.newsletter_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "unsubscribe_api_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.unsubscribe_api_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.newsletter_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "resubscribe_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.resubscribe_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.newsletter_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "unsubscribe_stats_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.unsubscribe_stats_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.newsletter_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "confirm_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.confirm_handler.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.newsletter_api.execution_arn}/*/*"
}