import type { ReactNode } from "react";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { MenuSidebar } from "@/shared/components/menu-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <MenuSidebar>{children}</MenuSidebar>
    </AuthGuard>
  );
}
