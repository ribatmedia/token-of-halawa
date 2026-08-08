# Database Schema & Entity Documentation

> **Document Purpose**: Complete technical reference for the **Token of Halawa** database schema, listing every table, column, data type, primary/foreign keys, constraints, and relationships modeled in `backend/prisma/schema.prisma`.

---

## 1. Database Overview
- **Database Engine**: PostgreSQL 15
- **ORM / Schema Manager**: Prisma ORM 5.12.0
- **Connection Provider**: `postgresql` via `DATABASE_URL`
- **Total Models / Tables**: 42 Models

---

## 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    Organization ||--o{ User : contains
    Organization ||--o{ Donor : owns
    Organization ||--o{ Campaign : runs
    Organization ||--o{ ClassHandover : records

    Unit ||--o{ Class : contains
    Unit ||--o{ Volunteer : manages
    Class ||--o{ Volunteer : assigns
    
    User ||--o| Volunteer : profile
    User ||--o{ UserRole : has
    Role ||--o{ UserRole : assigned
    Role ||--o{ RolePermission : grants
    Permission ||--o{ RolePermission : mapped

    Donor ||--o{ Donation : makes
    Volunteer ||--o{ Donation : logs
    Campaign ||--o{ Donation : target
    Donation ||--o{ Payment : receives
    Donation ||--o{ Receipt : generates
    Organization ||--o{ Receipt : issues
```

---

## 3. Core Database Tables & Models

### 1. `Organization`
Root tenant model for multi-organization isolation.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | `@id`, `@default(uuid())` | Primary key |
| `name` | String | Required | Organization name |
| `slug` | String | `@unique` | URL-friendly unique slug |
| `logoUrl` | String | Optional | Organization logo asset URL |
| `currency` | String | `@default("USD")` | Base financial currency |
| `timezone` | String | `@default("UTC")` | Base time zone |
| `status` | String | `@default("ACTIVE")` | Status (`ACTIVE`, `SUSPENDED`) |
| `createdAt` | DateTime | `@default(now())` | Record creation timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Record update timestamp |

---

### 2. `User`
User authentication account.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | `@id` | Primary key |
| `organizationId` | String | FK -> `Organization.id` | Tenant organization reference |
| `email` | String | `@unique` | Login email address |
| `passwordHash` | String | Required | Bcrypt hashed password |
| `fullName` | String | Required | User's full display name |
| `phone` | String | Optional | Contact phone number |
| `status` | String | `@default("ACTIVE")` | Account status |
| `createdAt` | DateTime | `@default(now())` | Record creation timestamp |

---

### 3. `Role` & `Permission` (RBAC)
Role definitions and permission flags.

#### `Role` Table
- `id` (UUID, Primary Key)
- `name` (String, Unique: `SUPER_ADMIN`, `ORG_ADMIN`, `AREA_MANAGER`, `CLASS_LEADER`, `VOLUNTEER`, `AUDITOR`)
- `description` (String)

#### `Permission` Table
- `id` (UUID, Primary Key)
- `action` (String, Unique: e.g., `donation:create`, `donor:delete`, `campaign:read`)
- `description` (String)

#### `UserRole` & `RolePermission` Join Tables
- Composite Primary Keys: `[userId, roleId]` and `[roleId, permissionId]`.

---

### 4. `Volunteer`
Field campaigner profile.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | `@id` | Primary key |
| `userId` | String | `@unique`, FK -> `User.id` | User account reference |
| `unitId` | String | Optional, FK -> `Unit.id` | Organizational unit reference |
| `classId` | String | Optional, FK -> `Class.id` | Class assignment reference |
| `hnNumber` | String | Optional | Campaigner Roll No / Code |
| `className` | String | Optional | Denormalized class name (e.g., D1, D2, D3) |
| `dailyTarget` | Decimal(12,2)| `@default(0.00)` | Target daily collection amount |
| `monthlyTarget`| Decimal(12,2)| `@default(0.00)` | Target monthly collection amount |

---

### 5. `Donor`
Comprehensive donor profile.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | `@id` | Primary key |
| `organizationId` | String | FK -> `Organization.id` | Organization reference |
| `uniqueId` | String | `@unique` | Formatted donor ID (`TOH-D-XXXXXX`) |
| `name` | String | Required | Donor's full name |
| `phone` | String | Required | Contact phone number |
| `whatsApp` | String | Optional | WhatsApp contact number |
| `category` | String | `@default("GENERAL")` | `PREMIUM`, `GENERAL`, `WIDOW`, `ORPHAN` |
| `donationPlan` | String | `@default("MONTHLY")` | `MONTHLY`, `YEARLY`, `ONE_OFF` |
| `status` | String | `@default("ACTIVE")` | Status (`ACTIVE`, `INACTIVE`) |

---

### 6. `Donation`
Core financial donation transaction.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | `@id` | Primary key |
| `donorId` | String | FK -> `Donor.id` | Donor reference |
| `volunteerId` | String | Optional, FK -> `Volunteer.id` | Campaigner logging the entry |
| `amount` | Decimal(12,2)| Required | Total donation amount |
| `status` | String | `@default("PENDING")` | `PENDING`, `VERIFIED`, `REJECTED` |
| `donationMonth` | String | Optional | Covered months (e.g., "Jun, Jul, Aug") |
| `monthPlan` | String | Optional | Monthly rate (e.g., "100/month") |
| `isVerified` | Boolean | `@default(false)` | Verification status flag |
| `receiptNo` | String | Optional | Receipt reference (`MHB-2026-XXXX`) |

---

### 7. `ClassHandover`
Class leader cash handover to admin.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | `@id` | Primary key |
| `organizationId` | String | FK -> `Organization.id` | Tenant reference |
| `className` | String | Required | Class name (e.g., D1, D2, D3) |
| `handoverMonth` | String | Required | Target handover month |
| `leaderName` | String | Required | Name of class leader handing over |
| `amount` | Decimal(12,2)| Required | Total cash amount handed over |
| `receiptNo` | String | `@unique` | Handover receipt number (`HND-2026-XXXX`) |

---

### 8. Other Utility Models in Schema
- `Receipt`, `ReceiptItem`: Issued digital receipt records with unique receipt numbers.
- `Payment`, `PaymentMethod`: Payment gateway transaction logs.
- `Campaign`, `CampaignMember`, `Goal`: Campaign target tracking.
- `AuditLog`, `ActivityLog`, `SystemLog`: System monitoring, user action logs, and audit trails.
- `Session`, `Token`, `Otp`, `ApiKey`: Auth security and API key tokens.
