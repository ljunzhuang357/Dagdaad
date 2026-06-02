"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";

export default function Nav() {
  const t = useTranslations("nav");
  const { data: session, isPending } = authClient.useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto w-full">
      <Link href="/" className="text-xl font-bold">
        ✨ Dagdaad
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/write"
          className="btn-ghost text-sm hidden sm:block"
        >
          {t("write")}
        </Link>
        <Link
          href="/calendar"
          className="btn-ghost text-sm hidden sm:block"
        >
          {t("calendar")}
        </Link>
        <Link
          href="/stats"
          className="btn-ghost text-sm hidden sm:block"
        >
          {t("stats")}
        </Link>
        {isPending ? (
          <span className="text-sm text-[var(--text-secondary)]">…</span>
        ) : session?.user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm hidden sm:block">
              {session.user.name}
            </span>
            <button
              onClick={() => authClient.signOut()}
              className="btn-ghost text-sm cursor-pointer"
            >
              {t("logout")}
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn-primary text-sm ml-2">
            {t("login")}
          </Link>
        )}
      </div>
    </nav>
  );
}
