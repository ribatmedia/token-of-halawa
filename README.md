# Token of Halawa - Enterprise Donation & Campaign Management Platform

> **Token of Halawa** (Ribat Students Union / Mahabba Campaign) is an enterprise-grade donation, campaigner, and financial collection management ecosystem. Built with a modern, high-performance tech stack, it provides multi-role role-based access control (RBAC), physical collection verification, offline PWA capability, real-time leaderboard statistics, class handovers, and instant PDF/image receipt generation.

---

## Table of Contents
- [Project Purpose](#project-purpose)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture Overview](#system-architecture-overview)
- [Folder Structure](#folder-structure)
- [Installation Guide](#installation-guide)
- [Local Development](#local-development)
- [Build Commands](#build-commands)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Project Screenshots](#project-screenshots)
- [Contributors](#contributors)
- [License](#license)

---

## Project Purpose
The primary objective of **Token of Halawa** is to digitize, streamline, and secure the financial collection workflows for educational and charitable campaigns (such as the Mahabba Campaign). It connects field campaigners, class leaders, area managers, and super admins into a single unified platform.

By supporting offline-first data entry, automated split calculations for multi-month subscriptions, class-level handovers, and audit trails, Token of Halawa ensures zero financial leakage and transparent live reporting.

---

## Key Features

### 🔐 1. Authentication & RBAC
- Multi-role permission system: `SUPER_ADMIN`, `ORG_ADMIN`, `AREA_MANAGER`, `CLASS_LEADER`, `VOLUNTEER`, and `AUDITOR`.
- JWT-based authentication with access tokens and refresh tokens.
- Granular permission flags (e.g., `donation:create`, `donation:verify`, `donor:delete`, `campaign:read`).

### 📊 2. Interactive Analytics & Dashboard Overview
- Live financial metrics: Today's Collection, Monthly Collection, Pending Verifications, Active Donors Directory.
- Visual charts: Monthly Donation Growth Trajectory (Bar Chart) and Campaign Collection Progression (Area Chart) using `chart.js` and `react-chartjs-2`.
- Class Rankings & Leaderboards (D1, D2, D3, Final year, etc.).

### 🤝 3. Mahabba Campaign & Donor Directory
- **New Donor Onboarding**: Instant registration with auto-generated unique IDs (`TOH-D-XXXXXX`).
- **Renewals System**: Split month plan support (e.g., ₹100/month across multiple custom selected months) modeled after the Mahabba workflow.
- **Physical Verification Queue**: Admin/Manager verification approval flow for cash collections logged by campaigners.
- **Class Handovers**: Logging and tracking class leader cash handovers to administrators with receipt generation.

### 📄 4. Digital Receipts & Exporting
- Instant receipt preview modal (`ReceiptModal` & `MahabbaReceiptModal`).
- Download receipt as PDF (`jspdf`) or high-resolution PNG image (`html-to-image`).
- Multi-format data exports (`CSV`, `Excel`, `PDF`) via `ExportMenu`.

### ⚡ 5. Offline PWA & Optimistic UI
- Offline queue sync state for campaigners in low-connectivity areas.
- Resilient local fallback state for additions and deletions with automatic resync upon connection restore.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19, Tailwind CSS 3.4, Lucide Icons (`lucide-react`)
- **Animation**: Framer Motion
- **State Management**: Zustand & React Hooks
- **Data Visualization**: Chart.js & React-Chartjs-2
- **Document Generation**: jsPDF, html-to-image

### Backend
- **Runtime**: Node.js (v20+ ESM/TypeScript)
- **Framework**: Express.js 4.19
- **ORM / Database**: Prisma 5.12 with PostgreSQL (Neon Serverless DB in prod / PostgreSQL 15 in Docker)
- **Caching & Rate Limiting**: Redis / Upstash Redis via `ioredis`, `express-rate-limit`
- **Security & Utilities**: Helmet, CORS, Compression, Zod (validation), BcryptJS, JSONWebTokens

---

## System Architecture Overview

```mermaid
graph TD
    Client[Next.js 15 Frontend PWA] -->|HTTP / REST API| Express[Express.js Node Backend]
    Client -->|Local Storage Cache| Cache[Browser Storage / Offline Queue]
    Express -->|Prisma ORM| Postgres[(PostgreSQL Database)]
    Express -->|Redis Client| Redis[(Redis Caching / Rate Limit)]
```

---

## Installation Guide

### Prerequisites
- Node.js `v20.x` or higher
- npm `v10.x` or yarn / pnpm
- Docker & Docker Compose (Optional for local DB setup)
- PostgreSQL database instance

### Quick Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/organization/token-of-halawa.git
   cd token-of-halawa
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

---

## Local Development

### Option A: Running with Local Docker Infrastructure (Recommended)
1. Start PostgreSQL & Redis via Docker Compose:
   ```bash
   docker-compose up -d database redis
   ```
2. Run database migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```
3. Start Backend Dev Server:
   ```bash
   npm run dev
   # Server running on http://localhost:5000
   ```
4. Start Frontend Dev Server in a new terminal:
   ```bash
   cd frontend
   npm run dev
   # Next.js running on http://localhost:3000
   ```

---

## Build Commands

### Backend
```bash
cd backend
npm run build     # Compiles TypeScript to dist/
npm run start     # Starts production node server (dist/server.js)
```

### Frontend
```bash
cd frontend
npm run build     # Generates optimized Next.js static & SSR production build
npm run start     # Launches Next.js production server
```

---

## Environment Variables

Ensure `.env` files are configured in both `/backend` and `/frontend` directories.

### Backend (`/backend/.env`)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://toh_user:toh_secure_password@localhost:5432/token_of_halawa?schema=public"
JWT_SECRET="token_of_halawa_super_secret_access_key"
JWT_REFRESH_SECRET="token_of_halawa_super_secret_refresh_key"
REDIS_URL="redis://localhost:6379"
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

---

## Deployment

- **Frontend**: Deployed on **Vercel** (`vercel.json` included in `/frontend`).
- **Backend**: Containerized via Docker (`backend/Dockerfile`) or deployed to Node.js hosting (e.g. Render, Railway, AWS ECS).
- **Database**: Serverless PostgreSQL via **Neon Database** or AWS RDS.

Detailed deployment instructions are documented in [docs/DEPLOYMENT.md](file:///C:/Users/MSI%20PC/.gemini/antigravity/scratch/token-of-halawa/docs/DEPLOYMENT.md).

---

## Folder Structure

```
token-of-halawa/
├── backend/                  # Node.js + Express + Prisma REST API Backend
│   ├── prisma/               # Prisma Schema & Database Migrations
│   ├── src/                  # Controllers, Routes, Services, Middlewares
│   ├── Dockerfile            # Container definition for backend
│   └── package.json
├── frontend/                 # Next.js 15 React Web Application
│   ├── src/
│   │   ├── app/              # Next.js App Router pages (admin, campaigner, leader, developer)
│   │   ├── components/       # Reusable Dashboard, Receipt Modals & UI Components
│   │   └── store/            # State management modules
│   ├── public/               # Static assets & icons
│   └── package.json
├── docs/                     # Comprehensive Architecture & System Docs
├── docker-compose.yml        # Local development orchestration setup
└── README.md
```

Detailed tree analysis is documented in [docs/FOLDER_STRUCTURE.md](file:///C:/Users/MSI%20PC/.gemini/antigravity/scratch/token-of-halawa/docs/FOLDER_STRUCTURE.md).

---

## Project Screenshots Placeholder

> *Screenshots of the Dashboard, Admin Portal, Campaigner View, and Receipt Generation will be placed here.*

- **Dashboard Overview**: `![Dashboard Overview](docs/assets/dashboard.png)`
- **Admin Portal Analytics**: `![Admin Analytics](docs/assets/admin_analytics.png)`
- **Receipt Preview**: `![Receipt Modal](docs/assets/receipt.png)`

---

## Contributors
- **Ribat Students Union Development Team**
- Lead Architect & Engineers

---

## License
This project is proprietary and confidential. Authorized usage is restricted to Ribat Students Union & Token of Halawa administrators.
