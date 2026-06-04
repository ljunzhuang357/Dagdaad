"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("login");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { error: err } = await authClient.emailOtp.sendVerificationOtp({
        email: email.trim(),
        type: "sign-in",
      });
      if (err) {
        setError(err.message || t("errors.sendFailed"));
      } else {
        setOtpSent(true);
      }
    } catch {
      setError(t("errors.sendError"));
    }
    setLoading(false);
  };

  const redeemReferral = async () => {
    const refCode = localStorage.getItem("dagdaad_ref");
    if (!refCode) return;
    localStorage.removeItem("dagdaad_ref");
    try {
      await fetch("/api/referral/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: refCode }),
      });
    } catch {
      /* silent fail — referral bonus is nice-to-have */
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { error: err } = await authClient.signIn.emailOtp({
        email: email.trim(),
        otp: otp.trim(),
      });
      if (err) {
        setError(t("errors.invalidOtp"));
        setLoading(false);
        return;
      }
      await redeemReferral();
      const hasPending = !!localStorage.getItem("dagdaad_pending");
      window.location.href = hasPending ? "/write" : "/";
    } catch {
      setError(t("errors.verifyError"));
    }
    setLoading(false);
  };

  const signInGoogle = async () => {
    const hasPending = !!localStorage.getItem("dagdaad_pending");
    // Google sign-in redirects away, so redemption happens after callback
    // Store referral code in URL param via the callback flow
    const refCode = localStorage.getItem("dagdaad_ref");
    const cbUrl = hasPending
      ? `/write${refCode ? `?ref=${refCode}` : ""}`
      : refCode
        ? `/?ref=${refCode}`
        : "/";
    authClient.signIn.social({
      provider: "google",
      callbackURL: cbUrl,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">✨</span>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            {t("subtitle")}
          </p>
        </div>

        <div className="card">
          {!otpSent ? (
            <>
              <button
                onClick={signInGoogle}
                disabled={loading}
                className="btn-ghost w-full flex items-center justify-center gap-3 mb-4 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t("google")}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#E8E0D0]" />
                <span className="text-xs text-[var(--text-secondary)]">
                  {t("or")}
                </span>
                <div className="flex-1 h-px bg-[#E8E0D0]" />
              </div>

              <label className="text-sm font-medium mb-1 block">
                {t("emailLabel")}
              </label>
              <input
                className="input-field mb-4"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && (
                <p className="text-red-500 text-sm mb-3">{error}</p>
              )}

              <button
                onClick={sendOtp}
                disabled={loading || !email.trim()}
                className="btn-primary w-full disabled:opacity-40"
              >
                {loading ? t("sending") : t("sendOtp")}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-[var(--text-secondary)] mb-4 text-center">
                {t("otpSent")}<br/>
                <strong>{email}</strong>
              </p>
              <label className="text-sm font-medium mb-1 block">
                {t("otpLabel")}
              </label>
              <input
                className="input-field mb-4 text-center text-2xl tracking-widest"
                type="text"
                maxLength={6}
                placeholder={t("otpPlaceholder")}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />

              {error && (
                <p className="text-red-500 text-sm mb-3">{error}</p>
              )}

              <button
                onClick={verifyOtp}
                disabled={loading || otp.length < 4}
                className="btn-primary w-full disabled:opacity-40"
              >
                {loading ? t("verifying") : t("verify")}
              </button>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setError("");
                }}
                className="btn-ghost w-full mt-2 text-sm"
              >
                {t("changeEmail")}
              </button>
            </>
          )}
        </div>

        <p className="text-xs text-[var(--text-secondary)] text-center mt-6">
          {t("terms")}
        </p>
      </div>
    </div>
  );
}
