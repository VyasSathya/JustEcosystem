# JustWorks Authentication API Documentation

This document provides detailed, user-friendly information for integrating with the JustWorks Authentication API.

## Endpoints & Examples

### Login
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "hunter2"
}
```
**Response:**
```
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600,
  "user": { ... }
}
```

### Google OAuth
```
POST /auth/oauth/google
{
  "provider": "google",
  "token": "<google_id_token>"
}
```

### Apple OAuth (with Private Email Relay)
```
POST /auth/oauth/apple
{
  "provider": "apple",
  "token": "<apple_id_token>"
}
```
- Handles Apple private email relay for privacy.

### Fetch User Profile
```
GET /auth/profile
Authorization: Bearer <access_token>
```

### Link/Unlink OAuth Provider
```
POST /auth/profile/link
{
  "provider": "google",
  "token": "..."
}

POST /auth/profile/unlink
{
  "provider": "apple"
}
```

### Admin Role Management
```
POST /auth/admin/roles
{
  "user_id": "...",
  "roles": ["admin", "editor"]
}
```

## Error Handling
- Standard HTTP status codes (401, 403, 400)
- Error responses include a message field for debugging

## Authentication Mechanisms
- JWT Bearer tokens required for all protected endpoints
- Google/Apple OAuth flows supported
- Apple private email relay handled securely

## See Also
- [OpenAPI Specification](auth-api.yaml)
- [Communication Plan](communication-plan.md)
