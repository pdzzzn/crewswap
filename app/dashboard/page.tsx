'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plane, Clock, Users } from 'lucide-react';
import Header from '@/components/layout/header';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {User} from '@/lib/types';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalDuties: 0,
    upcomingDuties: 0,
    pendingSwaps: 0,
    completedSwaps: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, loading, router]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch dashboard stats using direct Supabase queries
      const [dutiesResult, upcomingDutiesResult, pendingSwapsResult, completedSwapsResult] = await Promise.all([
        // Total duties assigned to user
        supabase
          .from('duties')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id),
        
        // Upcoming duties (future dates)
        supabase
          .from('duties')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('date', new Date().toISOString().split('T')[0]),
        
        // Pending swap requests (sent by user)
        supabase
          .from('swap_requests')
          .select('id', { count: 'exact' })
          .eq('sender_id', user.id)
          .eq('status', 'PENDING'),
        
        // Completed swap requests (sent by user)
        supabase
          .from('swap_requests')
          .select('id', { count: 'exact' })
          .eq('sender_id', user.id)
          .eq('status', 'APPROVED')
      ]);

      setStats({
        totalDuties: dutiesResult.count || 0,
        upcomingDuties: upcomingDutiesResult.count || 0,
        pendingSwaps: pendingSwapsResult.count || 0,
        completedSwaps: completedSwapsResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {formatRole(user.role)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Duties</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDuties}</div>
              <p className="text-xs text-muted-foreground">Assigned flights</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingDuties}</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Swaps</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingSwaps}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Swaps</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedSwaps}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}