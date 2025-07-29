# mlops-tech-blog

S3 + Cloudfront deployment for an ml ops tech blog

## Newsletter System Architecture

### System Overview

```bash
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   S3 Website    │────▶│   CloudFront     │────▶│     Users       │
│  (Static Site)  │     │  (CDN + HTTPS)   │     │  (Subscribers)  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                                                 │
         │                                                 │
         ▼                                                 ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Newsletter Form │────▶│  API Gateway     │────▶│ Subscribe Lambda│
│   (/newsletter) │     │  (HTTP API)      │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                               ┌──────────────────────────┼───────────┐
                               │                          ▼           │
                               │                  ┌─────────────────┐ │
                               │                  │   DynamoDB      │ │
                               │                  │  (Subscribers)  │ │
                               │                  └─────────────────┘ │
                               │                          ▲           │
┌─────────────────┐            │                          │           │
│  Admin Panel    │────────────┼──────────────────────────┘           │
│ (/admin/news..) │            │                                      │
└─────────────────┘            │      ┌─────────────────┐             │
         │                     │      │  Publish Lambda │             │
         ▼                     │      │                 │             │
┌─────────────────┐            │      └─────────────────┘             │
│   API Gateway   │────────────┼──────────────┘                       │
│  (Protected)    │            │                                      │
└─────────────────┘            │      ┌─────────────────┐             │
                               └─────▶│   Amazon SES    │─────────────┘
                                      │  (Email Send)   │
                                      └─────────────────┘
```

### Data Flow

#### 1. **Subscription Flow**

```bash
User enters email → Newsletter Form → API Gateway → Subscribe Lambda
→ Store in DynamoDB → Send confirmation email via SES → User confirms
→ Update status in DynamoDB → Send welcome email
```

#### 2. **Publishing Flow**

```bash
Admin writes newsletter → Admin Panel → API Gateway (with auth)
→ Publish Lambda → Query active subscribers from DynamoDB
→ Batch send emails via SES → Log results
```

#### 3. **Unsubscribe Flow**

```bash
User clicks unsubscribe → Unsubscribe page → API Gateway
→ Update status in DynamoDB → Confirmation page
```

### Key Components

#### DynamoDB Schema

```javascript
{
  email: "user@example.com",        // Primary Key
  name: "John Doe",
  status: "active",                 // active, pending, unsubscribed
  subscribedAt: "2024-01-20T...",
  confirmedAt: "2024-01-20T...",
  confirmToken: "abc123...",        // For email confirmation
  unsubscribeToken: "xyz789...",    // For one-click unsubscribe
  tags: ["general", "mlops"],       // For segmentation
  source: "website",                // website, import, api
  metadata: {
    ip: "1.2.3.4",
    userAgent: "...",
    referrer: "..."
  }
}
```

#### API Endpoints

- `POST /subscribe` - Subscribe new user
- `GET /confirm` - Confirm email address
- `POST /unsubscribe` - Unsubscribe user
- `POST /publish` - Send newsletter (protected)
- `GET /stats` - Get subscriber stats (protected)

#### Security Features

1. **Email Confirmation** - Double opt-in
2. **API Key Authentication** - For admin endpoints
3. **CORS Configuration** - Only allow your domain
4. **Rate Limiting** - Prevent abuse
5. **Input Validation** - Email format, XSS prevention

#### Setup Checklist

- [ ] Deploy Terraform infrastructure
- [ ] Verify domain in AWS SES
- [ ] Move SES out of sandbox
- [ ] Update newsletter page with API endpoint
- [ ] Test subscription flow
- [ ] Test email confirmation
- [ ] Set up admin authentication
- [ ] Test newsletter publishing
- [ ] Monitor CloudWatch logs
- [ ] Set up backup strategy
