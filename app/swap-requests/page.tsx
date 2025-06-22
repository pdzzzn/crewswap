
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Plane, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  User,
  Send,
  Inbox
} from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/layout/header';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SwapRequest {
  id: string;
  status: string;
  message?: string;
  responseMessage?: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    role: string;
  };
  receiver?: {
    id: string;
    name: string;
    role: string;
  };
  senderDuty: {
    id: string;
    flightNumber: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    departureLocation: string;
    arrivalLocation: string;
  };
  targetDuty: {
    id: string;
    flightNumber: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    departureLocation: string;
    arrivalLocation: string;
  };
}

export default function SwapRequestsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [sentRequests, setSentRequests] = useState<SwapRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<SwapRequest[]>([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
    fetchSwapRequests();
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

  const fetchSwapRequests = async () => {
    try {
      const response = await fetch('/api/swap-requests');
      if (response.ok) {
        const data = await response.json();
        setSentRequests(data.sentRequests);
        setReceivedRequests(data.receivedRequests);
      }
    } catch (error) {
      console.error('Failed to fetch swap requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = async (requestId: string, action: 'approve' | 'deny') => {
    try {
      const response = await fetch(`/api/swap-requests/${requestId}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, responseMessage }),
      });

      if (response.ok) {
        toast({
          title: `Request ${action === 'approve' ? 'Approved' : 'Denied'}`,
          description: `You have ${action === 'approve' ? 'approved' : 'denied'} the swap request.`,
        });
        fetchSwapRequests();
        setSelectedRequest(null);
        setResponseMessage('');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to respond to request');
      }
    } catch (error) {
      toast({
        title: 'Response Failed',
        description: error instanceof Error ? error.message : 'Failed to respond to request.',
        variant: 'destructive',
      });
    }
  };

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'HH:mm');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending</Badge>;
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Approved</Badge>;
      case 'DENIED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Denied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const SwapRequestCard = ({ request, type }: { request: SwapRequest; type: 'sent' | 'received' }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {type === 'sent' ? (
              <Send className="w-5 h-5 text-blue-600" />
            ) : (
              <Inbox className="w-5 h-5 text-green-600" />
            )}
            <div>
              <CardTitle className="text-lg">Swap Request</CardTitle>
              <p className="text-sm text-gray-500">
                {type === 'sent' 
                  ? `To: ${request.receiver?.name}` 
                  : `From: ${request.sender?.name}`
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            {getStatusBadge(request.status)}
            <p className="text-xs text-gray-500 mt-1">
              {format(new Date(request.createdAt), 'MMM dd, HH:mm')}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Flight Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">
              {type === 'sent' ? 'Your Flight' : 'Their Flight'}
            </p>
            <div className="space-y-1">
              <p className="font-bold text-blue-600">{request.senderDuty.flightNumber}</p>
              <p className="text-sm text-gray-600">{formatDate(request.senderDuty.date)}</p>
              <div className="flex items-center gap-2 text-sm">
                <span>{request.senderDuty.departureLocation}</span>
                <ArrowRight className="w-3 h-3" />
                <span>{request.senderDuty.arrivalLocation}</span>
              </div>
              <p className="text-sm text-gray-600">
                {formatTime(request.senderDuty.departureTime)} - {formatTime(request.senderDuty.arrivalTime)}
              </p>
            </div>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2">
              {type === 'sent' ? 'Requested Flight' : 'Your Flight'}
            </p>
            <div className="space-y-1">
              <p className="font-bold text-green-600">{request.targetDuty.flightNumber}</p>
              <p className="text-sm text-gray-600">{formatDate(request.targetDuty.date)}</p>
              <div className="flex items-center gap-2 text-sm">
                <span>{request.targetDuty.departureLocation}</span>
                <ArrowRight className="w-3 h-3" />
                <span>{request.targetDuty.arrivalLocation}</span>
              </div>
              <p className="text-sm text-gray-600">
                {formatTime(request.targetDuty.departureTime)} - {formatTime(request.targetDuty.arrivalTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {request.message && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Message:</p>
            <p className="text-sm text-gray-600">{request.message}</p>
          </div>
        )}

        {request.responseMessage && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Response:</p>
            <p className="text-sm text-gray-600">{request.responseMessage}</p>
          </div>
        )}

        {/* Actions for received pending requests */}
        {type === 'received' && request.status === 'PENDING' && (
          <div className="flex gap-2 pt-2 border-t">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedRequest(request)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Approve Swap Request</DialogTitle>
                  <DialogDescription>
                    You are about to approve this duty swap. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="response">Response Message (Optional)</Label>
                    <Textarea
                      id="response"
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Add a message to your response..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setSelectedRequest(null);
                      setResponseMessage('');
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleResponse(request.id, 'approve')}
                    >
                      Approve Swap
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedRequest(request)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Deny
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deny Swap Request</DialogTitle>
                  <DialogDescription>
                    You are about to deny this duty swap request.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="response">Response Message (Optional)</Label>
                    <Textarea
                      id="response"
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Add a message to explain your decision..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setSelectedRequest(null);
                      setResponseMessage('');
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleResponse(request.id, 'deny')}
                    >
                      Deny Request
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Plane className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading swap requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
          <p className="text-gray-600">Manage your duty swap requests and responses</p>
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="received" className="flex items-center gap-2">
              <Inbox className="w-4 h-4" />
              Received ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Sent ({sentRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="space-y-6">
            {receivedRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No received requests</h3>
                  <p className="text-gray-600">
                    You haven't received any swap requests yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {receivedRequests.map((request) => (
                  <SwapRequestCard key={request.id} request={request} type="received" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-6">
            {sentRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sent requests</h3>
                  <p className="text-gray-600">
                    You haven't sent any swap requests yet. Go to your dashboard to request swaps.
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
              <div className="grid gap-6">
                {sentRequests.map((request) => (
                  <SwapRequestCard key={request.id} request={request} type="sent" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
