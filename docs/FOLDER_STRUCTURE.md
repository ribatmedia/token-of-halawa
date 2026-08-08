# Complete Project Folder Structure & Module Analysis

> **Document Purpose**: Comprehensive structural analysis of the **Token of Halawa** repository, detailing directory responsibilities, file organization, dependency boundaries, safe edit areas, and core business logic locations.

---

## 1. Directory Tree Overview

```
token-of-halawa/
├── backend/
│   ├── prisma/
│   │   ├── migrations/             # Database SQL migration history
│   │   └── schema.prisma          # Prisma ORM Data Models (Source of Truth)
│   ├── src/
│   │   ├── app.ts                 # Express App & Global Middleware Setup
│   │   ├── server.ts              # Server execution & port listener
│   │   ├── config/                # Environment variables & DB/Redis clients
│   │   ├── constants/             # Role (ROLES) & Permission (PERMISSIONS) constants
│   │   ├── controllers/           # HTTP Request Controllers
│   │   │   ├── auth.ts            # Register, Login, Refresh JWT
│   │   │   ├── campaign.ts        # Campaign creation & listing
│   │   │   ├── developer.ts       # Diagnostics, factory reset, banners
│   │   │   ├── donation.ts        # Donation CRUD & verification queue
│   │   │   ├── donor.ts           # Donor profile registration & merge
│   │   │   ├── mahabba.ts         # Mahabba renewals & class handovers
│   │   │   └── public.ts          # Public home stats & campaigners list
│   │   ├── libraries/             # Logging & helper utilities
│   │   ├── middleware/            # Security Guards (Auth JWT, Permission, Errors, Rate Limits)
│   │   │   ├── auth.ts            # authenticate & requirePermission middlewares
│   │   │   ├── error.ts           # Global Express error handler
│   │   │   └── rate-limiter.ts    # Rate limiters via Redis
│   │   ├── routes/                # Express API Route definitions
│   │   │   ├── auth.ts            # /api/v1/auth routes
│   │   │   ├── campaign.ts        # /api/v1/campaigns routes
│   │   │   ├── developer.ts       # /api/v1/developer routes
│   │   │   ├── donation.ts        # /api/v1/donations routes
│   │   │   ├── donor.ts           # /api/v1/donors routes
│   │   │   ├── mahabba.ts         # /api/v1/mahabba routes
│   │   │   └── public.ts          # /api/v1/public routes
│   │   └── services/              # Business Logic & Prisma Query Layer
│   │       ├── auth.ts            # User auth DB queries & Bcrypt logic
│   │       ├── campaign.ts        # Campaign DB operations
│   │       ├── donation.ts        # Donation transactions & verifications
│   │       ├── donor.ts           # Donor DB operations & unique hash generation
│   │       └── mahabba.ts         # Mahabba custom renewals & handovers
│   ├── .env                       # Backend local environment variables
│   ├── .env.example               # Backend template environment variables
│   ├── Dockerfile                 # Multi-stage production container build script
│   ├── package.json               # Backend Node.js dependencies & scripts
│   └── tsconfig.json              # TypeScript compilation configuration
├── frontend/
│   ├── public/                    # Public static assets, icons, & PWA manifest
│   ├── src/
│   │   ├── app/                   # Next.js 15 App Router Pages
│   │   │   ├── admin/             # Admin Portal page shell (`/admin`)
│   │   │   ├── campaigner/        # Campaigner Portal page shell (`/campaigner`)
│   │   │   ├── developer/         # Developer Tools page shell (`/developer`)
│   │   │   ├── leader/            # Class Leader Portal page shell (`/leader`)
│   │   │   ├── globals.css        # Global CSS, Tailwind rules, custom animations
│   │   │   ├── layout.tsx         # Root HTML/JSX layout component
│   │   │   └── page.tsx           # Home / Public Leaderboard page (`/`)
│   │   ├── components/            # React UI Components
│   │   │   ├── DashboardOverview.tsx   # Core monolithic dashboard component (All Tabs & Roles)
│   │   │   ├── ExportMenu.tsx          # Data exporter modal (CSV, Excel, PDF)
│   │   │   ├── MahabbaReceiptModal.tsx # Mahabba campaign custom receipt modal
│   │   │   └── ReceiptModal.tsx        # Standard donation receipt preview modal
│   │   └── store/                 # Client state stores (Zustand & React contexts)
│   ├── .npmrc                     # NPM config
│   ├── next-env.d.ts              # Next.js TypeScript declarations
│   ├── package.json               # Frontend dependencies & scripts
│   ├── postcss.config.js          # PostCSS configuration for Tailwind
│   ├── tailwind.config.ts         # Tailwind theme & color palette configuration
│   ├── tsconfig.json              # Frontend TypeScript configuration
│   └── vercel.json                # Vercel deployment configuration
├── docs/                          # Project Documentation Folder
│   ├── AI_CONTEXT.md              # AI Assistant context & development rules
│   ├── API.md                     # Complete REST API documentation
│   ├── ARCHITECTURE.md           # System Architecture & Mermaid Diagrams
│   ├── DATABASE.md                # PostgreSQL / Prisma schema reference
│   ├── DEPLOYMENT.md              # Deployment guide & production checklist
│   ├── FEATURES.md                # Feature inventory & status
│   └── FOLDER_STRUCTURE.md        # Folder structure analysis (This File)
├── .env.example                   # Project-wide template environment variables
├── docker-compose.yml             # Docker Compose orchestration script (Postgres + Redis + Node)
├── CHANGELOG.md                   # Semantic versioning changelog
└── README.md                      # Primary project readme
```

---

## 2. Folder Functional Classifications

### 🎨 UI & Presentation Layer (`/frontend/src/components` & `/frontend/src/app`)
- **Responsibilities**: User interface rendering, interactive forms, responsive styling, tab switching, client-side chart visualization, digital receipt generation, and offline PWA fallbacks.
- **Important Files**:
  - `frontend/src/components/DashboardOverview.tsx`
  - `frontend/src/components/ReceiptModal.tsx`
  - `frontend/src/components/MahabbaReceiptModal.tsx`
  - `frontend/src/components/ExportMenu.tsx`
- **Dependencies**: React 19, Tailwind CSS, Lucide React, Chart.js, Framer Motion, jsPDF, html-to-image.

---

### 💼 Business Logic & Services Layer (`/backend/src/services` & `/backend/src/controllers`)
- **Responsibilities**: Transaction processing, split-month calculations, donor deduplication hashes, password hashing, JWT generation, verification queue management, and class handover operations.
- **Important Files**:
  - `backend/src/services/donation.ts`
  - `backend/src/services/mahabba.ts`
  - `backend/src/services/donor.ts`
  - `backend/src/controllers/donation.ts`
- **Dependencies**: Prisma Client, BcryptJS, JSONWebToken, Zod.

---

### 🔌 API Routes Layer (`/backend/src/routes`)
- **Responsibilities**: Mapping incoming HTTP endpoint requests to controllers, binding security middlewares (`authenticate`, `requirePermission`), and applying rate limiters.
- **Important Files**:
  - `backend/src/routes/donation.ts`
  - `backend/src/routes/mahabba.ts`
  - `backend/src/routes/donor.ts`
  - `backend/src/routes/auth.ts`

---

### 🛡️ Configuration & Infrastructure Layer (`/backend/src/config`, `/backend/prisma`, `docker-compose.yml`)
- **Responsibilities**: Database schema definitions, Prisma ORM migrations, environment variable loading, Docker container builds, CORS rules, and rate limits.
- **Important Files**:
  - `backend/prisma/schema.prisma`
  - `backend/src/config/index.ts`
  - `docker-compose.yml`
  - `backend/Dockerfile`

---

## 3. Edit Safety Guidelines

```mermaid
quadrantChart
    title Directory Edit Safety & Impact Matrix
    x-axis Low Impact --> High Impact
    y-axis High Safety (Easy to Edit) --> Low Safety (Requires Review)
    quadrant-1 Requires Senior Review / High Impact
    quadrant-2 Safe UI Extensions
    quadrant-3 Safe Documentation & Assets
    quadrant-4 Critical Security & DB Models

    "frontend/src/components": [0.4, 0.8]
    "frontend/src/app": [0.3, 0.7]
    "docs/*": [0.1, 0.9]
    "backend/src/routes": [0.7, 0.4]
    "backend/src/controllers": [0.6, 0.4]
    "backend/src/services": [0.7, 0.3]
    "backend/prisma/schema.prisma": [0.95, 0.1]
    "backend/src/middleware/auth.ts": [0.9, 0.15]
```

### 🟢 Safe to Modify (UI & Features)
- `frontend/src/components/*`: Adding new UI tabs, styling tweaks, receipt layout adjustments.
- `frontend/src/app/*`: Page layout enhancements, static text changes.
- `docs/*`: Technical documentation updates.

### ⚠️ Modify with Caution (APIs & Business Logic)
- `backend/src/controllers/*`: Request handler additions.
- `backend/src/services/*`: Database query logic changes.
- `backend/src/routes/*`: Endpoint path modifications (must update corresponding frontend fetch calls).

### 🛑 Require Explicit Architectural Approval
- `backend/prisma/schema.prisma`: Database schema modifications (requires Prisma migrations).
- `backend/src/middleware/auth.ts`: Authentication and permission check guards.
