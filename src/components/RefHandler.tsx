"use client";

import { useEffect } from "react";

export default function RefHandler() {
  useEffect(() => {
    // Check URL for referral param (from Google sign-in callback)
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) {
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.toString());

      // Process referral
      fetch("/api/referral/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: ref }),
      }).catch(() => {});
    }

    // Check localStorage (from direct /ref/CODE visit)
    const stored = localStorage.getItem("dagdaad_ref");
    if (stored) {
      localStorage.removeItem("dagdaad_ref");
      fetch("/api/referral/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: stored }),
      }).catch(() => {});
    }
  }, []);

  return null;
}
