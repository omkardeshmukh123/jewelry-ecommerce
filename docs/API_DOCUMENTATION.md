# 📡 API Documentation

Complete API reference for the Jewelry E-Commerce Application backend.

**Base URL**: `http://localhost:5000/api` (Development)  
**Production URL**: `https://your-backend.railway.app/api`

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

---

## 📋 Table of Contents

- [Authentication Endpoints](#authentication-endpoints)
- [Product Endpoints](#product-endpoints)
- [Order Endpoints](#order-endpoints)
- [Health Check](#health-check)
- [Error Responses](#error-responses)

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint**: `POST /auth/register`  
**Auth Required**: No

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### Login User

Authenticate with email and password.

**Endpoint**: `POST /auth/login`  
**Auth Required**: No

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Google OAuth Login

Authenticate or register using Google OAuth.

**Endpoint**: `POST /auth/google`  
**Auth Required**: No

**Request Body**:
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5M..."
}
```

**Success Response - Existing User** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Success Response - New User** (201):
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Google authentication failed"
}
```

---

### Get Current User

Get authenticated user's profile.

**Endpoint**: `GET /auth/me`  
**Auth Required**: Yes

**Success Response** (200):
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "role": "user",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }
}
```

---

### Update Profile

Update user profile information.

**Endpoint**: `PUT /auth/profile`  
**Auth Required**: Yes

**Request Body**:
```json
{
  "name": "John Updated",
  "phone": "9876543210",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001"
  }
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "user"
  }
}
```

---

## Product Endpoints

### Get All Products

Retrieve all products with optional filtering.

**Endpoint**: `GET /products`  
**Auth Required**: No

**Query Parameters**:
- `category` (string): Filter by category
- `material` (string): Filter by material
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `search` (string): Search in name/description
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)

**Example**: `/products?category=rings&minPrice=5000&maxPrice=20000&page=1`

**Success Response** (200):
```json
{
  "success": true,
  "count": 25,
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 25,
    "pages": 3
  },
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Diamond Ring",
      "description": "Beautiful diamond ring",
      "price": 15000,
      "discountPrice": 12000,
      "category": "rings",
      "material": "gold",
      "images": ["https://drive.google.com/..."],
      "stock": 10,
      "featured": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Featured Products

Retrieve featured products only.

**Endpoint**: `GET /products/featured`  
**Auth Required**: No

**Success Response** (200):
```json
{
  "success": true,
  "count": 6,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Diamond Ring",
      "price": 15000,
      "discountPrice": 12000,
      "images": ["https://drive.google.com/..."],
      "featured": true
    }
  ]
}
```

---

### Get Single Product

Retrieve detailed information about a specific product.

**Endpoint**: `GET /products/:id`  
**Auth Required**: No

**Success Response** (200):
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Diamond Ring",
    "description": "Beautiful 18K gold diamond ring",
    "price": 15000,
    "discountPrice": 12000,
    "category": "rings",
    "material": "gold",
    "images": [
      "https://drive.google.com/uc?id=1abc...",
      "https://drive.google.com/uc?id=2def..."
    ],
    "stock": 10,
    "featured": true,
    "specifications": {
      "weight": "5g",
      "purity": "18K",
      "size": "7"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### Create Product (Admin)

Create a new product.

**Endpoint**: `POST /products`  
**Auth Required**: Yes (Admin only)

**Request Body**:
```json
{
  "name": "Gold Necklace",
  "description": "Elegant 22K gold necklace",
  "price": 45000,
  "discountPrice": 42000,
  "category": "necklaces",
  "material": "gold",
  "images": [
    "https://drive.google.com/file/d/1abc.../view"
  ],
  "stock": 5,
  "featured": true,
  "specifications": {
    "weight": "25g",
    "purity": "22K",
    "length": "18 inches"
  }
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Gold Necklace",
    "price": 45000,
    "stock": 5
  }
}
```

---

### Update Product (Admin)

Update an existing product.

**Endpoint**: `PUT /products/:id`  
**Auth Required**: Yes (Admin only)

**Request Body**:
```json
{
  "price": 48000,
  "discountPrice": 45000,
  "stock": 3
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Gold Necklace",
    "price": 48000,
    "discountPrice": 45000,
    "stock": 3
  }
}
```

---

### Delete Product (Admin)

Delete a product.

**Endpoint**: `DELETE /products/:id`  
**Auth Required**: Yes (Admin only)

**Success Response** (200):
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Order Endpoints

### Create Order

Create a new order.

**Endpoint**: `POST /orders`  
**Auth Required**: Yes

**Request Body**:
```json
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 12000
    },
    {
      "product": "507f1f77bcf86cd799439012",
      "quantity": 1,
      "price": 45000
    }
  ],
  "totalAmount": 69000,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "phone": "1234567890"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "orderNumber": "ORD-1234567890",
    "user": "507f1f77bcf86cd799439011",
    "items": [...],
    "totalAmount": 69000,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get User Orders

Retrieve all orders for the authenticated user.

**Endpoint**: `GET /orders`  
**Auth Required**: Yes

**Success Response** (200):
```json
{
  "success": true,
  "count": 5,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "orderNumber": "ORD-1234567890",
      "items": [
        {
          "product": {
            "_id": "507f1f77bcf86cd799439011",
            "name": "Diamond Ring",
            "images": ["https://..."]
          },
          "quantity": 2,
          "price": 12000
        }
      ],
      "totalAmount": 69000,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get All Orders (Admin)

Retrieve all orders from all users.

**Endpoint**: `GET /orders/all`  
**Auth Required**: Yes (Admin only)

**Success Response** (200):
```json
{
  "success": true,
  "count": 150,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "orderNumber": "ORD-1234567890",
      "user": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "totalAmount": 69000,
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Update Order Status (Admin)

Update the status of an order.

**Endpoint**: `PUT /orders/:id/status`  
**Auth Required**: Yes (Admin only)

**Request Body**:
```json
{
  "status": "shipped"
}
```

**Valid Statuses**: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

**Success Response** (200):
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "shipped"
  }
}
```

---

### Mark WhatsApp Sent

Mark that WhatsApp message has been sent for an order.

**Endpoint**: `PUT /orders/:id/whatsapp`  
**Auth Required**: Yes

**Success Response** (200):
```json
{
  "success": true,
  "message": "WhatsApp status updated",
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "whatsappSent": true
  }
}
```

---

## Health Check

### Server Health

Check if the server is running.

**Endpoint**: `GET /health`  
**Auth Required**: No

**Success Response** (200):
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 12345,
  "environment": "production"
}
```

---

## Error Responses

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

---

## Rate Limiting

### Authentication Endpoints
- **Limit**: 5 requests per 15 minutes
- **Applies to**: `/auth/register`, `/auth/login`, `/auth/google`

### General API Endpoints
- **Limit**: 100 requests per 15 minutes
- **Applies to**: All other endpoints

**Rate Limit Response** (429):
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products?category=rings&page=1
```

### Get Current User (Protected)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Testing with Postman

1. Import the API endpoints into Postman
2. Set environment variable `baseUrl` = `http://localhost:5000/api`
3. For protected routes:
   - Go to **Authorization** tab
   - Type: **Bearer Token**
   - Token: `<your-jwt-token>`

---

**Last Updated**: 2024-11-24  
**API Version**: 2.0.0
