'use client';

import { Card, CardContent } from '@/components/ui/card';
import DutyCard from '@/components/dashboard/duty-card';
import { Plane } from 'lucide-react';

interface Duty {
  id: string;
  flightNumber: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  departureLocation: string;
  arrivalLocation: string;
}

interface DutyColumnProps {
  date: string;
  userDuty: Duty | null;
  availableDuties: Duty[];
  onSwapRequested: () => void;
}

export default function DutyColumn({ date, userDuty, availableDuties, onSwapRequested }: DutyColumnProps) {
  return (
    <div className="flex flex-col w-80 md:w-96 flex-shrink-0">
      <div className="p-3 text-center font-semibold text-sm text-foreground/90 bg-muted rounded-t-lg sticky top-0 z-10 border-b">
        {date}
      </div>
      <div className="h-48 pt-4 px-2 bg-muted">
        {userDuty ? (
          <DutyCard duty={userDuty} onSwapRequested={onSwapRequested} />
        ) : (
          <div className="h-full flex items-center justify-center rounded-lg bg-muted border-2 border-dashed">
            <div className="text-center text-muted-foreground">
              <p className="font-medium">No Duty Scheduled</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-3 bg-white border-r border-l">
        {availableDuties.length > 0 ? (
          availableDuties.map((duty) => (
            <DutyCard key={duty.id} duty={duty} onSwapRequested={onSwapRequested} />
          ))
        ) : (
          <div className="text-center text-muted-foreground/70 pt-10">
            <p>No available swaps for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
}