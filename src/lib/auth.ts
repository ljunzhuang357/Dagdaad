import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { emailOTP } from "better-auth/plugins/email-otp";
import { Resend } from "resend";
import * as schema from "./auth-schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [
    emailOTP({
      otpLength: 6,
      async sendVerificationOTP({ email, otp, type }) {
        if (resend) {
          await resend.emails.send({
            from: "Dagdaad <noreply@dagdaad.nl>",
            to: email,
            subject: type === "sign-in" ? "Inloggen bij Dagdaad" : "Verifieer je e-mailadres",
            html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
              <div style="text-align:center;font-size:32px;margin-bottom:16px">✨</div>
              <h1 style="text-align:center;font-size:20px;font-weight:600;margin:0 0 8px">
                ${type === "sign-in" ? "Je verificatiecode" : "E-mailverificatie"}
              </h1>
              <p style="color:#666;text-align:center;margin:0 0 24px">
                Kopieer de code hieronder en plak deze op de Dagdaad inlogpagina
              </p>
              <div style="background:#f5f0e8;border-radius:12px;padding:16px;text-align:center;font-size:36px;font-weight:700;letter-spacing:8px;font-family:monospace">
                ${otp.match(/.{1,3}/g)?.join("&nbsp;") || otp}
              </div>
              <p style="color:#999;font-size:12px;text-align:center;margin-top:24px">
                Code is 5 minuten geldig
              </p>
            </div>`,
          });
        } else {
          // dev: log to console
          console.log(`[OTP] ${email} (${type}): ${otp}`);
        }
      },
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  trustedOrigins: [
    process.env.APP_URL || "http://localhost:3000",
  ],
});
