import type { ReactNode } from "react";
import PortalFooter from "@/components/site/PortalFooter";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:px-10">
        {children}
      </div>
      <PortalFooter />
    </div>
  );
}
