# Dagdaad

Noteer elke dag een goede daad. Een web-app voor de Nederlandse markt.

**🌐 [dagdaad.nl](https://dagdaad.nl)**

## Tech Stack

- **Framework** — Next.js 16 (App Router), React 19
- **Styling** — Tailwind CSS v4
- **Database** — Neon PostgreSQL 17
- **ORM** — Drizzle ORM
- **Auth** — Better Auth (Drizzle adapter + email OTP, Google OAuth)
- **Email** — Resend (verification codes)
- **Payments** — Creem.io
- **Deployment** — Vercel

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

```bash
npx drizzle-kit generate   # generate migration
npx drizzle-kit push       # push to remote
```
