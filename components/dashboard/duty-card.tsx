
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react'; // <-- Make sure to add X to your lucide-react import
import { Plane, Clock, MapPin, ArrowRight, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import SwapRequestModal from './swap-request-modal';
import { Duty } from '@/lib/types';

interface DutyCardProps {
  duty: Duty;
  onSwapRequested?: () => void;
  showSwapButton?: boolean; // New prop to control swap button visibility
  onDelete?: (dutyId: string) => void; // New prop for the delete callback
}

export default function DutyCard({
  duty,
  onSwapRequested,
  showSwapButton = true, // Default to true so it doesn't break elsewhere
  onDelete
}: DutyCardProps) {
  const [showSwapModal, setShowSwapModal] = useState(false);

  const formatTime = (timeString: string) => {
    return format(new Date(timeString), 'HH:mm');
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getDayOfWeek = (dateString: string) => {
    return format(new Date(dateString), 'EEEE');
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr.getTime() - dep.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200 bg-card border-2 border-border">
        {/* Conditional Delete Button */}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="mx-auto top-1 right-1 h-7 w-7 rounded-full z-10"
            onClick={() => onDelete(duty.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Plane className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-primary">
                  {duty.flightNumber}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{getDayOfWeek(duty.date)}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-sm">
              {formatDate(duty.date)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {formatTime(duty.departureTime)}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  {duty.departureLocation}
                </p>
              </div>

              <div className="flex flex-col items-center gap-1 px-3">
                <ArrowRight className="w-4 h-4 text-muted-foreground/70" />
                <p className="text-xs text-muted-foreground">
                  {calculateDuration(duty.departureTime, duty.arrivalTime)}
                </p>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {formatTime(duty.arrivalTime)}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  {duty.arrivalLocation}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <Clock className="w-4 h-4 text-muted-foreground/70" />
            <span className="text-sm text-muted-foreground">
              Duration: {calculateDuration(duty.departureTime, duty.arrivalTime)}
            </span>
          </div>

          {/* The existing swap button is now wrapped in this condition */}
          {showSwapButton && (
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowSwapModal(true)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Request Swap
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <SwapRequestModal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        senderDuty={duty}
        onSwapRequested={() => {
          setShowSwapModal(false);
          onSwapRequested?.();
        }}
      />
    </>
  );
}
