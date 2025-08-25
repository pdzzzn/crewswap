'use client';

import type React from 'react';
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
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface DutyCardProps {
  duty: Duty;
  onSwapRequested?: () => void;
  showSwapButton?: boolean;
  onDelete?: (dutyId: string) => void;
  // Selection UX (optional)
  selectable?: boolean;
  selected?: boolean;
  highlighted?: boolean;
  disabled?: boolean;
  onSelect?: (e?: any) => void;
  showCheckbox?: boolean;
}

export default function DutyCard({
  duty,
  onSwapRequested,
  showSwapButton = true,
  onDelete,
  selectable = false,
  selected = false,
  highlighted = false,
  disabled = false,
  onSelect,
  showCheckbox = false,
}: DutyCardProps) {
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Robust date/time handling for either ISO strings or HH:mm times
  const parseDateTime = (dateString: string, timeString?: string) => {
    if (!timeString) return null;
    const t = timeString.trim();
    try {
      if (t.includes('T')) {
        const d = parseISO(t);
        return isNaN(d.getTime()) ? null : d;
      }
      if (/^\d{2}:\d{2}$/.test(t)) {
        const d = parseISO(`${dateString}T${t}:00Z`);
        return isNaN(d.getTime()) ? null : d;
      }
      if (/^\d{2}:\d{2}:\d{2}$/.test(t)) {
        const d = parseISO(`${dateString}T${t}Z`);
        return isNaN(d.getTime()) ? null : d;
      }
      const d = new Date(t);
      return isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  };

  const formatTime = (dateString: string, timeString?: string) => {
    if (!timeString) return '—';
    const t = timeString.trim();
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(t) && !t.includes('T')) {
      // Already an HH:mm or HH:mm:ss string – display HH:mm
      return t.slice(0, 5);
    }
    const d = parseDateTime(dateString, timeString);
    return d ? format(d, 'HH:mm') : '—';
  };

  const formatDate = (dateString: string) => format(parseISO(dateString), 'MMM dd, yyyy');

  const calculateDuration = (dateString: string, departure?: string, arrival?: string) => {
    const dep = parseDateTime(dateString, departure);
    const arr = parseDateTime(dateString, arrival);
    if (!dep || !arr) return '—';
    const diffMs = arr.getTime() - dep.getTime();
    if (!isFinite(diffMs)) return '—';
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  // Ensure we never render DH/DH/… by stripping any pre-existing DH prefix from the source value.
  const normalizeFlightNumber = (flightNumber?: string) => {
    if (!flightNumber) return '';
    // Remove one or more leading DH + separator sequences (e.g., DH/, DH - , DH DH/)
    return flightNumber.replace(/^(?:DH[\s\/\-]+)+/i, '').trim();
  };

  return (
    <>
      {/* Reduced padding from py-6 to p-3, and gap from 6 to 3 */}
      <Card
        className={cn(
          'relative hover:shadow-lg transition-shadow duration-200 bg-card border-border p-3 gap-3 h-full flex flex-col',
          selectable && 'cursor-pointer',
          selected && 'border-primary ring-2 ring-primary/30 bg-primary/5',
          highlighted && 'ring-2 ring-primary/40 border-dashed animate-pulse',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        role={selectable ? 'button' : undefined}
        aria-pressed={selectable ? selected : undefined}
        tabIndex={selectable ? 0 : undefined}
        onClick={selectable && !disabled ? onSelect : undefined}
        onKeyDown={
          selectable && !disabled
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect?.(e);
                }
              }
            : undefined
        }
      >
        {(showCheckbox || selected) && (
          <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selected}
              aria-label="Select duty"
              onCheckedChange={() => onSelect?.({ via: 'checkbox' })}
              disabled={disabled}
              className="size-4"
            />
          </div>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 rounded-full z-10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(duty.id);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        {/* Reduced padding: removed pb-3, using gap in parent Card instead */}
        <CardHeader className="p-0">
          <div className="flex items-center justify-between pr-7">
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
                    {leg.isDeadhead
                      ? `DH/${normalizeFlightNumber(leg.flightNumber)}`
                      : normalizeFlightNumber(leg.flightNumber)}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {calculateDuration(duty.date, leg.departureTime, leg.arrivalTime)}
                  </span>
                </div>
                {/* Compacted layout for departure and arrival info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1 gap-1">
                  <span>{formatTime(duty.date, leg.departureTime)}</span>
                  <div className="flex items-center gap-1 font-medium text-foreground">
                    <span>{leg.departureLocation}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span>{leg.arrivalLocation}</span>
                  </div>
                  <span>{formatTime(duty.date, leg.arrivalTime)}</span>
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