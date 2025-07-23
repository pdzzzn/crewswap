'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Plane, PlusCircle } from 'lucide-react';
import Header from '@/components/layout/header';
import DutyCard from '@/components/dashboard/duty-card';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DutyStagingModal } from '@/components/roster/duty-staging-modal';
import { User, Duty, roles } from '@/lib/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RosterPage() {
  // --- STATE AND REFS ---
  const [user, setUser] = useState<User | null>(null);
  const [duties, setDuties] = useState<Duty[]>([]);
  const [availableDuties, setAvailableDuties] = useState<Duty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStagingModalOpen, setIsStagingModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();

  // Refs for scroll synchronization and targeting specific date columns
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const scrollSyncRef = useRef<'top' | 'bottom' | null>(null);
  const dateColumnRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  // --- DATA FETCHING & LOGIC ---

  // Effect to fetch all necessary data once when the component mounts
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [userDataRes, dutiesRes, availableDutiesRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/duties'),
          fetch('/api/duties/available')
        ]);

        if (!userDataRes.ok) {
          router.push('/login');
          return;
        }

        const userData = await userDataRes.json();
        setUser(userData.user);

        const dutiesData = await dutiesRes.json();
        setDuties(dutiesData.duties || []);

        const availableDutiesData = await availableDutiesRes.json();
        setAvailableDuties(availableDutiesData.duties || []);

      } catch (error) {
        console.error('Failed to fetch roster data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [router]); // Dependency on router to adhere to React hooks linting rules

  // Effect to set the initial role in the dropdown once user data is available
  useEffect(() => {
    if (user?.role) {
      setSelectedRole(user.role);
    }
  }, [user]);




  // Memoized client-side filtering of available duties based on the selected role
  const filteredAvailableDuties = useMemo(() => {
    if (selectedRole === 'allDuties' || !selectedRole) {
      return availableDuties;
    }
    return availableDuties.filter(duty => duty.user?.role === selectedRole);
  }, [availableDuties, selectedRole]);

  // NEW: Memoized grouping of available duties by user, then by date.
  const dutiesByUser = useMemo(() => {
    const grouped = new Map<string, Map<string, Duty>>();

    filteredAvailableDuties.forEach(duty => {
      // Ensure the duty has a user and a user ID.
      if (!duty.user || !duty.user.id) {
        return;
      }

      const userId = duty.user.id;
      const dateKey = format(new Date(duty.date), 'yyyy-MM-dd');

      // If we haven't seen this user before, create a new map for them.
      if (!grouped.has(userId)) {
        grouped.set(userId, new Map<string, Duty>());
      }

      // Add the duty to the user's personal schedule map.
      grouped.get(userId)!.set(dateKey, duty);
    });

    return grouped;
  }, [filteredAvailableDuties]); // This recalculates only when the filtered duties change.

  // Memoized grouping of duties for rendering, recalculated when filtered duties change
  const groupedDuties = useMemo(() => {
    const grouped = new Map<string, { userDuty: Duty | null; availableDuties: Duty[] }>();
    const allDutiesForDates = [...duties, ...filteredAvailableDuties];
    const allDates = [...new Set(allDutiesForDates.map(d => format(new Date(d.date), 'yyyy-MM-dd')))].sort();

    allDates.forEach(date => grouped.set(date, { userDuty: null, availableDuties: [] }));

    duties.forEach(duty => {
      const dateKey = format(new Date(duty.date), 'yyyy-MM-dd');
      const entry = grouped.get(dateKey);
      if (entry) entry.userDuty = duty;
    });

    filteredAvailableDuties.forEach(duty => {
      const dateKey = format(new Date(duty.date), 'yyyy-MM-dd');
      const entry = grouped.get(dateKey);
      if (entry) entry.availableDuties.push(duty);
    });

    return grouped;
  }, [duties, filteredAvailableDuties]);

  // Effect to scroll to today's date once the initial data load is complete
  useEffect(() => {
    if (isLoading) return; // Only run after loading is finished

    const todayKey = format(new Date(), 'yyyy-MM-dd');
    const todayEl = dateColumnRefs.current.get(todayKey);

    if (todayEl && topScrollRef.current && bottomScrollRef.current) {
      const scrollPosition = todayEl.offsetLeft;
      // Timeout ensures the DOM has fully painted before we scroll
      setTimeout(() => {
        topScrollRef.current?.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        bottomScrollRef.current?.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }, 100);
    }
  }, [isLoading]);

  // --- HANDLERS ---
  const handleSwapRequested = () => {
    // Here you would re-fetch or update state after a swap
    // For now, it can be left empty or log a message
    console.log("Swap requested, data should be refreshed.");
  };

  const handleScroll = (source: 'top' | 'bottom') => {
    if (scrollSyncRef.current !== source) return;

    if (source === 'top' && topScrollRef.current && bottomScrollRef.current) {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
    if (source === 'bottom' && topScrollRef.current && bottomScrollRef.current) {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
  };

  // --- RENDER LOGIC ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Plane className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground text-lg font-medium">Loading Duty Roster...</p>
        </div>
      </div>
    );
  }

  const dateKeys = Array.from(groupedDuties.keys());

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={user} />

      <main className="container max-w-screen-xl mx-auto px-4 py-8 flex-1 flex flex-col">
        <CardHeader className="px-0 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="w-6 h-6" />
              Duty Roster
            </CardTitle>
            <CardDescription>
              Your schedule is fixed at the top. Available swaps are shown below, aligned by date.
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[180px] justify-center">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={roles[0].value}>{roles[0].label}</SelectItem>
                  <SelectItem value={roles[1].value}>{roles[1].label}</SelectItem>
                  <SelectItem value={roles[2].value}>{roles[2].label}</SelectItem>
                  <SelectItem value={roles[3].value}>{roles[3].label}</SelectItem>
                  <SelectItem value="allDuties">All Roles</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setIsStagingModalOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Duties
            </Button>
          </div>
        </CardHeader>

        {/* Your Duties Section */}
        <div className="sticky top-16 bg-background/10 backdrop-blur-none z-20 py-4">
          <h3 className="text-lg font-semibold text-foreground mb-2 px-1">Your Schedule</h3>
          <div
            ref={topScrollRef}
            className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide"
            onScroll={() => handleScroll('top')}
            onMouseEnter={() => scrollSyncRef.current = 'top'}
          >
            {dateKeys.map(dateKey => (
              <div
                key={dateKey}
                className="w-80 flex-shrink-0"
                ref={(el) => {
                  if (el) {
                    dateColumnRefs.current.set(dateKey, el);
                  } else {
                    // Clean up the map when the component unmounts
                    dateColumnRefs.current.delete(dateKey);
                  }
                }}
              >
                <div className="text-center font-semibold text-sm text-muted-foreground pb-2 border-b-2 ">
                  {format(new Date(dateKey.replace(/-/g, '/')), 'EEE dd MMM').toUpperCase()}
                </div>
                <div className="pt-3 pl-1 h-fit">
                  {groupedDuties.get(dateKey)?.userDuty ? (
                    <DutyCard
                      duty={groupedDuties.get(dateKey)!.userDuty!}
                      showSwapButton={false}
                      onSwapRequested={handleSwapRequested}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center rounded-lg bg-muted/60 border-2 border-dashed border-muted-foreground min-h-[100px]">
                      <p className="text-muted-foreground font-medium">No Duty</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Available Duties Section */}
        {/* --- MODIFIED: Available Duties Section --- */}
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="text-lg font-semibold text-foreground mb-2 px-1">Available Swaps</h3>
          <Card className="flex-1 flex flex-col border-2 border-border rounded-lg overflow-hidden">
            <CardContent
              ref={bottomScrollRef}
              className="flex-1 overflow-x-auto h-full overflow-auto scrollbar-hide p-0 bg-background" style={{ paddingTop: '0', paddingLeft: '-10px' }}
              onScroll={() => handleScroll('bottom')}
              onMouseEnter={() => scrollSyncRef.current = 'bottom'}
            >
              <div className="space-y-4">
                {/* Loop over each USER to create a row */}
                {Array.from(dutiesByUser.keys()).map(userId => {
                  const userDutiesMap = dutiesByUser.get(userId)!;
                  // Get the first duty to display the user's name
                  const representativeDuty = userDutiesMap.values().next().value;

                  return (
                    <div key={userId}>
                      {/* Optional: Add a header for each user's row */}
                      <h4 className="text-md font-semibold text-foreground mb-2">
                        {representativeDuty?.user?.name || `User ${userId}`}
                      </h4>

                      {/* This flex container is the USER'S ROW */}
                      <div className="flex space-x-4">
                        {/* Loop over each DATE to create a column */}
                        {dateKeys.map(dateKey => (
                          <div key={dateKey} className="w-80 flex-shrink-0">
                            {userDutiesMap.has(dateKey) ? (
                              // If the user has a duty on this date, show it
                              <DutyCard
                                duty={userDutiesMap.get(dateKey)!}
                                onSwapRequested={handleSwapRequested}
                              />
                            ) : (
                              // Otherwise, show a placeholder to keep alignment
                              <div className="h-full flex items-center justify-center rounded-lg bg-muted/60 border-2 border-dashed border-muted-foreground min-h-[100px]">
                              <p className="text-muted-foreground font-medium">No Duty</p>
                            </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Placeholder for when no duties match the filter */}
              {dutiesByUser.size === 0 && (
                <div className="text-center py-12 w-full flex flex-col items-center justify-center h-full">
                  <Plane className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-foreground mb-2">No Duties Found</h3>
                  <p className="text-muted-foreground">There are no available duties matching your filter.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <DutyStagingModal
          isOpen={isStagingModalOpen}
          onClose={() => setIsStagingModalOpen(false)}
        />
      </main>
    </div>
  );
}