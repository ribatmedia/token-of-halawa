# Feature Catalog & Functional Specifications

> **Document Purpose**: This document provides a complete audit of all software features implemented across the **Token of Halawa** platform.

---

## 1. Feature Categories Summary

| Category | Feature Name | Status | Primary Target Audience |
| :--- | :--- | :--- | :--- |
| **Authentication** | Multi-Role JWT Auth & RBAC | ✅ Production Ready | All Users |
| **Dashboard** | Analytics Dashboard & Live Charts | ✅ Production Ready | Admin, Manager, Leader, Campaigner |
| **User Management** | Volunteer & Leader Directory | ✅ Production Ready | Admin, Class Leader |
| **Admin Panel** | Verification Queue & Global Stats | ✅ Production Ready | Super Admin, Org Admin |
| **Products** | Inventory / E-Commerce Products | ⚠️ Not Applicable / Needs Manual Configuration | N/A |
| **Orders** | Commercial Orders | ⚠️ Not Applicable / Needs Manual Configuration | N/A |
| **Payments** | Donation Payment Tracking & Gateways | ✅ Production Ready | Field Campaigner, Donor |
| **Reports** | Data Exporting & Aggregated Stats | ✅ Production Ready | Admin, Auditor, Manager |
| **Gallery** | Media Gallery | ⚠️ Not Applicable / Needs Manual Configuration | N/A |
| **News** | Announcements & News Feed | ✅ Production Ready (Schema Supported) | All Users |
| **Settings** | Organization & App Configurations | ✅ Production Ready (Schema Supported) | Admin |
| **Notifications** | Receipt & Reminder Notifications | ✅ Production Ready (Schema Supported) | Donors, Campaigners |
| **Integrations** | WhatsApp, PDF & Excel Exports | ✅ Production Ready | All Users |
| **Other Features** | Mahabba Campaign, Class Handover, Receipt Modal | ✅ Production Ready | Field Campaigner, Class Leader |

---

## 2. Detailed Feature Breakdown

### 🔑 1. Authentication
- **Purpose**: Authenticate users, verify credentials via Bcrypt hashing, generate JWT access & refresh tokens, and enforce role-based access control (RBAC).
- **Location**: `/backend/src/routes/auth.ts`, `/backend/src/controllers/auth.ts`, `/backend/src/middleware/auth.ts`
- **Related Files**:
  - `backend/src/controllers/auth.ts`
  - `backend/src/services/auth.ts`
  - `backend/src/middleware/auth.ts`
- **Related APIs**:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh`

---

### 📊 2. Dashboard
- **Purpose**: Provide real-time financial transparency, daily/monthly collection totals, active donor counts, monthly collection growth trajectory charts, and campaign collection progression charts.
- **Location**: `frontend/src/components/DashboardOverview.tsx` (Analytics Tab)
- **Related Files**:
  - `frontend/src/components/DashboardOverview.tsx`
  - `frontend/src/app/page.tsx`
- **Related APIs**:
  - `GET /api/v1/public/home-stats`
  - `GET /api/v1/donations/all`

---

### 👥 3. User Management & Campaigners Directory
- **Purpose**: Track field volunteers, campaigners, class leaders, daily/monthly collection targets, and Roll No (HN number) codes.
- **Location**: `frontend/src/components/DashboardOverview.tsx` (Campaigners Stats & Donors Directory Tabs)
- **Related Files**:
  - `backend/src/routes/donor.ts`
  - `backend/src/controllers/donor.ts`
  - `frontend/src/components/DashboardOverview.tsx`
- **Related APIs**:
  - `GET /api/v1/campaigners`
  - `GET /api/v1/donors`
  - `POST /api/v1/donors`
  - `DELETE /api/v1/donors/:id`

---

### 🛡️ 4. Admin Panel & Physical Verification Queue
- **Purpose**: Provide super admins and area managers with a physical verification queue to inspect, approve, or reject cash collections logged by field campaigners.
- **Location**: `frontend/src/app/admin/page.tsx`, `frontend/src/components/DashboardOverview.tsx` (Verify Physical Tab)
- **Related Files**:
  - `backend/src/routes/donation.ts`
  - `backend/src/routes/mahabba.ts`
  - `frontend/src/components/DashboardOverview.tsx`
- **Related APIs**:
  - `GET /api/v1/donations/queue`
  - `PATCH /api/v1/donations/:id/verify`
  - `PATCH /api/v1/mahabba/donations/:id/verify`
  - `PATCH /api/v1/mahabba/donations/:id/unverify`

---

### 🛍️ 5. Products & 🛒 6. Orders
- **Status**: ⚠️ **Not Applicable / Needs Manual Configuration**
- **Note**: Token of Halawa is dedicated to non-profit donation and campaign management. Traditional e-commerce products and shopping cart orders are not part of this core domain.

---

### 💳 7. Payments & Donations
- **Purpose**: Process new donation entries, multi-month subscription renewals (e.g. custom months selected at ₹100/month rate), auto-split amount math, and payment gateway references (Cash, UPI, Razorpay, Bank Transfer).
- **Location**: `frontend/src/components/DashboardOverview.tsx` (Donation Entries Tab)
- **Related Files**:
  - `backend/src/controllers/donation.ts`
  - `backend/src/controllers/mahabba.ts`
  - `backend/prisma/schema.prisma` (`Donation`, `Payment`, `PaymentMethod` models)
- **Related APIs**:
  - `POST /api/v1/donations`
  - `POST /api/v1/mahabba/donations/new`
  - `POST /api/v1/mahabba/donations/renew`
  - `DELETE /api/v1/donations/:id`

---

### 📈 8. Reports & Data Exporting
- **Purpose**: Export donation records, donor lists, and financial summaries into CSV, Excel, and PDF formats.
- **Location**: `frontend/src/components/ExportMenu.tsx`
- **Related Files**:
  - `frontend/src/components/ExportMenu.tsx`
  - `backend/src/services/report.ts`
- **Related APIs**:
  - Client-side export processing via `ExportMenu.tsx`.

---

### 🖼️ 9. Gallery & 📰 10. News
- **Gallery**: ⚠️ **Not Applicable / Needs Manual Configuration**
- **News / Announcements**: Supported in backend database schema via `Announcement` model (`/backend/prisma/schema.prisma`).

---

### ⚙️ 11. Settings & 🔔 12. Notifications
- **Settings**: Schema supports key-value configuration via `Setting` model (`GENERAL`, `WHATSAPP`, `RECEIPT`, `BACKUP`, `THEME`).
- **Notifications**: Schema supports templated WhatsApp, SMS, and Email receipt dispatch via `Notification` and `NotificationTemplate` models.

---

### 🔗 13. Integrations
- **WhatsApp Direct Receipt Link**: Generate formatted WhatsApp sharing URL (`https://wa.me/?text=...`) for instant receipt forwarding to donors.
- **Client-Side PDF & Image Generation**: Convert HTML receipt elements to high-resolution PNG using `html-to-image` and standard PDF documents using `jspdf`.

---

### 🚀 14. Other Specialized Features

#### A. Mahabba Campaign Renewal System
- **Purpose**: Allows field campaigners to select custom months (e.g., Jun, Jul, Aug), automatically split donation amounts, and log multi-month contributions for returning donors.
- **Related Files**: `backend/src/controllers/mahabba.ts`, `frontend/src/components/DashboardOverview.tsx`

#### B. Class Handover System
- **Purpose**: Class Leaders log cash collected from their class and generate a formal Handover Receipt (`HND-2026-XXXX`) when handing funds over to the central admin.
- **Related Files**: `backend/src/controllers/mahabba.ts`, `frontend/src/components/DashboardOverview.tsx` (Class Handovers Tab)
- **Related APIs**: `POST /api/v1/mahabba/class-handovers`, `GET /api/v1/mahabba/class-handovers`

#### C. Developer Tools & Factory Reset
- **Purpose**: System diagnostics, diagnostic status checks, custom banners, and complete factory data resets for development environments.
- **Related Files**: `backend/src/routes/developer.ts`, `backend/src/controllers/developer.ts`, `frontend/src/components/DashboardOverview.tsx` (Developer Tools Tab)
- **Related APIs**: `GET /api/v1/developer/diagnostics`, `DELETE /api/v1/developer/reset`, `PUT /api/v1/developer/banners`
