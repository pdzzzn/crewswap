"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Plane, Users, BarChart3 } from "lucide-react";
import { User } from "@/lib/types";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";

export default function AdminDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.isAdmin) {
            setUser(data.user);
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

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

      {/* This is the key change: adding 'overflow-hidden' */}
      <div className="flex flex-1 overflow-hidden transform-gpu">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="floating" />
          
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
                    <div className="text-2xl font-bold">142</div>
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
                    <div className="text-2xl font-bold">1,234</div>
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
                    <div className="text-2xl font-bold">89</div>
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
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}