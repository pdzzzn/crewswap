
'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, ArrowRight, User } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Duty } from '@/lib/types';


interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  senderDuty: Duty;
  onSwapRequested: () => void;
}

export default function SwapRequestModal({ 
  isOpen, 
  onClose, 
  senderDuty, 
  onSwapRequested 
}: SwapRequestModalProps) {
  const [availableDuties, setAvailableDuties] = useState<Duty[]>([]);
  const [selectedDuty, setSelectedDuty] = useState<Duty | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchAvailableDuties();
    }
  }, [isOpen]);

  const fetchAvailableDuties = async () => {
    try {
      const response = await fetch('/api/duties/available');
      if (response.ok) {
        const data = await response.json();
        setAvailableDuties(data.duties);
      }
    } catch (error) {
      console.error('Failed to fetch available duties:', error);
    }
  };

  const handleSwapRequest = async () => {
    if (!selectedDuty) {
      toast({
        title: 'Selection Required',
        description: 'Please select a duty to swap with.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/swap-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderDutyId: senderDuty.id,
          targetDutyId: selectedDuty.id,
          receiverId: selectedDuty.user?.id,
          message,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Swap Request Sent',
          description: `Your swap request has been sent to ${selectedDuty.user?.name}.`,
        });
        onSwapRequested();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send swap request');
      }
    } catch (error) {
      toast({
        title: 'Request Failed',
        description: error instanceof Error ? error.message : 'Failed to send swap request.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Duty Swap</DialogTitle>
          <DialogDescription>
            Select a duty to swap with your assignment and send a request to the crew member.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Your Duty */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Your Duty</h3>
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-3 text-foreground">Your Duty to Swap</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Date: {formatDate(senderDuty.date)}
              </p>
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {senderDuty.legs.map((leg) => (
                  <div key={leg.id} className="p-3 rounded-md bg-background border">
                    <div className="flex items-center justify-between font-semibold text-sm">
                      <span>{leg.flightNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <div className="text-left">
                        <div className="font-medium">{leg.departureLocation}</div>
                        <div className="text-muted-foreground">{formatTime(leg.departureTime)}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-2 flex-shrink-0" />
                      <div className="text-right">
                        <div className="font-medium">{leg.arrivalLocation}</div>
                        <div className="text-muted-foreground">{formatTime(leg.arrivalTime)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Available Duties */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Available Duties to Swap With</h3>
            {availableDuties.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No available duties found.</p>
            ) : (
              <div className="grid gap-3 max-h-60 overflow-y-auto">
                {availableDuties.map((duty) => (
                  <Card 
                    key={duty.id}
                    className={`cursor-pointer transition-all ${
                      selectedDuty?.id === duty.id 
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setSelectedDuty(duty)}
                  >
                    <CardHeader className="pb-2 pt-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-sm">{duty.user?.name}</span>
                          <Badge variant="secondary" className="text-xs">{formatRole(duty.user?.role || '')}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(duty.date)}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="space-y-2">
                        {duty.legs.map(leg => (
                          <div key={leg.id} className="text-xs flex items-center justify-between text-muted-foreground">
                            <span>{leg.flightNumber}</span>
                            <span>{leg.departureLocation} → {leg.arrivalLocation}</span>
                            <span>{formatTime(leg.departureTime)} - {formatTime(leg.arrivalTime)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to your swap request..."
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSwapRequest}
              disabled={!selectedDuty || isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Sending...' : 'Send Swap Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
