import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdminMe } from "@/hooks/useAdminAuth";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { data, isLoading } = useAdminMe();

  if (isLoading) return <div className="p-8 text-muted-foreground">Checking admin session…</div>;
  if (!data?.authenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
