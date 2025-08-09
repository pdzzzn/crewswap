'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, XCircle, RefreshCw, User as Userbadge } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/layout/header';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase';

import { User} from '@/lib/types';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  swapRequestId?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchNotifications();
    }
  }, [user, loading, router]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications(notifications.map(notification => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        isRead: notification.is_read,
        swapRequestId: notification.swap_request_id,
        createdAt: notification.created_at
      })));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );

      toast({
        title: 'Notification marked as read',
        description: 'The notification has been updated.',
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read.',
        variant: 'destructive',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SWAP_REQUEST_RECEIVED':
        return <Bell className="w-5 h-5 text-primary" />;
      case 'SWAP_REQUEST_APPROVED':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'SWAP_REQUEST_DENIED':
        return <XCircle className="w-5 h-5 text-error" />;
      case 'SWAP_REQUEST_CANCELLED':
        return <RefreshCw className="w-5 h-5 text-warning" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'SWAP_REQUEST_RECEIVED':
        return <Badge variant="outline" className="bg-info-light text-info border-info/30">New Request</Badge>;
      case 'SWAP_REQUEST_APPROVED':
        return <Badge variant="outline" className="bg-success-light text-success border-success/30">Approved</Badge>;
      case 'SWAP_REQUEST_DENIED':
        return <Badge variant="outline" className="bg-error-light text-error border-error/30">Denied</Badge>;
      case 'SWAP_REQUEST_CANCELLED':
        return <Badge variant="outline" className="bg-warning-light text-warning border-warning/30">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Notification</Badge>;
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
          <div className="flex items-center gap-4">
            <p className="text-muted-foreground">Stay updated on your swap requests and activity</p>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground/70 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You don't have any notifications yet. When you send or receive swap requests, they'll appear here.
              </p>
              <Button 
                className="mt-4"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`hover:shadow-md transition-all cursor-pointer ${
                  !notification.isRead ? 'border-primary/30 bg-primary/5' : ''
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    markAsRead(notification.id);
                  }
                  if (notification.swapRequestId) {
                    router.push('/swap-requests');
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {notification.title}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getNotificationBadge(notification.type)}
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(notification.createdAt), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                {notification.swapRequestId && (
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Userbadge className="w-4 h-4" />
                      <span>Click to view swap request details</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
