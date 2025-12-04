import { Suspense, type ReactNode } from "react";
import { Shell } from "@/components/layout/Shell";
import { getCurrentUser } from "@/lib/auth";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentUser();

  return (
    <Suspense fallback={null}>
      <Shell session={session}>{children}</Shell>
    </Suspense>
  );
}
