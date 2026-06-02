# Dagdaad

荷兰市场 "每日一件好事" Web 应用。记录、分享、坚持做好事。

## 技术栈

- **框架** — Next.js 16 (App Router), React 19
- **样式** — Tailwind CSS v4
- **数据库** — Neon PostgreSQL 17
- **ORM** — Drizzle ORM
- **认证** — Better Auth (Drizzle adapter + email OTP)
- **邮件** — Resend (验证码发送)
- **部署** — Vercel

## 开发

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

环境变量参见 `.env.example`（目前参考 `.env.local`）。

## 数据库

```bash
npx drizzle-kit generate   # 生成迁移
npx drizzle-kit push       # 推送到远程
```

## 仓库说明

正式仓库，非模板。commit 信息尽量写清楚改了什么。
