# API Documentation

This section contains documentation for the Plot Hook REST API.

## Overview

The Plot Hook API is built with Django REST Framework and provides endpoints for:
- User authentication and management
- Categories and entries for all three books
- Campaign session management

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. All endpoints require authentication except for login and registration.

## Base URL

- Development: `http://localhost:8000/api/`
- Production: `https://your-domain.com/api/`

## Endpoints

### Authentication
- `POST /api/users/login/` - User login
- `POST /api/users/register/` - User registration
- `POST /api/users/refresh/` - Refresh JWT token

### Books (Categories & Entries)
- `GET /api/books/categories/` - List categories
- `POST /api/books/categories/` - Create category
- `GET /api/books/entries/` - List entries
- `POST /api/books/entries/` - Create entry

### Sessions
- `GET /api/sessions/` - List campaign sessions
- `POST /api/sessions/` - Create session

## Data Models

### Category
```json
{
  "id": 1,
  "title": "Geography",
  "description": "World geography and locations",
  "book_type": "world",
  "parent": null,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Entry
```json
{
  "id": 1,
  "title": "Aeloria",
  "content": "The capital city of the kingdom...",
  "category": 1,
  "book_type": "world",
  "is_hidden": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Rate Limiting

- 1000 requests per hour per user
- 100 requests per minute per user 