import { Suspense, type ReactNode } from "react";
import { Shell } from "@/components/layout/Shell";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
