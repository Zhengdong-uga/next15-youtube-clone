# Portfolio (YouTube-Clone Fork)

A single-user video portfolio. Visitors browse freely with no login; the owner (you) logs in with a password to upload and manage video "portfolio entries" via a Studio. 

## Key Features

- 🎥 Advanced video player with Mux
- 🎬 Real-time video processing + auto transcription
- 🤖 AI-powered title + description (Google Gemini)
- 📊 Studio for video management (owner-only)
- � Simple password-based admin auth (no external auth provider)
- 🗄️ PostgreSQL with Drizzle ORM
- 🚀 Next.js 15 & React 19
- 🔄 tRPC for type-safe APIs
- 💅 TailwindCSS & shadcn/ui

## Prerequisites

- Node.js 18+
- PostgreSQL or NeonDB account
- Mux account (video processing)
- Google AI Studio API key (Gemini)
- Upstash account (Redis & Workflows)
- UploadThing account (image uploads)

## Getting Started

### 1. Install

```bash
npm install --legacy-peer-deps
cp .env.example .env
```

### 2. Configure environment

Edit `.env`:

```env
# Database (Postgres/Neon)
DATABASE_URL=postgres://...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin / owner (single-user portfolio)
OWNER_USER_ID=            # generate once with `uuidgen`
OWNER_NAME=Your Name
OWNER_IMAGE_URL=          # optional avatar URL
ADMIN_PASSWORD=some-strong-password

# Mux
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_WEBHOOK_SECRET=

# Gemini (title + description generation)
GEMINI_API_KEY=

# Upstash (Redis + Workflows for AI pipelines)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
UPSTASH_WORKFLOW_URL=http://localhost:3000   # or your ngrok/public URL
QSTASH_TOKEN=

# UploadThing (images)
UPLOADTHING_TOKEN=
```

Generate `OWNER_USER_ID` once and keep it stable:

```bash
uuidgen | tr 'A-Z' 'a-z'
```

### 3. Set up the database

```bash
npm run db:push            # apply schema
npm run seed:categories    # seed video categories
npm run seed:owner         # create the single owner user
```

### 4. Run

```bash
npm run dev
# open http://localhost:3000
```

Visitors see videos without any login. To manage content, go to `/admin/login`, enter `ADMIN_PASSWORD`, and you'll be taken to `/studio`.

## Available Scripts

- `dev` — Start dev server
- `build` / `start` — Production build + run
- `lint` — ESLint
- `dev:all` — Dev server + ngrok tunnel (for Mux webhooks / Upstash workflows)
- `db:generate` / `db:push` — Drizzle migrations
- `seed:categories` / `seed:owner` — DB seed scripts

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [UploadThing](https://uploadthing.com/)
- [Mux Video](https://mux.com/)
- [Google AI Studio (Gemini)](https://aistudio.google.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Upstash](https://upstash.com/)
