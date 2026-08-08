# AI Context & Assistant Guide

> **Document Purpose**: This file serves as the definitive reference guide for AI assistants (such as Antigravity, Claude, ChatGPT, GitHub Copilot) to understand the architecture, codebase patterns, business rules, and development constraints of the **Token of Halawa** project without requiring additional context.

---

## 1. Project Overview
- **Name**: Token of Halawa (Ribat Students Union / Mahabba Campaign)
- **Primary Objective**: Financial collection, campaigner tracking, class handover logging, donor profiling, and receipt generation for educational/charitable campaigns.
- **Current Version**: `1.0.0`
- **Domain Focus**: Non-profit donation management, multi-role field campaigner management, physical cash verification queues, and class leaderboard rankings.

---

## 2. Architecture Summary
- **Architecture Type**: Decoupled Client-Server (REST API Backend + SPA/PWA Next.js Frontend).
- **Backend Stack**: Node.js, Express.js, TypeScript, Prisma ORM, PostgreSQL, Redis.
- **Frontend Stack**: Next.js 15 (App Router), React 19, Tailwind CSS, Lucide React, Framer Motion, Chart.js, jsPDF.
- **Data Synchronization**: Dual-mode (Backend REST API with client-side local caching and optimistic fallbacks for offline PWA operations).

---

## 3. Technology Stack & Key Libraries

| Layer | Framework / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15.0.0 (App Router) | React application framework with static rendering & server/client routing |
| **UI Framework** | React 19.0.0 / React DOM | Core Component UI engine |
| **Styling** | Tailwind CSS 3.4.1 + PostCSS | Utility-first responsive styling and dark mode |
| **Icons & UI** | Lucide React 0.468.0 | Consistent iconography |
| **Animation** | Framer Motion 11.0.8 | Smooth micro-animations, modals, and tab transitions |
| **Charts** | Chart.js 4.4.2 & React-Chartjs-2 | Visual dashboard analytics (Bar trajectories, Area curves) |
| **PDF & Image Export** | jsPDF 4.2.1 & html-to-image 1.11.13 | Client-side receipt PDF and image download generation |
| **State Management** | Zustand 4.5.2 & React Hooks | Global user & UI state management |
| **Backend Runtime** | Node.js (v20+) with TypeScript 5.4 | Server execution environment |
| **Backend Web Server** | Express 4.19.2 | REST API routing and HTTP request handling |
| **Database ORM** | Prisma ORM 5.12.0 | PostgreSQL schema modeling, migrations, and query building |
| **Database Engine** | PostgreSQL 15 | Relational data store (Neon serverless in prod) |
| **Cache & Throttling** | ioredis 5.3.2 & express-rate-limit 7.2.0 | Rate limiting and token caching |
| **Security & Auth** | JsonWebToken 9.0.2 & BcryptJS 2.4.3 | JWT access/refresh token issue and password hashing |
| **Validation** | Zod 3.22.4 | Request payload runtime validation |

---

## 4. Folder Structure Explanation

```
token-of-halawa/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # PostgreSQL relational schema (790+ lines, 40+ models)
│   ├── src/
│   │   ├── app.ts                 # Express application initialization & middleware setup
│   │   ├── server.ts              # HTTP server entry point & graceful shutdown logic
│   │   ├── config/                # Environment variables & DB/Redis client configs
│   │   ├── constants/             # Role & Permission definitions (ROLES, PERMISSIONS)
│   │   ├── controllers/           # HTTP handlers (auth, donation, donor, mahabba, campaign)
│   │   ├── middleware/            # Auth JWT validation, permission check, error handler, rate limiters
│   │   ├── routes/                # Express API endpoint definitions
│   │   ├── services/              # Core business logic & database queries via Prisma
│   │   └── libraries/             # Helper libraries (logger, redis, response wrappers)
│   ├── Dockerfile                 # Docker container specification
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                   # Next.js 15 App Router pages
│   │   │   ├── page.tsx           # Home / Public Leaderboard page
│   │   │   ├── admin/             # Admin Portal route wrapper
│   │   │   ├── campaigner/        # Campaigner / Volunteer route wrapper
│   │   │   ├── leader/            # Class Leader route wrapper
│   │   │   └── developer/         # System Diagnostic & Developer portal
│   │   ├── components/
│   │   │   ├── DashboardOverview.tsx   # Monolithic dashboard component handling all roles & tabs
│   │   │   ├── ReceiptModal.tsx        # Standard donation digital receipt modal
│   │   │   ├── MahabbaReceiptModal.tsx # Mahabba campaign custom receipt modal
│   │   │   └── ExportMenu.tsx          # Data exporter modal (CSV, Excel, PDF)
│   │   └── store/                      # Client-side stores
│   └── package.json
└── docs/                          # System Architecture & Technical Documentation
```

---

## 5. Coding Style & Naming Conventions
- **Language**: TypeScript (`strict: true`).
- **Formatting**: 2 spaces indentation, camelCase for variables/functions, PascalCase for components/models/interfaces, UPPER_SNAKE_CASE for constants.
- **Frontend State**: Primary dashboard logic is concentrated inside `frontend/src/components/DashboardOverview.tsx` using React hooks (`useState`, `useEffect`, `useMemo`).
- **Backend Architecture**: Controller-Service-ORM pattern. Controllers parse requests -> Services execute Prisma DB queries -> Controllers return standard JSON responses.
- **Character Encoding**: Ensure UTF-8 clean strings. Do not hardcode garbled non-ASCII text; use raw UTF-8 Malayalam characters or Base64 encoding for localized confirmation dialogs if browser character corruption occurs.

---

## 6. Database & Data Models Overview
- **Engine**: PostgreSQL 15 managed via Prisma ORM.
- **Key Entities**:
  - `Organization`: Multi-tenant root organization.
  - `User`, `Role`, `Permission`, `UserRole`, `RolePermission`: Complete RBAC hierarchy.
  - `Volunteer`: Campaigner profile linked to `User`, `Class`, and `Unit` with HN code / Roll No.
  - `Donor`: Comprehensive profile with unique formatted ID (`TOH-D-XXXXXX`), category, and plan.
  - `Donation`: Financial entry tracking amount, month plans, verification status, campaigner info, and unique receipt number (`MHB-YEAR-XXXX`).
  - `ClassHandover`: Track leader cash handovers to admin with receipt numbers (`HND-YEAR-XXXX`).
  - `AuditLog` & `WorkflowLog`: Complete audit trail of system activities and status changes.

---

## 7. Authentication & RBAC System
- **Authentication**: JWT HTTP Bearer Header (`Authorization: Bearer <token>`).
- **Roles**:
  1. `SUPER_ADMIN` / `ORG_ADMIN`: Full access to system configuration, verification queues, analytics, developer tools, and deletion.
  2. `AREA_MANAGER`: Access to verification queues, district/sector stats, and reports.
  3. `CLASS_LEADER`: Access to class collections, campaigner listings, and class handovers.
  4. `VOLUNTEER`: Field campaigner access to log new donations, perform donor renewals, and view personal stats.
  5. `AUDITOR`: Read-only audit access.

---

## 8. State Management & Offline Resilience
- **Optimistic State**: `DashboardOverview.tsx` maintains local states (`donations`, `donors`, `deletedDonationIds`, `deletedDonorIds`).
- **Local Fallback**: When backend APIs are unreachable or offline, operations automatically update local state and cache to `localStorage` (`toh_custom_donations`, `toh_custom_donors`, `toh_deleted_donations`).
- **Deletion Logic**: `handleDeleteDonation` and `handleDeleteDonor` wait for server response (`res.ok || res.status === 404`). If offline or error, local optimistic deletion is applied gracefully.

---

## 9. Safe vs Sensitive Files Guide

### 🟢 Safe Files to Modify (Features, UI & Additions)
- `frontend/src/components/DashboardOverview.tsx` (UI layout, dashboard tabs, forms)
- `frontend/src/components/ReceiptModal.tsx` & `MahabbaReceiptModal.tsx` (Receipt template layout)
- `frontend/src/components/ExportMenu.tsx` (Export options and styling)
- `frontend/src/app/globals.css` (Tailwind styles, custom scrollbars, animations)
- `docs/*` (Documentation files)

### 🔴 Files That Require Extreme Caution / Senior Review
- `backend/prisma/schema.prisma` (Database schema migrations)
- `backend/src/middleware/auth.ts` (JWT verification and permission checks)
- `backend/src/routes/*` (API endpoints and route permission requirements)
- `backend/src/server.ts` & `backend/src/app.ts` (Server configuration and CORS)

---

## 10. Rules for AI Assistants
1. **Never guess API endpoints or data structures**: Always reference `backend/prisma/schema.prisma` and `backend/src/routes/` for accurate field names and routes.
2. **Preserve Malayalam & English Text Integrity**: Do not replace clean Malayalam Unicode strings with arbitrary HTML entities or escape artifacts.
3. **Maintain Dual Sync Capability**: Ensure all UI mutation functions in `DashboardOverview.tsx` retain fallback handling for offline/demo operation.
4. **Always Run Build Verification**: Execute `npm run build` in `/frontend` after modifying UI code to guarantee zero TypeScript or Next.js build errors.
5. **No Direct Data Erasure**: Never delete failing unit tests or overwrite Prisma migrations without explicit instructions.
