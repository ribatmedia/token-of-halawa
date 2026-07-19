# PROJECT_STRUCTURE.md

```
token-of-halawa/
├─ backend/                # Express API server
│   ├─ src/
│   │   ├─ controllers/    # Route handlers
│   │   ├─ routes/         # API route definitions
│   │   └─ index.ts        # Server entry point
│   └─ package.json
├─ frontend/               # Next.js (app router) UI
│   ├─ src/
│   │   ├─ app/           # Page components (home, developer, etc.)
│   │   ├─ components/    # Re‑usable UI components
│   │   └─ styles/        # Global CSS and design‑system tokens
│   └─ package.json
├─ .env.example            # Example environment variables
├─ README.md
├─ AI_CONTEXT.md
├─ AGENTS.md
├─ DESIGN_SYSTEM.md
├─ FEATURES.md
├─ API.md
├─ DATABASE.md
├─ CHANGELOG.md
└─ CONTRIBUTING.md
```

This structure keeps the frontend and backend isolated, makes it easy to run each side independently, and follows the conventions used throughout the codebase.
