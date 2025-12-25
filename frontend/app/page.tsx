"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Always go to login first
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
      Loading Hungry Hut 🍔
    </div>
  );
}
