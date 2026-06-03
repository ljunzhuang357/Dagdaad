"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export default function Nav() {
  const t = useTranslations("nav");
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  const linkClass =
    "btn-ghost text-sm text-center min-h-[44px] flex items-center justify-center";

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-4xl mx-auto w-full">
      <Link href="/" className="text-xl font-bold min-h-[44px] flex items-center">
        ✨ Dagdaad
      </Link>

      {/* Desktop nav */}
      <div className="hidden sm:flex items-center gap-1">
        <Link href="/write" className={linkClass}>
          {t("write")}
        </Link>
        <Link href="/calendar" className={linkClass}>
          {t("calendar")}
        </Link>
        <Link href="/stats" className={linkClass}>
          {t("stats")}
        </Link>
        {isPending ? (
          <span className="text-sm text-[var(--text-secondary)] px-3">…</span>
        ) : session?.user ? (
          <div className="flex items-center gap-1">
            <span className="text-sm text-[var(--text-secondary)] px-2 hidden md:block">
              {session.user.name}
            </span>
            <button
              onClick={() => authClient.signOut()}
              className={`${linkClass} cursor-pointer`}
            >
              {t("logout")}
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn-primary text-sm ml-2 min-h-[44px] flex items-center">
            {t("login")}
          </Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden flex flex-col gap-1 p-3 min-w-[44px] min-h-[44px] items-center justify-center rounded-xl hover:bg-[#F5F0E8] transition-colors cursor-pointer"
        aria-label={menuOpen ? "Sluit menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span
          className={`block w-5 h-0.5 bg-[var(--text-primary)] rounded transition-all duration-200 ${
            menuOpen ? "rotate-45 translate-y-[3px]" : ""
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-[var(--text-primary)] rounded transition-all duration-200 ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block w-5 h-0.5 bg-[var(--text-primary)] rounded transition-all duration-200 ${
            menuOpen ? "-rotate-45 -translate-y-[3px]" : ""
          }`}
        />
      </button>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 sm:hidden"
            onClick={() => setMenuOpen(false)}
          />
          {/* Menu panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-[var(--bg-warm)] z-50 shadow-2xl sm:hidden flex flex-col pt-20 px-6 gap-2 animate-slide-in">
            <Link
              href="/write"
              className="card text-center py-4 text-lg font-medium"
              onClick={() => setMenuOpen(false)}
            >
              ✍️ {t("write")}
            </Link>
            <Link
              href="/calendar"
              className="card text-center py-4 text-lg font-medium"
              onClick={() => setMenuOpen(false)}
            >
              📅 {t("calendar")}
            </Link>
            <Link
              href="/stats"
              className="card text-center py-4 text-lg font-medium"
              onClick={() => setMenuOpen(false)}
            >
              📊 {t("stats")}
            </Link>

            <div className="mt-auto mb-8">
              {isPending ? (
                <p className="text-center text-sm text-[var(--text-secondary)]">
                  …
                </p>
              ) : session?.user ? (
                <div className="space-y-2">
                  <p className="text-center text-sm text-[var(--text-secondary)]">
                    {session.user.name}
                  </p>
                  <button
                    onClick={() => {
                      authClient.signOut();
                      setMenuOpen(false);
                    }}
                    className="btn-ghost text-sm w-full min-h-[44px] cursor-pointer"
                  >
                    {t("logout")}
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary text-center block text-base py-3"
                  onClick={() => setMenuOpen(false)}
                >
                  🚀 {t("login")}
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
