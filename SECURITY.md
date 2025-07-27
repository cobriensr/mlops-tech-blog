# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

## Reporting a Vulnerability

Please report security vulnerabilities to: [your-email@example.com]

We take security seriously and will respond within 48 hours.

## Security Scanning

This repository uses automated security scanning for:

### Infrastructure (Terraform)

- **tfsec**: Terraform static analysis
- **Checkov**: Multi-cloud security and compliance
- **Terrascan**: IaC security scanner
- **KICS**: Keeping Infrastructure as Code Secure

### Dependencies (NPM)

- **npm audit**: Native npm security auditing
- **OSV Scanner**: Google's vulnerability database scanner
- **Snyk**: Vulnerability scanning (optional, requires token)
- **OWASP Dependency Check**: Known vulnerability detection
- **Retire.js**: JavaScript library vulnerability scanner

### Code Security

- **Semgrep**: Static analysis security scanner
- **GitLeaks**: Secret detection
- **TruffleHog**: Secret scanning

### License Compliance

- **license-checker**: Ensures compatible licenses

## Security Best Practices

1. **Terraform**:
   - Enable S3 bucket encryption
   - Use least privilege IAM policies
   - Enable CloudFront security headers
   - Regular security scans

2. **NPM Packages**:
   - Regular dependency updates
   - Audit before deployment
   - Use lock files
   - Monitor for vulnerabilities

3. **Code**:
   - No secrets in code
   - Environment variables for sensitive data
   - Regular security reviews
