# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

### POST /auth/login
Login to get JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "finance_manager"
  }
}
```

**Headers for authenticated requests:**
```
Authorization: Bearer <jwt_token>
```

## Invoices

### POST /invoices
Create a new invoice (requires authentication).

**Request:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "invoice_date": "2023-09-25",
  "due_date": "2023-10-10",
  "amount_due": 500.00,
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "message": "Invoice INV-1695123456-ABC123 was created successfully",
  "invoice": {
    "id": 1,
    "invoice_id": "INV-1695123456-ABC123",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+1234567890",
    "invoice_date": "2023-09-25",
    "due_date": "2023-10-10",
    "amount_due": 500.00,
    "payment_status": "pending",
    "payment_link": "http://localhost:5000/payment/INV-1695123456-ABC123",
    "notes": "Optional notes"
  }
}
```

### GET /invoices
Get all invoices with optional search and filtering (requires authentication).

**Query Parameters:**
- `search` - Search by invoice ID, customer name, or email
- `status` - Filter by payment status (pending, paid, all)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Response:**
```json
{
  "invoices": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 50,
    "totalPages": 2
  }
}
```

### GET /invoices/:invoice_id
Get specific invoice by ID (no authentication required for payment access).

**Response:**
```json
{
  "id": 1,
  "invoice_id": "INV-1695123456-ABC123",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+1234567890",
  "invoice_date": "2023-09-25",
  "due_date": "2023-10-10",
  "amount_due": 500.00,
  "payment_status": "pending",
  "payment_link": "http://localhost:5000/payment/INV-1695123456-ABC123"
}
```

## Payments

### POST /payments/:invoice_id
Process payment for an invoice (no authentication required).

**Request:**
```json
{
  "amount": 500.00,
  "payment_method": "online"
}
```

**Response:**
```json
{
  "message": "Payment of $500 for Invoice INV-1695123456-ABC123 completed successfully",
  "payment": {
    "id": 1,
    "invoice_id": "INV-1695123456-ABC123",
    "amount": 500.00,
    "transaction_id": "TXN-1695123456-XYZ789",
    "status": "completed",
    "payment_date": "2023-09-25T10:30:00.000Z"
  }
}
```

## Dashboard

### GET /dashboard/stats
Get dashboard statistics (requires authentication).

**Response:**
```json
{
  "total": 25,
  "pending": 15,
  "paid": 10,
  "totalAmount": 12500.00,
  "totalPaid": 7500.00,
  "recentPayments": 5
}
```

## Health Check

### GET /health
Check system health (no authentication required).

**Response:**
```json
{
  "uptime": 3600,
  "message": "OK",
  "timestamp": 1695123456789,
  "environment": "development",
  "version": "1.0.0",
  "database": "connected"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (token expired)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate limited to 100 requests per 15 minutes per IP address.

When rate limit is exceeded:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```
