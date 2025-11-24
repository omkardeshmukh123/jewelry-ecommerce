# 🏗️ Architecture Documentation

Complete architectural overview of the Jewelry E-Commerce Application.

---

## 📊 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Tablet     │      │
│  │  (Desktop)   │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                     React.js Frontend                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Components │ Pages │ Context │ Services │ Styles   │   │
│  └──────────────────────────────────────────────────────┘   │
│                   Hosted on Vercel                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                        │
│                    Node.js + Express.js                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes │ Controllers │ Middleware │ Utils           │   │
│  └──────────────────────────────────────────────────────┘   │
│                   Hosted on Railway                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│                      MongoDB Atlas                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │    Users    │   Products   │   Orders                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┴───────────────────┐
        ▼                                       ▼
┌──────────────────┐                  ┌──────────────────┐
│  Google OAuth    │                  │  Google Drive    │
│   (Auth)         │                  │  (Images)        │
└──────────────────┘                  └──────────────────┘
```

---

## 🎯 Design Patterns

### 1. MVC Pattern (Backend)

```
Model (MongoDB Schema)
   ↓
Controller (Business Logic)
   ↓
View (JSON Response)
```

**Example**:
- **Model**: `User.js` - Defines user schema
- **Controller**: `authController.js` - Handles authentication logic
- **Routes**: `authRoutes.js` - Maps endpoints to controllers

### 2. Context API Pattern (Frontend)

```
Context Provider
   ↓
Consumer Components
   ↓
UI Updates
```

**Contexts**:
- `AuthContext` - User authentication state
- `CartContext` - Shopping cart state
- `WishlistContext` - Wishlist state

### 3. Repository Pattern

All database operations are abstracted through Mongoose models:

```javascript
// Instead of direct DB queries
const user = await User.findById(id);

// Not scattered SQL/NoSQL queries
```

---

## 📦 Component Architecture

### Frontend Component Hierarchy

```
App.jsx (GoogleOAuthProvider)
├── Router
│   ├── AuthProvider
│   │   ├── CartProvider
│   │   │   ├── WishlistProvider
│   │   │   │   ├── Navbar
│   │   │   │   ├── Routes
│   │   │   │   │   ├── Home
│   │   │   │   │   ├── Shop
│   │   │   │   │   ├── ProductDetail
│   │   │   │   │   ├── Cart
│   │   │   │   │   ├── Login (GoogleLogin)
│   │   │   │   │   ├── Register (GoogleLogin)
│   │   │   │   │   ├── Profile
│   │   │   │   │   ├── Orders
│   │   │   │   │   ├── Wishlist
│   │   │   │   │   └── AdminDashboard
│   │   │   │   └── Footer
│   │   │   │   └── ToastContainer
```

### Component Types

#### 1. **Page Components** (`/pages`)
- Full-page views
- Route-level components
- Examples: `Home.jsx`, `Shop.jsx`, `ProductDetail.jsx`

#### 2. **Feature Components** (`/components`)
- Reusable UI sections
- Examples: `Navbar.jsx`, `ProductCard.jsx`, `Cart.jsx`

#### 3. **Context Providers** (`/context`)
- Global state management
- Examples: `AuthContext.jsx`, `CartContext.jsx`

#### 4. **Service Layer** (`/services`)
- API communication
- Example: `api.js` (Axios instance)

---

## 🔄 Data Flow

### Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend → POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend generates JWT token
   ↓
5. Backend → Returns {token, user}
   ↓
6. Frontend stores token in localStorage
   ↓
7. Frontend updates AuthContext
   ↓
8. UI updates (show user info, redirect)
```

### Google OAuth Flow

```
1. User clicks "Sign in with Google"
   ↓
2. Google OAuth popup appears
   ↓
3. User authenticates with Google
   ↓
4. Google → Returns credential token
   ↓
5. Frontend → POST /api/auth/google {credential}
   ↓
6. Backend verifies token with Google
   ↓
7. Backend creates/finds user
   ↓
8. Backend → Returns {token, user}
   ↓
9. Frontend stores token & updates context
   ↓
10. UI updates (redirect to home)
```

### Product Listing Flow

```
1. User navigates to Shop page
   ↓
2. Frontend → GET /api/products?filters
   ↓
3. Backend queries MongoDB
   ↓
4. Backend applies filters/pagination
   ↓
5. Backend → Returns {products, pagination}
   ↓
6. Frontend renders ProductCard components
   ↓
7. User sees product grid
```

### Shopping Cart Flow

```
1. User clicks "Add to Cart"
   ↓
2. CartContext.addToCart(product)
   ↓
3. Update cart state
   ↓
4. Store in localStorage (persistence)
   ↓
5. Update cart badge count
   ↓
6. Show toast notification
```

### Order Creation Flow

```
1. User clicks "Order via WhatsApp"
   ↓
2. Frontend → POST /api/orders {items, total}
   ↓
3. Backend validates items
   ↓
4. Backend creates order in MongoDB
   ↓
5. Backend → Returns {order}
   ↓
6. Frontend generates WhatsApp message
   ↓
7. Redirect to WhatsApp with pre-filled message
```

---

## 🗄️ Database Schema

### User Schema

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed, optional for Google users),
  googleId: String (unique, sparse),
  profilePicture: String,
  role: String (enum: ['user', 'admin']),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  discountPrice: Number,
  category: String (enum: ['rings', 'necklaces', 'earrings', 'bracelets']),
  material: String (enum: ['gold', 'silver', 'platinum', 'diamond']),
  images: [String],
  stock: Number,
  featured: Boolean,
  specifications: {
    weight: String,
    purity: String,
    size: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema

```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  user: ObjectId (ref: 'User'),
  items: [{
    product: ObjectId (ref: 'Product'),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  phone: String,
  whatsappSent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────┐
│         Client Request                   │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Helmet (Security Headers)          │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Rate Limiter                       │
│   (5 req/15min for auth)                │
│   (100 req/15min for API)               │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      CORS Validation                    │
│   (Check origin)                        │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      JWT Verification                   │
│   (For protected routes)                │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Role Check                         │
│   (Admin vs User)                       │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Controller Logic                   │
└─────────────────────────────────────────┘
```

### Security Layers

1. **Transport Layer**: HTTPS in production
2. **Application Layer**: Helmet.js headers
3. **Rate Limiting**: Express-rate-limit
4. **Authentication**: JWT tokens
5. **Authorization**: Role-based access control
6. **Data Layer**: Password hashing (bcrypt)
7. **Input Validation**: Mongoose schema validation

---

## 🚀 Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel CDN                            │
│              (Frontend - React App)                      │
│  ┌────────────────────────────────────────────────┐     │
│  │  Static Files │ React Build │ Environment Vars │     │
│  └────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
                         │
                         │ API Calls
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Railway                               │
│              (Backend - Node.js)                         │
│  ┌────────────────────────────────────────────────┐     │
│  │  Express Server │ Controllers │ Environment    │     │
│  └────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Database Queries
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  MongoDB Atlas                           │
│              (Database - Cloud)                          │
│  ┌────────────────────────────────────────────────┐     │
│  │  Replica Set │ Auto-Backup │ Monitoring        │     │
│  └────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Environment Configuration

**Development**:
- Frontend: `localhost:3000`
- Backend: `localhost:5000`
- Database: Local MongoDB or Atlas

**Production**:
- Frontend: `your-app.vercel.app`
- Backend: `your-backend.railway.app`
- Database: MongoDB Atlas

---

## 📡 API Architecture

### RESTful Design

```
Resource-based URLs:
  /api/products          → Products collection
  /api/products/:id      → Single product
  /api/orders            → Orders collection
  /api/auth/login        → Authentication action

HTTP Methods:
  GET    → Retrieve
  POST   → Create
  PUT    → Update
  DELETE → Remove

Status Codes:
  200 → Success
  201 → Created
  400 → Bad Request
  401 → Unauthorized
  403 → Forbidden
  404 → Not Found
  500 → Server Error
```

### Middleware Stack

```javascript
app.use(helmet());              // Security headers
app.use(cors());                // CORS handling
app.use(express.json());        // JSON parsing
app.use(rateLimiter);           // Rate limiting
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use(errorHandler);          // Error handling
```

---

## 🔄 State Management

### Frontend State Architecture

```
┌─────────────────────────────────────────┐
│         Global State (Context)          │
│  ┌────────────────────────────────┐     │
│  │  AuthContext                   │     │
│  │  - user                        │     │
│  │  - token                       │     │
│  │  - isAuthenticated             │     │
│  └────────────────────────────────┘     │
│  ┌────────────────────────────────┐     │
│  │  CartContext                   │     │
│  │  - items[]                     │     │
│  │  - totalAmount                 │     │
│  │  - itemCount                   │     │
│  └────────────────────────────────┘     │
│  ┌────────────────────────────────┐     │
│  │  WishlistContext               │     │
│  │  - items[]                     │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Component Local State              │
│  - Form inputs                          │
│  - Loading states                       │
│  - Error states                         │
└─────────────────────────────────────────┘
```

### State Persistence

- **AuthContext**: localStorage (`token`, `user`)
- **CartContext**: localStorage (`cart`)
- **WishlistContext**: localStorage (`wishlist`)

---

## 🎨 Frontend Architecture

### Styling Strategy

```
Global Styles (index.css)
├── CSS Variables (Design Tokens)
│   ├── Colors
│   ├── Spacing
│   ├── Typography
│   └── Shadows
├── Reset Styles
├── Base Styles
└── Utility Classes

Component Styles
├── Home.css
├── Auth.css
├── ProductCard.css
└── Cart.css
```

### Design System

```css
:root {
  /* Colors */
  --primary-gold: #d4af37;
  --primary-rose-gold: #b76e79;
  --dark-bg: #0a0a0a;
  --light-bg: #1a1a1a;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  
  /* Typography */
  --font-primary: 'Inter', sans-serif;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.15);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.2);
}
```

---

## 📊 Performance Optimization

### Frontend Optimizations

1. **Code Splitting**: React.lazy() for routes
2. **Image Optimization**: Lazy loading, WebP format
3. **Caching**: Service worker (future)
4. **Minification**: Production build
5. **CDN**: Vercel edge network

### Backend Optimizations

1. **Database Indexing**: On frequently queried fields
2. **Query Optimization**: Lean queries, field selection
3. **Caching**: Redis (future implementation)
4. **Connection Pooling**: MongoDB connection pool
5. **Compression**: gzip responses

---

## 🔍 Monitoring & Logging

### Application Monitoring

```
┌─────────────────────────────────────────┐
│         Frontend (Vercel)               │
│  - Analytics                            │
│  - Error tracking                       │
│  - Performance metrics                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Backend (Railway)               │
│  - Server logs                          │
│  - API response times                   │
│  - Error logs                           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Database (Atlas)                │
│  - Query performance                    │
│  - Connection metrics                   │
│  - Storage usage                        │
└─────────────────────────────────────────┘
```

---

## 🔮 Future Architecture Enhancements

1. **Microservices**: Split into auth, product, order services
2. **Message Queue**: RabbitMQ for async operations
3. **Caching Layer**: Redis for frequently accessed data
4. **CDN**: CloudFlare for static assets
5. **Search Engine**: Elasticsearch for advanced search
6. **Real-time**: WebSocket for live updates
7. **Mobile App**: React Native with shared API

---

**Last Updated**: 2024-11-24  
**Version**: 2.0.0
