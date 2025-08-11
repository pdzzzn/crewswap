"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Plane, Users, BarChart3 } from "lucide-react";
import { User } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDuties: 0,
    activeSwaps: 0,
  });
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

  useEffect(() => {
    async function fetchStats() {
      if (!user || !user.isAdmin) return;
      setStatsLoading(true);
      setStatsError(null);
      const supabase = createClient();
      try {
        const [usersRes, dutiesRes, swapsRes] = await Promise.all([
          supabase.from("users").select("*", { count: "exact", head: true }),
          supabase.from("duties").select("*", { count: "exact", head: true }),
          supabase
            .from("swap_requests")
            .select("*", { count: "exact", head: true })
            .eq("status", "PENDING"),
        ]);

        if (usersRes.error || dutiesRes.error || swapsRes.error) {
          throw new Error(
            usersRes.error?.message ||
              dutiesRes.error?.message ||
              swapsRes.error?.message ||
              "Failed to load stats"
          );
        }

        setStats({
          totalUsers: usersRes.count ?? 0,
          totalDuties: dutiesRes.count ?? 0,
          activeSwaps: swapsRes.count ?? 0,
        });
      } catch (err) {
        console.error("Admin stats error:", err);
        setStatsError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setStatsLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShieldCheck className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground font-medium">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header user={user} />

      <div className="flex flex-1 overflow-hidden transform-gpu">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="floating"/>
          
          <SidebarInset className="flex-1 overflow-y-auto">
            <main className="container max-w-screen-xl mx-auto px-4 py-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome, {user.name}. You have administrator privileges.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsLoading ? "—" : stats.totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +5 new this month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Duties
                    </CardTitle>
                    <Plane className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsLoading ? "—" : stats.totalDuties.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      +120 this month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Swaps
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsLoading ? "—" : stats.activeSwaps.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting resolution
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Site Status
                    </CardTitle>
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Operational</div>
                    <p className="text-xs text-muted-foreground">
                      All systems are normal
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <ChartAreaInteractive />
                <div className="mt-8">
                    <DataTable data={data} />
                </div>
                {/* Logs moved to dedicated /admin/logs page */}
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}