"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ShieldCheck } from "lucide-react";
import AdminLogs from "@/components/admin-logs";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogsPage() {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (!loading && user && !user.isAdmin) {
      router.push("/dashboard");
      return;
    }

    if (user && user.isAdmin) {
      setIsLoading(false);
    }
  }, [user, loading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShieldCheck className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header user={user} />
      <div className="flex flex-1 overflow-hidden transform-gpu">
        <SidebarProvider
          style={{
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties}
        >
          <AppSidebar variant="floating" />
          <SidebarInset className="flex-1 overflow-y-auto">
            <main className="container max-w-screen-xl mx-auto px-4 py-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Application Logs</h1>
                <p className="text-muted-foreground">View, filter, paginate, and live-tail application logs.</p>
              </div>
              <AdminLogs />
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
