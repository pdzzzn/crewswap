
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
              <Plane className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">
                {formatDate(duty.date)}
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              {duty.legs.length} {duty.legs.length === 1 ? 'Leg' : 'Legs'}
            </Badge>
          </div>
        </CardHeader>



        <CardContent className="space-y-4 pt-4">
          {duty.legs.map((leg, index) => (
            <div key={leg.id} className={`p-2 rounded-lg bg-muted/50 ${index > 0 ? 'mt-3' : ''}`}>
              <div className="flex items-center justify-between font-semibold text-sm">
                <span>{leg.isDeadhead ? 'DH/'+leg.flightNumber : leg.flightNumber}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {calculateDuration(leg.departureTime, leg.arrivalTime)}
                </span>
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

          {showSwapButton && (
            <div className="flex gap-2 pt-4">
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
      {/*
      <SwapRequestModal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        senderDuty={duty}
        onSwapRequested={() => {
          setShowSwapModal(false);
          onSwapRequested?.();
        }}
      />
      */}
    </>
  );
}
