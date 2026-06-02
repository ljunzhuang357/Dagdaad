"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Nav() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto w-full">
      <Link href="/" className="text-xl font-bold">✨ Dagdaad</Link>
      <div className="flex items-center gap-2">
        <Link href="/write" className="btn-ghost text-sm hidden sm:block">写</Link>
        <Link href="/calendar" className="btn-ghost text-sm hidden sm:block">日历</Link>
        <Link href="/stats" className="btn-ghost text-sm hidden sm:block">统计</Link>
        {isPending ? (
          <span className="text-sm text-[var(--text-secondary)]">…</span>
        ) : session?.user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm hidden sm:block">{session.user.name}</span>
            <button
              onClick={() => authClient.signOut()}
              className="btn-ghost text-sm cursor-pointer"
            >
              退出
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn-primary text-sm ml-2">
            登录 🚀
          </Link>
        )}
      </div>
    </nav>
  );
}
