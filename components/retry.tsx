"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ReactNode } from "react";
import { PrimaryPill } from "@/components/ui/buttons";

/** Re-requests the server data of the current route. */
export function RetryButton({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <PrimaryPill onClick={() => start(() => router.refresh())} disabled={pending} aria-busy={pending}>
      {children}
    </PrimaryPill>
  );
}
