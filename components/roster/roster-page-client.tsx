"use client";

import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { format } from "date-fns";
import Header from "@/components/layout/header";
import DutyCard from "@/components/dashboard/duty-card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Plane, PlusCircle } from "lucide-react";
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

  // Client-side filtering
  const filteredAvailableDuties = useMemo(() => {
    if (selectedRole === "allDuties" || !selectedRole) return availableDuties;
    return availableDuties.filter((duty) => duty.user?.role === selectedRole);
  }, [availableDuties, selectedRole]);

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
    </div>
  );
}
