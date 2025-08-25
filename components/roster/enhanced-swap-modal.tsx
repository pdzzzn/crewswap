'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowRight, Users } from 'lucide-react';
import { format } from 'date-fns';
import type { Duty } from '@/lib/types';

export interface EnhancedSwapPayload {
  requestedDutyIds: string[];
  offeredDutyIds: string[];
  message?: string;
  atomic: boolean;
}

interface EnhancedSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDuties: Duty[];
  userDuties: Duty[];
  onSubmit: (payload: EnhancedSwapPayload) => Promise<void> | void;
}

export default function EnhancedSwapModal({
  isOpen,
  onClose,
  selectedDuties,
  userDuties,
  onSubmit,
}: EnhancedSwapModalProps) {
  const [message, setMessage] = useState('');
  const [atomic, setAtomic] = useState(true);
  const [showAllOwn, setShowAllOwn] = useState(false);
  const [offeredIds, setOfferedIds] = useState<Set<string>>(new Set());

  // Normalize date key to yyyy-MM-dd
  const toDateKey = (date: string) => format(new Date(date), 'yyyy-MM-dd');

  const selectedDates = useMemo(() => {
    const s = new Set<string>();
    selectedDuties.forEach((d) => s.add(toDateKey(d.date)));
    return s;
  }, [selectedDuties]);

  // Suggestions: own duties occurring on selected dates
  const suggestedOwnDuties = useMemo(
    () => userDuties.filter((d) => selectedDates.has(toDateKey(d.date))),
    [userDuties, selectedDates]
  );

  const nonSuggestedOwnDuties = useMemo(
    () => userDuties.filter((d) => !selectedDates.has(toDateKey(d.date))),
    [userDuties, selectedDates]
  );

  useEffect(() => {
    // Preselect suggested own duties
    const next = new Set<string>();
    suggestedOwnDuties.forEach((d) => next.add(d.id));
    setOfferedIds(next);
  }, [suggestedOwnDuties]);

  const toggleOffered = (id: string) => {
    setOfferedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const groupByOwner = useMemo(() => {
    const m = new Map<string, { ownerName: string; duties: Duty[] }>();
    for (const d of selectedDuties) {
      const ownerId = d.user?.id || 'unknown';
      const ownerName = d.user?.name || 'Unknown User';
      if (!m.has(ownerId)) m.set(ownerId, { ownerName, duties: [] });
      m.get(ownerId)!.duties.push(d);
    }
    return Array.from(m.entries()).map(([ownerId, val]) => ({ ownerId, ...val }));
  }, [selectedDuties]);

  const handleSubmit = async () => {
    const payload: EnhancedSwapPayload = {
      requestedDutyIds: selectedDuties.map((d) => d.id),
      offeredDutyIds: Array.from(offeredIds),
      message: message.trim() || undefined,
      atomic,
    };
    await onSubmit(payload);
  };

  const formatTime = (t?: string) => {
    if (!t) return '—';
    // If HH:mm or HH:mm:ss, show HH:mm
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(t) && !t.includes('T')) return t.slice(0, 5);
    try {
      const d = new Date(t);
      if (!isNaN(d.getTime())) return format(d, 'HH:mm');
    } catch {}
    return '—';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[80vw] lg:max-w-5xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Create Swap Offer
            <span className="ml-2 text-muted-foreground text-base font-normal">
              ({selectedDuties.length} selected)
            </span>
          </DialogTitle>
          <DialogDescription>
            Review what you want to request and choose which of your duties to offer in exchange.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1">
          {/* You Get (requested) */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" /> You Get
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {groupByOwner.length === 0 && (
                <p className="text-sm text-muted-foreground">No selected duties.</p>
              )}
              {groupByOwner.map(({ ownerId, ownerName, duties }) => (
                <div key={ownerId} className="border rounded-md">
                  <div className="flex items-center justify-between px-3 py-2 bg-muted/40 rounded-t-md">
                    <div className="font-semibold text-sm">{ownerName}</div>
                    <Badge variant="secondary" className="text-xs">{duties.length} selected</Badge>
                  </div>
                  <Separator />
                  <div className="p-3 space-y-2 max-h-56 overflow-auto">
                    {duties.map((duty) => (
                      <div key={duty.id} className="p-2 rounded-md border bg-background">
                        <div className="flex items-center justify-between text-sm font-medium">
                          <span>{format(new Date(duty.date), 'MMM dd, yyyy')}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {duty.legs.length} {duty.legs.length === 1 ? 'Leg' : 'Legs'}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1">
                          {duty.legs.map((leg) => (
                            <div key={leg.id} className="text-xs flex items-center justify-between text-muted-foreground">
                              <span className="font-medium text-foreground">{leg.flightNumber}</span>
                              <span>{leg.departureLocation} 
                                <ArrowRight className="inline-block w-3 h-3 mx-1 text-muted-foreground" />
                                {leg.arrivalLocation}
                              </span>
                              <span>
                                {formatTime(leg.departureTime)} - {formatTime(leg.arrivalTime)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* You Give (offered) */}
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">You Give</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold">Suggested (same dates)</div>
                  <Badge variant="secondary" className="text-[10px]">
                    {suggestedOwnDuties.length} matches
                  </Badge>
                </div>
                {suggestedOwnDuties.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No same-day matches on your roster.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-auto pr-1">
                    {suggestedOwnDuties.map((d) => (
                      <label
                        key={d.id}
                        className="flex items-start gap-2 p-2 rounded-md border bg-background cursor-pointer"
                      >
                        <Checkbox
                          checked={offeredIds.has(d.id)}
                          onCheckedChange={() => toggleOffered(d.id)}
                          className="mt-0.5 size-4"
                          aria-label={`Offer duty ${format(new Date(d.date), 'MMM dd')}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span>{format(new Date(d.date), 'MMM dd, yyyy')}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {d.legs.length} {d.legs.length === 1 ? 'Leg' : 'Legs'}
                            </Badge>
                          </div>
                          <div className="mt-1 space-y-0.5">
                            {d.legs.map((leg) => (
                              <div key={leg.id} className="text-xs text-muted-foreground flex items-center justify-between">
                                <span className="font-medium text-foreground">{leg.flightNumber}</span>
                                <span>{leg.departureLocation} → {leg.arrivalLocation}</span>
                                <span>{formatTime(leg.departureTime)} - {formatTime(leg.arrivalTime)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold">Other duties</div>
                  <Button variant="ghost" size="sm" onClick={() => setShowAllOwn((s) => !s)}>
                    {showAllOwn ? 'Hide' : 'Show'} all
                  </Button>
                </div>
                {showAllOwn && (
                  <div className="space-y-2 max-h-48 overflow-auto pr-1">
                    {nonSuggestedOwnDuties.map((d) => (
                      <label
                        key={d.id}
                        className="flex items-start gap-2 p-2 rounded-md border bg-background cursor-pointer"
                      >
                        <Checkbox
                          checked={offeredIds.has(d.id)}
                          onCheckedChange={() => toggleOffered(d.id)}
                          className="mt-0.5 size-4"
                          aria-label={`Offer duty ${format(new Date(d.date), 'MMM dd')}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span>{format(new Date(d.date), 'MMM dd, yyyy')}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {d.legs.length} {d.legs.length === 1 ? 'Leg' : 'Legs'}
                            </Badge>
                          </div>
                          <div className="mt-1 space-y-0.5">
                            {d.legs.map((leg) => (
                              <div key={leg.id} className="text-xs text-muted-foreground flex items-center justify-between">
                                <span className="font-medium text-foreground">{leg.flightNumber}</span>
                                <span>{leg.departureLocation} → {leg.arrivalLocation}</span>
                                <span>{formatTime(leg.departureTime)} - {formatTime(leg.arrivalTime)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </label>
                    ))}
                    {nonSuggestedOwnDuties.length === 0 && (
                      <p className="text-sm text-muted-foreground">No other duties on your roster.</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <Switch id="atomic" checked={atomic} onCheckedChange={setAtomic} />
            <Label htmlFor="atomic" className="text-sm">All-or-nothing (atomic offer)</Label>
          </div>
          <div>
            <Label htmlFor="message" className="text-sm">Message (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note to the recipient(s)..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="mt-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedDuties.length === 0 || offeredIds.size === 0}
          >
            Send Offer ({selectedDuties.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
