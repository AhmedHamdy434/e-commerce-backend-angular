# API Endpoints Documentation

This document provides a comprehensive list of all API endpoints available in the E-Commerce Backend, along with successful request/response examples.

## Base URL
`http://localhost:3000/api`

---

## 1. Authentication

### **Register User**
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response (201)**:
  ```json
  {
    "status": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "user_abc123",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER",
        "createdAt": "2024-05-11T12:00:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### **Login User**
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response (200)**:
  ```json
  {
    "status": true,
    "message": "Logged in successfully",
    "data": {
      "user": {
        "id": "user_abc123",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### **Logout User**
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Success Response (200)**:
  ```json
  {
    "status": true,
    "message": "Logged out successfully",
    "data": null
  }
  ```

---

## 2. Categories

### **Get All Categories**
- **URL**: `/categories`
- **Method**: `GET`
- **Success Response (200)**:
  ```json
  {
    "status": true,
    "message": "Categories fetched successfully",
    "data": [{ "id": "cat_123", "name": "Electronics", "slug": "electronics", "products_count": 5 }]
  }
  ```

### **Get Single Category**
- **URL**: `/categories/{id}`
- **Method**: `GET`

### **Create Category (Admin Only)**
- **URL**: `/categories`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Laptops",
    "slug": "laptops",
    "image": "https://example.com/laptops.jpg"
  }
  ```

### **Update Category (Admin Only)**
- **URL**: `/categories/{id}`
- **Method**: `PUT`
- **Body**:
  ```json
  {
    "name": "Updated Name"
  }
  ```

### **Delete Category (Admin Only)**
- **URL**: `/categories/{id}`
- **Method**: `DELETE`

---

## 3. Products

### **Get All Products (with filters)**
- **URL**: `/products?category=electronics&minPrice=100&page=1&limit=10`
- **Method**: `GET`
- **Success Response (200)**:
  ```json
  {
    "status": true,
    "message": "Products fetched successfully",
    "data": [...],
    "pagination": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
  }
  ```

### **Get Single Product**
- **URL**: `/products/{id}`
- **Method**: `GET`

### **Create Product (Admin Only)**
- **URL**: `/products`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "New Product",
    "slug": "new-product",
    "price": 200,
    "categoryId": "cat_123"
  }
  ```

### **Update Product (Admin Only)**
- **URL**: `/products/{id}`
- **Method**: `PUT`

### **Delete Product (Admin Only)**
- **URL**: `/products/{id}`
- **Method**: `DELETE`

---

## 4. Cart

### **Get User Cart**
- **URL**: `/cart`
- **Method**: `GET`

### **Add to Cart**
- **URL**: `/cart`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "productId": "prod_456",
    "quantity": 1
  }
  ```

### **Update Cart Quantity**
- **URL**: `/cart/{id}`
- **Method**: `PATCH`
- **Body**:
  ```json
  {
    "quantity": 3
  }
  ```

### **Remove Item from Cart**
- **URL**: `/cart/{id}`
- **Method**: `DELETE`

### **Clear Cart**
- **URL**: `/cart`
- **Method**: `DELETE`

---

## 5. Wishlist

### **Get Wishlist**
- **URL**: `/wishlist`
- **Method**: `GET`

### **Add to Wishlist**
- **URL**: `/wishlist`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "productId": "prod_456"
  }
  ```

### **Remove from Wishlist**
- **URL**: `/wishlist/{id}`
- **Method**: `DELETE`

---

## 6. Checkout

### **Process Checkout**
- **URL**: `/checkout`
- **Method**: `POST`
- **Success Response (201)**:
  ```json
  {
    "status": true,
    "message": "Checkout successful. Order placed.",
    "data": { "id": "ord_101", "totalAmount": 1998 }
  }
  ```

---

## 7. Orders

### **Get User Orders**
- **URL**: `/orders`
- **Method**: `GET`
- **Success Response (200)**:
  ```json
  {
    "status": true,
    "message": "Orders fetched successfully",
    "data": [...]
  }
  ```
