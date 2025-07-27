'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plane, ArrowRight, RefreshCw } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import SwapRequestModal from './swap-request-modal';
import { Duty } from '@/lib/types';
import { Separator } from '@/components/ui/separator'; // <-- Import Separator
import { Fragment } from 'react'; // <-- Import Fragment

interface DutyCardProps {
  duty: Duty;
  onSwapRequested?: () => void;
  showSwapButton?: boolean;
  onDelete?: (dutyId: string) => void;
}

export default function DutyCard({
  duty,
  onSwapRequested,
  showSwapButton = true,
  onDelete
}: DutyCardProps) {
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Use parseISO to handle ISO strings correctly
  const formatTime = (timeString: string) => format(parseISO(timeString), 'HH:mm');
  const formatDate = (dateString: string) => format(parseISO(dateString), 'MMM dd, yyyy');

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = parseISO(departure);
    const arr = parseISO(arrival);
    const diffMs = arr.getTime() - dep.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  return (
    <>
      {/* Reduced padding from py-6 to p-3, and gap from 6 to 3 */}
      <Card className="hover:shadow-lg transition-shadow duration-200 bg-card border-border p-3 gap-3 h-full flex flex-col">
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 rounded-full z-10"
            onClick={() => onDelete(duty.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {/* Reduced padding: removed pb-3, using gap in parent Card instead */}
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Plane className="h-4 w-4 text-primary" />
              {formatDate(duty.date)}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {duty.legs.length} {duty.legs.length === 1 ? 'Leg' : 'Legs'}
            </Badge>
          </div>
        </CardHeader>

        {/* Reduced padding: removed pt-4, using gap in parent Card instead */}
        <CardContent className="p-0 space-y-2 flex-grow">
          {duty.legs.map((leg, index) => (
            // Using Fragment and Separator for a more compact list
            <Fragment key={leg.id}>
              {index > 0 && <Separator />}
              <div className="p-1 rounded-lg">
                <div className="flex items-center justify-between font-semibold text-sm">
                  <span className={leg.isDeadhead ? 'text-muted-foreground' : ''}>
                    {leg.isDeadhead ? `DH/${leg.flightNumber}` : leg.flightNumber}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {calculateDuration(leg.departureTime, leg.arrivalTime)}
                  </span>
                </div>
                {/* Compacted layout for departure and arrival info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1 gap-1">
                  <span>{formatTime(leg.departureTime)}</span>
                  <div className="flex items-center gap-1 font-medium text-foreground">
                    <span>{leg.departureLocation}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span>{leg.arrivalLocation}</span>
                  </div>
                  <span>{formatTime(leg.arrivalTime)}</span>
                </div>
              </div>
            </Fragment>
          ))}
        </CardContent>

        {showSwapButton && (
          // Reduced padding-top to pt-2
          <div className="flex gap-2 pt-2 border-t border-border mt-auto">
            <Button
              variant="outline"
              size="sm" // Using "sm" for a smaller button
              className="flex-1 h-8" // Explicitly setting a smaller height
              onClick={() => setShowSwapModal(true)}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-2" />
              Request Swap
            </Button>
          </div>
        )}
      </Card>
      
      {/* SwapRequestModal remains unchanged */}
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