# Token of Halawa

A modern donation platform built with **Next.js** (app router) and **Tailwind‑free** vanilla CSS. It includes a developer panel for banner uploads, campaign management, and donor directory.

## Quick Start
```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

## Features
- Banner upload studio (2:1 ratio, up to 3 banners)
- Campaign slider fallback and carousel
- Donor directory with search & filters
- Data reset endpoint for developers

## Architecture
- `frontend/src/app` – Next.js app pages
- `frontend/src/components` – reusable UI components
- `backend/src` – Express API with routes for reset, etc.

## License
MIT
