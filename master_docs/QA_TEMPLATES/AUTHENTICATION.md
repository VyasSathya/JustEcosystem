# QA & Test Plan: Authentication System (JWT, OAuth, SSO, Google, Apple)

## Unit Tests
- [ ] Token generation/validation (JWT)
- [ ] OAuth 2.0 login flow (success, failure, edge cases)
- [ ] Google login flow (OAuth 2.0)
- [ ] Apple login flow (OAuth 2.0/OpenID)
- [ ] SSO integration (if applicable)

## API Tests
- [ ] /login endpoint: valid/invalid credentials
- [ ] /refresh endpoint: new/expired tokens
- [ ] Google token validation and mapping
- [ ] Apple token validation and privacy (private relay email)
- [ ] Error cases: invalid, expired, revoked tokens

## Integration Tests
- [ ] Frontend <-> backend auth (all providers)
- [ ] Auth state persistence
- [ ] Permissions/roles enforcement
- [ ] Social login buttons and redirects (Google, Apple)

## Security Tests
- [ ] Token forgery/tampering
- [ ] Rate limiting, brute-force
- [ ] No sensitive data leaks
- [ ] Provider-specific privacy constraints (Apple relay email)

## Manual QA
- [ ] Login/logout flows (email/password, Google, Apple)
- [ ] Third-party login: Google, Apple
- [ ] Session expiration, forced logout
- [ ] Error messages for failed social login
