# REST API Endpoint Documentation

> **Base URL**: `http://localhost:5000/api/v1` (Local) / `https://api.tokenofhalawa.org/api/v1` (Production)  
> **Authentication**: All protected endpoints require a JWT Bearer token in the `Authorization` HTTP request header:  
> `Authorization: Bearer <your_jwt_access_token>`

---

## Table of Contents
1. [Health API](#1-health-api)
2. [Authentication Endpoints](#2-authentication-endpoints)
3. [Donor Management Endpoints](#3-donor-management-endpoints)
4. [Donation Management Endpoints](#4-donation-management-endpoints)
5. [Mahabba Campaign Endpoints](#5-mahabba-campaign-endpoints)
6. [Campaign Endpoints](#6-campaign-endpoints)
7. [Public & Analytics Endpoints](#7-public--analytics-endpoints)
8. [Developer & Diagnostics Endpoints](#8-developer--diagnostics-endpoints)

---

## 1. Health API

### `GET /health`
- **Description**: Public health check endpoint to inspect server status and uptime.
- **Auth Required**: No
- **Response**: `200 OK`
- **Example Response**:
  ```json
  {
    "status": "OK",
    "uptime": 14250.32,
    "timestamp": "2026-07-31T21:45:00.000Z"
  }
  ```

---

## 2. Authentication Endpoints

### `POST /api/v1/auth/login`
- **Description**: Authenticate user credentials and return JWT tokens & permissions.
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "admin@halawa.org",
    "password": "SecurePassword123!"
  }
  ```
- **Response Codes**: `200 OK`, `400 Bad Request`, `401 Unauthorized`
- **Example Response (`200 OK`)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "d8a1f2e3-4b5c-6d7e-8f9a-0b1c2d3e4f5a",
    "user": {
      "id": "usr-1001",
      "email": "admin@halawa.org",
      "fullName": "Super Admin User",
      "roles": ["SUPER_ADMIN"],
      "permissions": ["donation:create", "donation:verify", "donor:delete"]
    }
  }
  ```

---

## 3. Donor Management Endpoints

### `POST /api/v1/donors`
- **Description**: Register a new donor profile.
- **Auth Required**: Yes (`donor:create`)
- **Request Body**:
  ```json
  {
    "name": "Muhammed Shafi",
    "phone": "9847012345",
    "location": "Calicut",
    "category": "GENERAL",
    "donationPlan": "MONTHLY"
  }
  ```
- **Response Codes**: `201 Created`, `400 Bad Request`, `401 Unauthorized`
- **Example Response**:
  ```json
  {
    "id": "dnr-9921",
    "uniqueId": "TOH-D-009921",
    "name": "Muhammed Shafi",
    "phone": "9847012345",
    "status": "ACTIVE"
  }
  ```

### `GET /api/v1/donors`
- **Description**: Retrieve active donor directory.
- **Auth Required**: Yes (`donor:read`)
- **Query Parameters**: `search` (optional), `page` (optional), `limit` (optional)
- **Response**: `200 OK`

---

## 4. Donation Management Endpoints

### `POST /api/v1/donations`
- **Description**: Log a new donation entry.
- **Auth Required**: Yes (`donation:create`)
- **Request Body**:
  ```json
  {
    "donorId": "dnr-9921",
    "amount": 300,
    "donationMonth": "Jun, Jul, Aug",
    "monthPlan": "100/month",
    "notes": "Logged by: Asif. Class: D1"
  }
  ```
- **Response Codes**: `201 Created`, `400 Bad Request`

### `GET /api/v1/donations/all`
- **Description**: Fetch all logged donation entries for admin overview.
- **Auth Required**: Yes (`donation:verify`)
- **Response**: `200 OK`

### `DELETE /api/v1/donations/:id`
- **Description**: Permanently delete a donation entry.
- **Auth Required**: Yes (`donation:create` or `SUPER_ADMIN`)
- **Response Codes**: `200 OK`, `404 Not Found`
- **Example Response**:
  ```json
  {
    "message": "Donation deleted successfully"
  }
  ```

---

## 5. Mahabba Campaign Endpoints

### `POST /api/v1/mahabba/donations/new`
- **Description**: Create a new donor and log initial Mahabba campaign donation in a single transaction.
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "donorName": "Usman Koya",
    "phone": "9847099887",
    "amount": 100,
    "month": "July",
    "campaignerName": "Aneeb",
    "campaignerClass": "D2"
  }
  ```
- **Response**: `201 Created`

### `POST /api/v1/mahabba/donations/renew`
- **Description**: Renew an existing donor's subscription for custom selected months.
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "donorId": "dnr-9921",
    "amount": 200,
    "months": ["August", "September"]
  }
  ```
- **Response**: `200 OK`

### `POST /api/v1/mahabba/class-handovers`
- **Description**: Log a class leader's cash collection handover to admin.
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "className": "D1",
    "handoverMonth": "July",
    "leaderName": "Muhammed Ali",
    "amount": 5000,
    "notes": "July class collection total"
  }
  ```
- **Response**: `201 Created`

---

## 6. Public & Analytics Endpoints

### `GET /api/v1/public/home-stats`
- **Description**: Public endpoint for live leaderboard total statistics.
- **Auth Required**: No
- **Response**: `200 OK`
- **Example Response**:
  ```json
  {
    "todayCollection": 15000,
    "totalDonors": 450,
    "totalCampaigners": 32,
    "topClasses": [
      { "className": "D1", "amount": 42000 },
      { "className": "D2", "amount": 38000 }
    ]
  }
  ```
