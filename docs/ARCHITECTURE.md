# System Architecture & Technical Specifications

> **Document Purpose**: This document provides an architectural breakdown of the **Token of Halawa** platform, detailing its system topology, data flow pipelines, authentication security model, build pipelines, and deployment strategy.

---

## Table of Contents
- [1. Overall System Architecture](#1-overall-system-architecture)
- [2. Frontend Architecture](#2-frontend-architecture)
- [3. Backend Architecture](#3-backend-architecture)
- [4. Folder Responsibilities](#4-folder-responsibilities)
- [5. Data Flow Architectures](#5-data-flow-architectures)
  - [Authentication & JWT Flow](#authentication--jwt-flow)
  - [Donation & Renewal Flow](#donation--renewal-flow)
  - [Physical Verification Flow](#physical-verification-flow)
  - [Class Handover Flow](#class-handover-flow)
  - [File / Image Generation Flow](#file--image-generation-flow)
- [6. Build & Deployment Flow](#6-build--deployment-flow)

---

## 1. Overall System Architecture

Token of Halawa uses a multi-tier decoupled web system design:

```mermaid
graph TB
    subgraph Client Tier [Frontend Application - Next.js 15]
        PWA[PWA / Single Page Application]
        LS[(Browser Local Storage Cache)]
        PWA <--> LS
    end

    subgraph API Tier [Backend Server - Express.js Node Runtime]
        Router[Express Router & Rate Limiters]
        Auth[JWT Authenticator & RBAC Guard]
        Controllers[API Controllers]
        Services[Business Logic Services]
        
        Router --> Auth
        Auth --> Controllers
        Controllers --> Services
    end

    subgraph Data Tier [Database & Cache Layer]
        Prisma[Prisma ORM]
        Postgres[(PostgreSQL Database)]
        Redis[(Redis Cache / Upstash)]
        
        Services --> Prisma
        Services --> Redis
        Prisma --> Postgres
    end

    PWA <-->|HTTPS / JSON REST API| Router
```

---

## 2. Frontend Architecture

The frontend is built on **Next.js 15 App Router** and **React 19**, styled using **Tailwind CSS**.

### Key Architectural Concepts:
1. **Single Entry Monolithic Dashboard Component (`DashboardOverview.tsx`)**:
   - Manages tab navigation (`analytics`, `entries`, `verify`, `campaigners`, `donors`, `rankings`, `handovers`, `developer`).
   - Adapts UI elements dynamically based on user role (`admin`, `leader`, `campaigner`, `developer`).
2. **Dual-Mode Data Layer**:
   - Fetches live records from the Express backend via `fetchDatabaseData()`.
   - Automatically falls back to offline state (`localStorage`) when network requests fail or offline PWA mode is active.
3. **Client-Side Document Rendering**:
   - Digital receipt modals (`ReceiptModal` and `MahabbaReceiptModal`) utilize HTML-to-Canvas rendering (`html-to-image`) and PDF creation (`jspdf`) entirely client-side without server rendering overhead.

---

## 3. Backend Architecture

The backend is built as a RESTful HTTP service using **Express.js**, **TypeScript**, and **Prisma ORM**.

```mermaid
graph LR
    Req[Incoming HTTP Request] --> RateLimit[Express Rate Limiter]
    RateLimit --> Security[Helmet & CORS Headers]
    Security --> Auth[JWT Middleware]
    Auth --> RBAC[Permission Guard]
    RBAC --> Controller[Controller Class]
    Controller --> Service[Service Layer]
    Service --> Prisma[Prisma ORM]
    Prisma --> DB[(PostgreSQL)]
    Service --> Res[JSON HTTP Response]
```

### Architectural Principles:
- **Stateless Authentication**: Every protected request must carry a `Bearer <token>` HTTP header.
- **Granular Permissions (RBAC)**: Controllers check specific permission flags (`PERMISSIONS.DONATION_CREATE`, `PERMISSIONS.DONOR_DELETE`) before proceeding.
- **Database Transactions**: Multi-model writes (such as creating a donor alongside an initial donation entry) execute inside Prisma interactive transactions `$transaction` to ensure atomic updates.

---

## 4. Folder Responsibilities

| Directory Path | Primary Purpose | Architectural Role | Safe to Modify? |
| :--- | :--- | :--- | :--- |
| `/backend/prisma` | Database schema & migrations | Data Model Source of Truth | ⚠️ Schema migrations only |
| `/backend/src/routes` | REST endpoint routing | Transport Mapping Layer | 🟢 Safe for new endpoints |
| `/backend/src/controllers` | HTTP Request/Response handling | API Controller Layer | 🟢 Safe for endpoint logic |
| `/backend/src/services` | Core business logic & database queries | Domain Service Layer | 🟢 Safe for DB operations |
| `/backend/src/middleware` | Security, JWT, error handling | Cross-Cutting Concerns | 🛑 Core Security Guard |
| `/frontend/src/app` | Next.js App Router pages | Entry Points & Route Shells | 🟢 Safe for page wrappers |
| `/frontend/src/components` | Reusable React UI & Modals | UI Component Layer | 🟢 Safe for UI edits |
| `/frontend/src/store` | Client state stores | Client State Layer | 🟢 Safe for state logic |

---

## 5. Data Flow Architectures

### Authentication & JWT Flow
```mermaid
sequenceDiagram
    autonumber
    Client->>Backend: POST /api/v1/auth/login { email, password }
    Backend->>Database: Query User & verify Bcrypt password hash
    Database-->>Backend: User object with UserRoles & Permissions
    Backend-->>Client: Returns { token, refreshToken, user: { id, email, fullName, roles, permissions } }
    Note over Client: Token stored in localStorage & state
    Client->>Backend: GET /api/v1/donations/all (Authorization: Bearer <token>)
    Backend->>Backend: Verify JWT signature & check required permission
    Backend-->>Client: Returns 200 OK + Data JSON
```

### Donation & Renewal Flow
```mermaid
sequenceDiagram
    autonumber
    Field Campaigner->>Frontend: Submit Donation / Renewal Form
    Frontend->>Backend: POST /api/v1/mahabba/donations/new OR /renew
    Backend->>Database: Execute Prisma Transaction (Create/Update Donor + Create Donation)
    Database-->>Backend: Created Donation Object with Receipt Number (MHB-2026-XXXX)
    Backend-->>Client: Returns 201 Created + Receipt Details
    Frontend->>Frontend: Render Digital Receipt Modal (HTML-to-Image / PDF Download)
```

### Physical Verification Flow
```mermaid
sequenceDiagram
    autonumber
    Field Campaigner->>Frontend: Logs Physical Cash Donation (Status: PENDING)
    Admin / Manager->>Frontend: Opens "Pending Verification Approval Queue" Tab
    Admin / Manager->>Frontend: Clicks "Verify" Button on Entry
    Frontend->>Backend: PATCH /api/v1/donations/:id/verify
    Backend->>Database: Update Donation status -> VERIFIED
    Database-->>Backend: Updated Entry
    Backend-->>Frontend: Returns 200 OK
    Frontend->>Frontend: Move item to Approved Collections & Update Charts
```

### Class Handover Flow
```mermaid
sequenceDiagram
    autonumber
    Class Leader->>Frontend: Submits Class Handover Form (Class, Month, Leader Name, Amount)
    Frontend->>Backend: POST /api/v1/mahabba/class-handovers
    Backend->>Database: Create ClassHandover record with Receipt No (HND-2026-XXXX)
    Database-->>Backend: Created Handover Record
    Backend-->>Frontend: Returns 201 Created + Handover Receipt
    Frontend->>Frontend: Display Handover Confirmation Receipt Modal
```

---

## 6. Build & Deployment Flow

```mermaid
graph TD
    Code[Source Code Git Repository] --> CI[CI/CD Build Check]
    
    subgraph Backend Pipeline
        CI --> BE_Build[tsc Compilation -> dist/]
        BE_Build --> BE_Deploy[Node.js Server / Docker Container]
    end

    subgraph Frontend Pipeline
        CI --> FE_Build[next build -> Static Pages & Server Routes]
        FE_Build --> FE_Deploy[Vercel Serverless Edge Platform]
    end

    BE_Deploy --> DB[(Neon Serverless PostgreSQL)]
```
