# CrackIt API Server

Backend for CrackIt — an AI-powered voice interview practice platform.

**Stack:** Node.js · Express 5 · Supabase (Postgres + Auth + Storage) · Zod

---

## Project Structure

```
server/
├── src/
│   ├── config/         # Supabase clients, env validation
│   ├── controllers/    # Route handlers (business logic)
│   ├── middleware/      # Error handling, auth guards, etc.
│   ├── models/         # Data-access helpers & types
│   ├── routes/         # Express route definitions
│   ├── services/       # External service wrappers (AI, storage, etc.)
│   ├── utils/          # Shared helper functions
│   ├── validators/     # Zod request/response schemas
│   ├── app.js          # Express app factory
│   └── index.js        # Entry point (boots the server)
├── .env                # Local secrets (git-ignored)
├── .env.example        # Template for required env vars
└── package.json
```

## Getting Started

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your Supabase project credentials:

```bash
cp .env.example .env
```

| Variable                     | Description                                   |
| ---------------------------- | --------------------------------------------- |
| `SUPABASE_URL`               | Your Supabase project URL                     |
| `SUPABASE_ANON_KEY`          | Public anon key (respects RLS)                |
| `SUPABASE_SERVICE_ROLE_KEY`  | Service-role key (bypasses RLS — keep secret!) |
| `PORT`                       | Server port (default: `4000`)                 |
| `NODE_ENV`                   | `development` / `production` / `test`         |
| `CORS_ORIGINS`               | Comma-separated allowed origins               |

### 3. Start the dev server

```bash
npm run dev
```

You should see:

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │   🎤  CrackIt API Server                │
  │                                          │
  │   Port : 4000                            │
  │   Env  : development                     │
  │                                          │
  │   Health → http://localhost:4000/api/health  │
  │                                          │
  └──────────────────────────────────────────┘
```

### 4. Verify it works

```bash
curl http://localhost:4000/api/health
```

Expected response:

```json
{ "status": "ok", "supabase": "connected" }
```

If Supabase is unreachable (bad credentials, network issue):

```json
{ "status": "ok", "supabase": "error" }
```

## Supabase Clients

The server initializes **two** Supabase clients in `src/config/supabase.js`:

| Client          | Key Used       | RLS   | Use Case                              |
| --------------- | -------------- | ----- | ------------------------------------- |
| `supabase`      | Anon key       | ✅ On | User-facing requests (pass user JWT)  |
| `supabaseAdmin` | Service-role   | ❌ Off | Server-side ops, cron, admin tasks    |

> ⚠️ **Never use `supabaseAdmin` in user-facing code paths.** It bypasses all row-level security.

## Error Response Shape

All errors return a consistent JSON shape:

```json
{
  "error": {
    "message": "Human-readable description",
    "code": "MACHINE_READABLE_CODE"
  }
}
```

## Scripts

| Script          | Description                                 |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Start with `--watch` (auto-restart on save) |
| `npm start`     | Start in production mode                    |
