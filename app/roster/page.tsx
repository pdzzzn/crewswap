'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Plane, Users } from 'lucide-react';
import Header from '@/components/layout/header';
import DutyCard from '@/components/dashboard/duty-card';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

// It's recommended to move these interfaces to a central types file (e.g., /lib/types.ts)
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Duty {
  id: string;
  flightNumber: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  departureLocation: string;
  arrivalLocation: string;
}

export default function RosterPage() {
  const [user, setUser] = useState<User | null>(null);
  const [duties, setDuties] = useState<Duty[]>([]);
  const [availableDuties, setAvailableDuties] = useState<Duty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Refs for scroll synchronization
  const topScrollRef = useRef<HTMLDivElement>(null);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const scrollSyncRef = useRef<'top' | 'bottom' | null>(null);

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

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSwapRequested = () => {
    fetchAllData();
  };

  const groupedDuties = useMemo(() => {
    const grouped = new Map<string, { userDuty: Duty | null; availableDuties: Duty[] }>();
    const allDuties = [...duties, ...availableDuties];
    
    // Get all unique dates first
    const allDates = [...new Set(allDuties.map(d => format(new Date(d.date), 'yyyy-MM-dd')))];
    allDates.sort();

    // Initialize map with all dates
    for (const date of allDates) {
        grouped.set(date, { userDuty: null, availableDuties: [] });
    }

    // Populate user duties
    for (const duty of duties) {
        const dateKey = format(new Date(duty.date), 'yyyy-MM-dd');
        const entry = grouped.get(dateKey);
        if (entry) entry.userDuty = duty;
    }

    // Populate available duties
    for (const duty of availableDuties) {
        const dateKey = format(new Date(duty.date), 'yyyy-MM-dd');
        const entry = grouped.get(dateKey);
        if (entry) entry.availableDuties.push(duty);
    }
    
    return grouped;
  }, [duties, availableDuties]);


  // Scroll synchronization logic
  const handleScroll = (source: 'top' | 'bottom') => {
    if (scrollSyncRef.current !== source) return;

    if (source === 'top' && topScrollRef.current && bottomScrollRef.current) {
        bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
    if (source === 'bottom' && topScrollRef.current && bottomScrollRef.current) {
        topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Plane className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 text-lg font-medium">Loading Duty Roster...</p>
        </div>
      </div>
    );
  }
  
  const dateKeys = Array.from(groupedDuties.keys());

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header user={user} />
      
      <main className="container max-w-screen-xl mx-auto px-4 py-8 flex-1 flex flex-col">
        <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-2xl">
                <Calendar className="w-6 h-6" />
                Duty Roster
            </CardTitle>
            <CardDescription>
                Your schedule is fixed at the top. Available swaps are shown below, aligned by date.
            </CardDescription>
        </CardHeader>
        
        {/* Your Duties Section */}
        <div className="sticky top-16 bg-gray-50/95 backdrop-blur-sm z-20 py-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 px-1">Your Schedule</h3>
            <div 
                ref={topScrollRef}
                className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide"
                onScroll={() => handleScroll('top')}
                onMouseEnter={() => scrollSyncRef.current = 'top'}
            >
                {dateKeys.map(dateKey => (
                    <div key={dateKey} className="w-80 flex-shrink-0">
                        <div className="text-center font-semibold text-sm text-gray-500 pb-2 border-b-2">
                           {format(new Date(dateKey.replace(/-/g, '/')), 'EEE dd MMM').toUpperCase()}
                        </div>
                        <div className="pt-3 h-fit">
                          {groupedDuties.get(dateKey)?.userDuty ? (
                              <DutyCard 
                                duty={groupedDuties.get(dateKey)!.userDuty!} 
                                onSwapRequested={handleSwapRequested}
                              />
                          ) : (
                              <div className="h-full flex items-center justify-center rounded-lg bg-gray-200/60 border-2 border-dashed">
                                  <p className="text-gray-500 font-medium">No Duty</p>
                              </div>
                          )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <Separator className="my-6"/>

        {/* Available Duties Section */}
        <div className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col">
                <CardContent 
                    ref={bottomScrollRef}
                    className="flex-1 overflow-x-auto scrollbar-hide p-0"
                    onScroll={() => handleScroll('bottom')}
                    onMouseEnter={() => scrollSyncRef.current = 'bottom'}
                >
                    <div className="flex space-x-4 h-full">
                        {dateKeys.map(dateKey => (
                            <div key={dateKey} className="w-80 flex-shrink-0 h-full flex flex-col">
                                <div className="flex-1 overflow-y-auto space-y-3 pr-2" style={{paddingRight: '2px'}}>
                                    {groupedDuties.get(dateKey)!.availableDuties.length > 0 ? (
                                        groupedDuties.get(dateKey)!.availableDuties.map(duty => (
                                            <DutyCard 
                                                key={duty.id} 
                                                duty={duty} 
                                                onSwapRequested={handleSwapRequested}
                                            />
                                        ))
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-400">
                                          <p>No available duties</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                     {dateKeys.length === 0 && !isLoading && (
                        <div className="text-center py-12 w-full flex flex-col items-center justify-center h-full">
                            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-800 mb-2">No Duties Found</h3>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}