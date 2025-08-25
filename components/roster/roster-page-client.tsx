"use client";

import { useEffect, useMemo, useRef, useState, useLayoutEffect, useCallback } from "react";
import { format } from "date-fns";
import Header from "@/components/layout/header";
import DutyCard from "@/components/dashboard/duty-card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Plane, PlusCircle, CheckSquare, SquareX } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Duty, User, roles, StagedDutyBlock } from "@/lib/types";
import { DutyStagingModal } from "@/components/roster/duty-staging-modal";
import { ParsedDutiesModal } from "@/components/roster/parsed-duties-modal";
import SelectionFab from "@/components/roster/selection-fab";
import EnhancedSwapModal, { type EnhancedSwapPayload } from "@/components/roster/enhanced-swap-modal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface RosterPageClientProps {
  user: User;
  duties: Duty[];
  availableDuties: Duty[];
}

export default function RosterPageClient({
  user,
  duties: initialDuties,
  availableDuties: initialAvailable,
}: RosterPageClientProps) {
  // Local state derived from server-fetched data (allows client-side updates later)
  const [duties, setDuties] = useState<Duty[]>(initialDuties);
  const [availableDuties, setAvailableDuties] =
    useState<Duty[]>(initialAvailable);
  const [isStagingModalOpen, setIsStagingModalOpen] = useState(false);
  const [isParsedModalOpen, setIsParsedModalOpen] = useState(false);
  const [parsedBlocks, setParsedBlocks] = useState<StagedDutyBlock[]>([]);
  const [parsedDuties, setParsedDuties] = useState<Duty[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [isEnhancedModalOpen, setIsEnhancedModalOpen] = useState(false);
  const [modalTargets, setModalTargets] = useState<Duty[]>([]);
  const { toast } = useToast();

  // Step 1: Selection Mechanism state
  const [selectionMode, setSelectionMode] = useState<'idle' | 'selecting'>(
    'idle'
  );
  const [selectedDuties, setSelectedDuties] = useState<Set<string>>(new Set());

  // Keep state in sync if server props change
  useEffect(() => {
    setDuties(initialDuties);
  }, [initialDuties]);
  useEffect(() => {
    setAvailableDuties(initialAvailable);
  }, [initialAvailable]);

  // Refs for scroll synchronization and targeting specific date columns
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const scrollSyncRef = useRef<"top" | "bottom" | null>(null);
  const dateColumnRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  // Set initial role from user
  useEffect(() => {
    if (user?.role) setSelectedRole(user.role);
  }, [user]);

  // Step 6: Real-time Updates
  // Debounced refresh helpers
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshRosterData = useCallback(async () => {
    const select = `
    id, date, pairing,
    user:users!duties_user_id_fkey(id, name, role, email, is_admin),
    legs:flight_legs!flight_legs_duty_id_fkey(
      id, flight_number, departure_time, arrival_time,
      departure_location, arrival_location, is_deadhead
    )`;

    const today = format(new Date(), 'yyyy-MM-dd');

    const [userDutiesRes, availableRes] = await Promise.all([
      supabase
        .from('duties')
        .select(select)
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .order('departure_time', { ascending: true, foreignTable: 'flight_legs' }),
      supabase
        .from('duties')
        .select(select)
        .neq('user_id', user.id)
        .gte('date', today)
        .order('date', { ascending: true })
        .order('departure_time', { ascending: true, foreignTable: 'flight_legs' }),
    ]);

    type DbUser = { id: string; name: string; role: string; email: string; is_admin: boolean | null };
    type DbLeg = {
      id: string; flight_number: string; departure_time: string; arrival_time: string;
      departure_location: string; arrival_location: string; is_deadhead: boolean | null
    };
    type DbDuty = { id: string; date: string; pairing: string | null; user: DbUser | null; legs: DbLeg[] | null };

    const mapUser = (u: DbUser) => ({ id: u.id, name: u.name, email: u.email, role: u.role, isAdmin: u.is_admin ?? false });
    const mapLeg = (l: DbLeg) => ({
      id: l.id,
      flightNumber: l.flight_number,
      departureTime: l.departure_time,
      arrivalTime: l.arrival_time,
      departureLocation: l.departure_location,
      arrivalLocation: l.arrival_location,
      isDeadhead: l.is_deadhead ?? false,
    });
    const mapDuty = (d: DbDuty): Duty => ({
      id: d.id,
      date: d.date,
      pairing: d.pairing,
      user: d.user ? mapUser(d.user) : undefined,
      legs: (d.legs ?? []).map(mapLeg),
    });

    if (userDutiesRes.data) setDuties(userDutiesRes.data.map(mapDuty as any));
    if (availableRes.data) setAvailableDuties(availableRes.data.map(mapDuty as any));
  }, [user.id]);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => {
      refreshRosterData().catch(() => {});
      refreshTimer.current = null;
    }, 300);
  }, [refreshRosterData]);

  // Clear any pending refresh on unmount
  useEffect(() => {
    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
        refreshTimer.current = null;
      }
    };
  }, []);

  const handleDutyChange = useCallback((_payload: any) => {
    // Any duty insert/update/delete may affect either list; refresh debounced
    scheduleRefresh();
  }, [scheduleRefresh]);

  const handleNewSwapRequest = useCallback(async (payload: any) => {
    const row = payload?.new;
    if (row?.receiver_id === user.id) {
      let senderName = 'Someone';
      try {
        const { data } = await supabase.from('users').select('name').eq('id', row.sender_id).single();
        if (data?.name) senderName = data.name;
      } catch {}
      toast({ title: 'New swap request', description: `${senderName} sent you a swap request.` });
    }
  }, [user.id, toast]);

  useEffect(() => {
    const channel = supabase
      .channel('roster-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'duties' }, handleDutyChange)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'swap_requests' }, handleNewSwapRequest)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [handleDutyChange, handleNewSwapRequest]);

  // Client-side filtering
  const filteredAvailableDuties = useMemo(() => {
    if (selectedRole === "allDuties" || !selectedRole) return availableDuties;
    return availableDuties.filter((duty) => duty.user?.role === selectedRole);
  }, [availableDuties, selectedRole]);

  // Index duties by id for fast lookup
  const availableById = useMemo(() => {
    const m = new Map<string, Duty>();
    filteredAvailableDuties.forEach((d) => m.set(d.id, d));
    return m;
  }, [filteredAvailableDuties]);

  // Compute selected dates and highlight own duties on same dates
  const selectedDates = useMemo(() => {
    const s = new Set<string>();
    selectedDuties.forEach((id) => {
      const d = availableById.get(id);
      if (d) s.add(format(new Date(d.date), 'yyyy-MM-dd'));
    });
    return s;
  }, [selectedDuties, availableById]);

  const highlightedOwnDuties = useMemo(() => {
    const s = new Set<string>();
    duties.forEach((d) => {
      const dateKey = format(new Date(d.date), 'yyyy-MM-dd');
      if (selectedDates.has(dateKey)) s.add(d.id);
    });
    return s;
  }, [duties, selectedDates]);

  // Group available duties by user then by date
  const dutiesByUser = useMemo(() => {
    const grouped = new Map<string, Map<string, Duty>>();
    filteredAvailableDuties.forEach((duty) => {
      if (!duty.user || !duty.user.id) return;
      const userId = duty.user.id;
      const dateKey = format(new Date(duty.date), "yyyy-MM-dd");
      if (!grouped.has(userId)) grouped.set(userId, new Map());
      grouped.get(userId)!.set(dateKey, duty);
    });
    return grouped;
  }, [filteredAvailableDuties]);

  // Group duties for rendering across a continuous date range
  const groupedDuties = useMemo(() => {
    const grouped = new Map<
      string,
      { userDuty: Duty | null; availableDuties: Duty[] }
    >();
    const allDutiesForDates = [...duties, ...filteredAvailableDuties];
    if (allDutiesForDates.length === 0) return grouped;

    const dateTimestamps = allDutiesForDates.map((d) =>
      new Date(d.date).getTime()
    );
    const minDate = new Date(Math.min(...dateTimestamps));
    const maxDate = new Date(Math.max(...dateTimestamps));

    const allDates: string[] = [];
    let currentDate = new Date(minDate);
    currentDate.setUTCHours(0, 0, 0, 0);
    while (currentDate <= maxDate) {
      allDates.push(format(currentDate, "yyyy-MM-dd"));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    allDates.forEach((date) =>
      grouped.set(date, { userDuty: null, availableDuties: [] })
    );

    duties.forEach((duty) => {
      const dateKey = format(new Date(duty.date), "yyyy-MM-dd");
      const entry = grouped.get(dateKey);
      if (entry) entry.userDuty = duty;
    });

    filteredAvailableDuties.forEach((duty) => {
      const dateKey = format(new Date(duty.date), "yyyy-MM-dd");
      const entry = grouped.get(dateKey);
      if (entry) entry.availableDuties.push(duty);
    });

    return grouped;
  }, [duties, filteredAvailableDuties]);

  const dateKeys = Array.from(groupedDuties.keys());

  // Scroll to today after first render
  useEffect(() => {
    const todayKey = format(new Date(), "yyyy-MM-dd");
    const todayEl = dateColumnRefs.current.get(todayKey);
    if (todayEl && topScrollRef.current && bottomScrollRef.current) {
      const scrollPosition = todayEl.offsetLeft;
      setTimeout(() => {
        topScrollRef.current?.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
        bottomScrollRef.current?.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [dateKeys.length]);

  const handleSwapRequested = () => {
    // placeholder for re-fetch/optimistic updates
    console.log("Swap requested, data should be refreshed.");
  };

  // Step 3: Enhanced swap modal submission
  const handleEnhancedSubmit = async (payload: EnhancedSwapPayload) => {
    if (!payload?.requestedDutyIds?.length || !payload?.offeredDutyIds?.length) {
      toast({
        title: "Nothing to send",
        description: "Select at least one requested and one offered duty.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Helper: previous sequential behavior (fallback)
      const fallbackSequential = async () => {
        // Index offered duties by id and date for matching
        const ownById = new Map<string, Duty>();
        duties.forEach((d) => ownById.set(d.id, d));
        const offeredByDate = new Map<string, Duty[]>();
        for (const id of payload.offeredDutyIds) {
          const d = ownById.get(id);
          if (!d) continue;
          const key = format(new Date(d.date), 'yyyy-MM-dd');
          const arr = offeredByDate.get(key) ?? [];
          arr.push(d);
          offeredByDate.set(key, arr);
        }

        const firstOfferedId = payload.offeredDutyIds[0];
        const message = payload.message?.trim() || undefined;

        let success = 0;
        let failures: string[] = [];
        for (const targetId of payload.requestedDutyIds) {
          const target = availableById.get(targetId);
          if (!target || !target.user?.id) {
            failures.push(`Invalid target ${targetId}`);
            continue;
          }

          // Prefer an offered duty on the same date
          const dateKey = format(new Date(target.date), 'yyyy-MM-dd');
          const sameDate = offeredByDate.get(dateKey);
          const offered = (sameDate && sameDate[0]) || ownById.get(firstOfferedId);
          if (!offered) {
            failures.push(`No offered duty available for request to ${target.user?.name ?? 'user'}`);
            continue;
          }

          const res = await fetch('/api/swap-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              senderDutyId: offered.id,
              targetDutyId: target.id,
              receiverId: target.user.id,
              message,
            }),
          });

          if (res.ok) success++; else {
            const txt = await res.text().catch(() => '');
            failures.push(txt || `Failed for ${target.user.name ?? 'user'}`);
          }
        }

        if (success > 0 && failures.length === 0) {
          toast({ title: 'Swap requests sent', description: `${success} request(s) created.` });
          setIsEnhancedModalOpen(false);
          clearSelection();
          handleSwapRequested();
        } else if (success > 0 && failures.length > 0) {
          toast({
            title: 'Partially sent',
            description: `${success} sent, ${failures.length} failed.`,
            variant: 'destructive',
          });
          setIsEnhancedModalOpen(false);
          clearSelection();
        } else {
          toast({ title: 'No requests sent', description: failures[0] || 'Unknown error', variant: 'destructive' });
        }
      };

      // Build batch requests by pairing each requested duty with best offered match
      const ownById = new Map<string, Duty>();
      duties.forEach((d) => ownById.set(d.id, d));
      const offeredByDate = new Map<string, Duty[]>();
      for (const id of payload.offeredDutyIds) {
        const d = ownById.get(id);
        if (!d) continue;
        const key = format(new Date(d.date), 'yyyy-MM-dd');
        const arr = offeredByDate.get(key) ?? [];
        arr.push(d);
        offeredByDate.set(key, arr);
      }
      const firstOfferedId = payload.offeredDutyIds[0];
      const globalMessage = payload.message?.trim() || undefined;

      const requests: Array<{ senderDutyId: string; targetDutyId: string; receiverId: string; message?: string }> = [];
      let prevalidationFailures = 0;
      for (const targetId of payload.requestedDutyIds) {
        const target = availableById.get(targetId);
        if (!target || !target.user?.id) { prevalidationFailures++; continue; }
        const dateKey = format(new Date(target.date), 'yyyy-MM-dd');
        const sameDate = offeredByDate.get(dateKey);
        const offered = (sameDate && sameDate[0]) || ownById.get(firstOfferedId);
        if (!offered) { prevalidationFailures++; continue; }
        requests.push({
          senderDutyId: offered.id,
          targetDutyId: target.id,
          receiverId: target.user.id,
          message: globalMessage,
        });
      }

      if (requests.length === 0) {
        toast({ title: 'No valid requests', description: 'Could not pair offered and requested duties.', variant: 'destructive' });
        return;
      }

      const res = await fetch('/api/swap-requests/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests, globalMessage, atomic: payload.atomic }),
      });

      const tryParseJson = async (r: Response) => {
        try { return await r.json(); } catch { return null; }
      };

      if (res.ok) {
        const data = await tryParseJson(res);
        const successCount = data?.successCount ?? (Array.isArray(data?.results) ? data.results.filter((x: any) => x.success).length : requests.length);
        const failureCount = data?.failureCount ?? (Array.isArray(data?.results) ? data.results.filter((x: any) => !x.success).length : 0);

        if (successCount > 0 && failureCount === 0) {
          toast({ title: 'Swap requests sent', description: `${successCount} request(s) created.` });
          setIsEnhancedModalOpen(false);
          clearSelection();
          handleSwapRequested();
        } else if (successCount > 0 && failureCount > 0) {
          toast({ title: 'Partially sent', description: `${successCount} sent, ${failureCount} failed.`, variant: 'destructive' });
          setIsEnhancedModalOpen(false);
          clearSelection();
        } else {
          toast({ title: 'No requests sent', description: 'Batch failed to create any requests.', variant: 'destructive' });
        }
        return;
      } else {
        const errJson = await tryParseJson(res);
        const errMsg: string = errJson?.error || `Batch request failed (${res.status})`;
        const results = Array.isArray(errJson?.results) ? errJson.results : [];
        const successCount = results.filter((x: any) => x.success).length;
        const failureCount = results.filter((x: any) => !x.success).length;

        // If RPC is missing (migrations not applied), gracefully fallback
        const errLower = (errMsg || '').toLowerCase();
        const rpcMissing = res.status === 404 || errLower.includes('batch_create_swap_requests') || (errLower.includes('function') && errLower.includes('does not exist'));
        if (rpcMissing) {
          await fallbackSequential();
          return;
        }

        if (successCount > 0 && failureCount > 0) {
          toast({ title: 'Partially sent', description: `${successCount} sent, ${failureCount} failed.`, variant: 'destructive' });
          setIsEnhancedModalOpen(false);
          clearSelection();
        } else {
          toast({ title: 'No requests sent', description: errMsg, variant: 'destructive' });
        }
      }
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to send requests', variant: 'destructive' });
    }
  };

  // Selection helpers
  const clearSelection = () => {
    setSelectedDuties(new Set());
    setSelectionMode('idle');
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clearSelection();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const isSelected = (d: Duty) => selectedDuties.has(d.id);
  const conflictsWithSelection = (d: Duty) => {
    const dateKey = format(new Date(d.date), 'yyyy-MM-dd');
    return selectedDates.has(dateKey) && !isSelected(d);
  };

  const handleSelectDuty = (duty: Duty, e: any) => {
    if (conflictsWithSelection(duty)) {
      // Prevent selection that would create a same-day conflict
      return;
    }

    const next = new Set(selectedDuties);
    const fromCheckbox = e?.via === 'checkbox';
    const multi = fromCheckbox || !!(e?.metaKey || e?.ctrlKey);

    if (selectionMode === 'idle') {
      next.add(duty.id);
      setSelectedDuties(next);
      setSelectionMode('selecting');
      return;
    }

    if (multi) {
      if (next.has(duty.id)) next.delete(duty.id); else next.add(duty.id);
      setSelectedDuties(next);
      if (next.size === 0) setSelectionMode('idle');
    } else {
      // Single-select (replace selection)
      if (next.size === 1 && next.has(duty.id)) {
        // Toggle off when only this is selected
        next.clear();
        setSelectedDuties(next);
        setSelectionMode('idle');
      } else {
        setSelectedDuties(new Set([duty.id]));
        setSelectionMode('selecting');
      }
    }
  };

  const handleParsedFromUpload = (
    blocks: StagedDutyBlock[],
    duties: Duty[]
  ) => {
    setParsedBlocks(blocks);
    setParsedDuties(duties);
    setIsParsedModalOpen(true);
  };

  const handleScroll = (source: "top" | "bottom") => {
    if (scrollSyncRef.current !== source) return;
    if (source === "top" && topScrollRef.current && bottomScrollRef.current) {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
    if (
      source === "bottom" &&
      topScrollRef.current &&
      bottomScrollRef.current
    ) {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
  };

  useLayoutEffect(() => {
    if (!topScrollRef.current || !bottomScrollRef.current) return;
    const topContainer = topScrollRef.current;
    const bottomContainer = bottomScrollRef.current;

    const syncHeights = () => {
      dateKeys.forEach((dateKey) => {
        const topCardWrapper = topContainer.querySelector(
          `[data-date-key="${dateKey}"]`
        );
        const bottomCardWrappers = bottomContainer.querySelectorAll(
          `[data-date-key="${dateKey}"]`
        );
        const elements = [
          topCardWrapper,
          ...Array.from(bottomCardWrappers),
        ].filter(Boolean) as HTMLElement[];
        if (elements.length === 0) return;
        elements.forEach((el) => {
          el.style.minHeight = "auto";
        });
        requestAnimationFrame(() => {
          let maxHeight = 0;
          elements.forEach((el) => {
            if (el.scrollHeight > maxHeight) maxHeight = el.scrollHeight;
          });
          if (maxHeight > 90)
            elements.forEach((el) => {
              el.style.minHeight = `${maxHeight}px`;
            });
        });
      });
    };

    const timer = setTimeout(syncHeights, 100);
    return () => clearTimeout(timer);
  }, [duties, filteredAvailableDuties, dateKeys]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={user} />

      <main className="w-full px-4 py-8 flex-1 flex flex-col">
        <CardHeader className="px-0 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="w-6 h-6" />
              Duty Roster
            </CardTitle>
            <CardDescription>
              Your schedule is fixed at the top. Available swaps are shown
              below, aligned by date.
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={selectionMode === 'selecting' ? 'secondary' : 'default'}
              onClick={() => {
                if (selectionMode === 'selecting') {
                  clearSelection();
                } else {
                  setSelectionMode('selecting');
                }
              }}
            >
              {selectionMode === 'selecting' ? (
                <>
                  <SquareX className="w-4 h-4 mr-2" />
                  Cancel Selection
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Select Duties
                </>
              )}
            </Button>
            {user?.isAdmin && (
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[180px] justify-center">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={roles[0].value}>
                      {roles[0].label}
                    </SelectItem>
                    <SelectItem value={roles[1].value}>
                      {roles[1].label}
                    </SelectItem>
                    <SelectItem value={roles[2].value}>
                      {roles[2].label}
                    </SelectItem>
                    <SelectItem value={roles[3].value}>
                      {roles[3].label}
                    </SelectItem>
                    <SelectItem value="allDuties">All Roles</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            <Button
              variant="outline"
              onClick={() => setIsStagingModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Duties
            </Button>
          </div>
        </CardHeader>

        {/* Your Duties Section */}
        <div className="sticky top-16 bg-background/10 backdrop-blur-none z-20 py-4">
          <h3 className="text-lg font-semibold text-foreground mb-2 px-1">
            Your Schedule
          </h3>
          <div
            ref={topScrollRef}
            className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide"
            onScroll={() => handleScroll("top")}
            onMouseEnter={() => (scrollSyncRef.current = "top")}
          >
            {dateKeys.map((dateKey) => (
              <div
                key={dateKey}
                className="w-72 flex-shrink-0"
                ref={(el) => {
                  if (el) dateColumnRefs.current.set(dateKey, el);
                  else dateColumnRefs.current.delete(dateKey);
                }}
              >
                <div className="text-center font-semibold text-sm text-muted-foreground pb-2 border-b-2 ">
                  {format(
                    new Date(dateKey.replace(/-/g, "/")),
                    "EEE dd MMM"
                  ).toUpperCase()}
                </div>
                <div className="grid pt-3 pl-1" data-date-key={dateKey}>
                  {groupedDuties.get(dateKey)?.userDuty ? (
                    <DutyCard
                      duty={groupedDuties.get(dateKey)!.userDuty!}
                      showSwapButton={false}
                      highlighted={highlightedOwnDuties.has(
                        groupedDuties.get(dateKey)!.userDuty!.id
                      )}
                      onSwapRequested={handleSwapRequested}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center rounded-lg bg-muted/60 border-2 border-dashed border-muted-foreground">
                      <p className="text-muted-foreground font-medium">
                        No Duty
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Available Duties Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="text-lg font-semibold text-foreground mb-2 px-1">
            Available Swaps
          </h3>
          <Card className="flex-1 flex flex-col border-2 border-border rounded-lg overflow-hidden">
            <CardContent
              ref={bottomScrollRef}
              className="flex-1 overflow-x-auto h-full overflow-auto scrollbar-hide p-0 bg-background"
              style={{ paddingTop: "0", paddingLeft: "-10px" }}
              onScroll={() => handleScroll("bottom")}
              onMouseEnter={() => (scrollSyncRef.current = "bottom")}
            >
              <div className="grid gap-4">
                {Array.from(dutiesByUser.keys()).map((userId) => {
                  const userDutiesMap = dutiesByUser.get(userId)!;
                  const representativeDuty = userDutiesMap.values().next()
                    .value as Duty | undefined;
                  return (
                    <div key={userId}>
                      <h4 className="text-md font-semibold text-foreground mb-2">
                        {representativeDuty?.user?.name || `User ${userId}`}
                      </h4>
                      <div className="flex space-x-4">
                        {dateKeys.map((dateKey) => (
                          <div
                            key={dateKey}
                            className="w-72 flex-shrink-0"
                            data-date-key={dateKey}
                          >
                            {userDutiesMap.has(dateKey) ? (
                              <DutyCard
                                duty={userDutiesMap.get(dateKey)!}
                                showSwapButton={false}
                                selectable
                                selected={isSelected(userDutiesMap.get(dateKey)!)}
                                disabled={selectionMode === 'selecting' && conflictsWithSelection(userDutiesMap.get(dateKey)!)}
                                showCheckbox={selectionMode === 'selecting'}
                                onSelect={(e) => handleSelectDuty(userDutiesMap.get(dateKey)!, e)}
                                onSwapRequested={handleSwapRequested}
                              />
                            ) : (
                              <div className="h-full flex items-center justify-center rounded-lg bg-muted/60 border-2 border-dashed border-muted-foreground">
                                <p className="text-muted-foreground font-medium">
                                  No Duty
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Empty state */}
                {dutiesByUser.size === 0 && (
                  <div className="text-center py-12 w-full flex flex-col items-center justify-center h-full">
                    <Plane className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-foreground mb-2">
                      No Duties Found
                    </h3>
                    <p className="text-muted-foreground">
                      There are no available duties matching your filter.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DutyStagingModal
          isOpen={isStagingModalOpen}
          onClose={() => setIsStagingModalOpen(false)}
          onParsed={handleParsedFromUpload}
        />
        <ParsedDutiesModal
          isOpen={isParsedModalOpen}
          onClose={() => setIsParsedModalOpen(false)}
          blocks={parsedBlocks}
          duties={parsedDuties}
          onImported={() => {
            // TODO: re-fetch data after import
            console.log("Imported parsed duties");
          }}
        />
      </main>
      <SelectionFab
        selectedCount={selectedDuties.size}
        isVisible={selectionMode === 'selecting' || selectedDuties.size > 0}
        onClear={clearSelection}
        onProceed={() => {
          const selected = Array.from(selectedDuties)
            .map((id) => availableById.get(id))
            .filter(Boolean) as Duty[];
          setModalTargets(selected);
          setIsEnhancedModalOpen(true);
        }}
      />
      <EnhancedSwapModal
        isOpen={isEnhancedModalOpen}
        onClose={() => setIsEnhancedModalOpen(false)}
        selectedDuties={modalTargets}
        userDuties={duties}
        onSubmit={handleEnhancedSubmit}
      />
    </div>
  );
}
