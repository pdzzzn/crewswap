
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, XCircle, RefreshCw, User } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/layout/header';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

import { User as UserType } from '@/lib/types';


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
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
    fetchNotifications();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      router.push('/login');
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SWAP_REQUEST_RECEIVED':
        return <Bell className="w-5 h-5 text-primary" />;
      case 'SWAP_REQUEST_APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'SWAP_REQUEST_DENIED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'SWAP_REQUEST_CANCELLED':
        return <RefreshCw className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'SWAP_REQUEST_RECEIVED':
        return <Badge variant="outline" className="bg-primary/10 text-blue-700 border-blue-300">New Request</Badge>;
      case 'SWAP_REQUEST_APPROVED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Approved</Badge>;
      case 'SWAP_REQUEST_DENIED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Denied</Badge>;
      case 'SWAP_REQUEST_CANCELLED':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">Cancelled</Badge>;
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
    <div className="min-h-screen bg-gray-50">
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
                  !notification.isRead ? 'border-blue-200 bg-primary/10/30' : ''
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
                      <User className="w-4 h-4" />
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
