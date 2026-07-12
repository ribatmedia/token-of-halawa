# Token of Halawa Deployment Guide

Follow these steps to deploy **Token of Halawa** in a production environment using a serverless and managed infrastructure stack.

---

## 1. Database Provisioning (Neon PostgreSQL)

1. Sign up on [Neon Console](https://console.neon.tech/).
2. Create a new PostgreSQL Database named `token_of_halawa`.
3. Locate your connection string under the **Connection Details** section (ensure it has pooling enabled via pgBouncer or direct pool connections).
   * Example: `postgresql://neondb_owner:password@ep-small-cloud.us-east-1.aws.neon.tech/neondb?sslmode=require`
4. Store this URL as your `DATABASE_URL` environment variable.

---

## 2. Serverless Cache & Queues (Upstash Redis)

1. Log into the [Upstash Console](https://console.upstash.com/).
2. Create a new **Redis Database** choosing your preferred region (select the one closest to your backend hosting region for minimal latency).
3. Under the **Node.js connection details**, copy the Redis URL connection string:
   * Example: `rediss://default:token@us1-fast-redis-44911.upstash.io:6379`
4. Set this as your `REDIS_URL` backend environment variable.

---

## 3. Backend Deployment (Railway)

1. Log into your [Railway](https://railway.app) account.
2. Click **New Project** -> **Deploy from GitHub repo** and connect your repository.
3. Under settings, set the root directory of the build to `/backend` (or deploy via the `backend/Dockerfile`).
4. Add the following **Environment Variables**:
   * `PORT`: `5000`
   * `NODE_ENV`: `production`
   * `DATABASE_URL`: `[Your Neon Connection URL]`
   * `JWT_SECRET`: `[High entropy random string, min 32 chars]`
   * `JWT_REFRESH_SECRET`: `[High entropy random string, min 32 chars]`
   * `REDIS_URL`: `[Your Upstash Redis connection string]`
   * `RATE_LIMIT_MAX`: `200`
5. Railway will automatically build the service, compile the TypeScript source files, run the Prisma generation Hook on builds, and launch the listener process.

---

## 4. Frontend Deployment (Vercel)

1. Go to the [Vercel Dashboard](https://vercel.com).
2. Create a new project and import your repository.
3. Set the **Framework Preset** to **Next.js**.
4. Configure the **Root Directory** to `frontend`.
5. Set the **Environment Variables**:
   * `NEXT_PUBLIC_API_URL`: `[Your deployed Railway Backend URL]/api/v1`
6. Click **Deploy**. Vercel will optimize and compile Next.js server actions, routes, bundle assets, and deploy globally on Vercel's edge network.

---

## 5. Post-Deployment Database Initialization

Once the database and backend are live, run the initial Prisma migration sequence to populate the 50+ tables:

```bash
cd backend
npx prisma db push
```

This updates the Neon schema catalog automatically without needing custom SQL scripts.
