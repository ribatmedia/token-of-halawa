# Production Deployment Guide & Checklist

> **Document Purpose**: Operational deployment instructions for launching **Token of Halawa** across Vercel (Frontend), Docker / Managed Node.js containers (Backend), and Serverless PostgreSQL (Neon DB).

---

## 1. Environment Specifications

| Environment Parameter | Frontend Value | Backend Value |
| :--- | :--- | :--- |
| **Framework** | Next.js 15.0.0 (App Router) | Express.js 4.19.2 |
| **Node Version** | Node.js `v20.x` LTS | Node.js `v20.x` LTS |
| **Install Command** | `npm install` | `npm install` |
| **Build Command** | `npm run build` | `npm run build` |
| **Output Directory** | `.next` | `dist` |
| **Hosting Platform** | Vercel Serverless Platform | Render / Railway / AWS ECS |

---

## 2. Environment Variables Configuration

### Backend Production Environment (`/backend/.env`)
```env
PORT=5000
NODE_ENV=production

# Neon Serverless PostgreSQL Database Connection
DATABASE_URL="postgresql://toh_owner:secure_pass@ep-small-cloud-123456.us-east-1.aws.neon.tech/token_of_halawa?sslmode=require"

# JWT Secrets (Must be strong 64-character random strings)
JWT_SECRET="e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8"
JWT_REFRESH_SECRET="a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"

# Upstash Redis URL for Rate Limiting & Session Caching
REDIS_URL="rediss://default:redis_password@us1-fast-redis.upstash.io:6379"

RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### Frontend Production Environment (`/frontend/.env.production`)
```env
NEXT_PUBLIC_API_URL="https://api.tokenofhalawa.org/api/v1"
```

---

## 3. Frontend Deployment (Vercel)

### Automatic Deployment via Vercel CLI / GitHub
1. Connect the GitHub repository to your Vercel Dashboard.
2. Set Root Directory to `frontend`.
3. Framework Preset: `Next.js`.
4. Configure environment variable: `NEXT_PUBLIC_API_URL`.
5. Deploy. Vercel automatically runs `npm install` and `npm run build`.

---

## 4. Backend Deployment (Docker Container)

The backend includes a production-ready multi-stage `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

### Deploying Container to Production Server
```bash
cd backend
docker build -t token-of-halawa-backend:latest .
docker run -d -p 5000:5000 --env-file .env token-of-halawa-backend:latest
```

---

## 5. Database Setup (Prisma & PostgreSQL)

1. **Apply Migrations to Production DB**:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```
2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

---

## 6. Domain, SSL & Networking Configuration

- **Frontend Domain**: `https://tokenofhalawa.org` (Managed via Vercel DNS with automatic Let's Encrypt SSL).
- **Backend Domain**: `https://api.tokenofhalawa.org` (Configured with NGINX Reverse Proxy + Certbot Let's Encrypt SSL certificate).

---

## 7. Production Pre-Launch Checklist

- [x] Database migrations deployed via `npx prisma migrate deploy`.
- [x] JWT Secret keys generated with high entropy.
- [x] CORS configuration explicitly updated to allow only trusted frontend origin (`https://tokenofhalawa.org`).
- [x] Helmet security headers active on backend Express app.
- [x] Rate limiting active via Redis store.
- [x] Frontend `npm run build` succeeds without TypeScript or linting errors.
- [x] Offline fallback and PWA service worker validated.
