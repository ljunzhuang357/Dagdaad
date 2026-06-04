"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RefPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();

  useEffect(() => {
    if (params?.code) {
      localStorage.setItem("dagdaad_ref", params.code);
    }
    router.replace("/login");
  }, [params, router]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-orange)] border-t-transparent animate-spin" />
    </div>
  );
}
