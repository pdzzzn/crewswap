'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { PlusCircle, Plane } from 'lucide-react';
import DutyCard from '@/components/dashboard/duty-card';
import { AddDutyForm } from './add-duty-form';
import type { Duty } from '@/lib/types'; // Assuming Duty type is in a central file

interface DutyStagingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// The form returns data that needs to be combined into proper Duty objects
const combineDateTime = (date: Date, time: string): string => {
    const [hours, minutes] = time.split(':');
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return newDate.toISOString();
};


export function DutyStagingModal({ isOpen, onClose }: DutyStagingModalProps) {
    const [stagedDuties, setStagedDuties] = useState<Duty[]>([]);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);

    const handleDeleteStagedDuty = (dutyId: string) => {
        setStagedDuties(prev => prev.filter(duty => duty.id !== dutyId));
    };

    const handleAddDuty = (formData: any) => {
        const newDuty: Duty = {
            id: `staged-${stagedDuties.length + 1}`, // Temporary ID
            flightNumber: formData.flightNumber,
            date: formData.date.toISOString(),
            departureTime: combineDateTime(formData.date, formData.departureTime),
            arrivalTime: combineDateTime(formData.date, formData.arrivalTime),
            departureLocation: formData.departureLocation,
            arrivalLocation: formData.arrivalLocation,
        };
        setStagedDuties(prev => [...prev, newDuty]);
        setIsAddFormOpen(false); // Close the form modal after adding
    };

    const handleSaveAll = () => {
        // TODO: Implement API call to save all stagedDuties to the database
        console.log("Saving all duties:", stagedDuties);
        onClose(); // Close the main modal after saving
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[70vh] flex flex-col bg-background">
                <DialogHeader>
                    <DialogTitle>Stage Duties for Upload</DialogTitle>
                    <DialogDescription>
                        Add duties one by one. When you are finished, click "Add to Roster" to save them all.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 border-y">
                    {stagedDuties.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Plane className="w-16 h-16 mb-4" />
                            <p>No duties have been added yet.</p>
                            <p>Click "Add Single Duty" to get started.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {stagedDuties.map((duty) => (
                                <DutyCard
                                    key={duty.id}
                                    duty={duty}
                                    showSwapButton={false}
                                    onDelete={handleDeleteStagedDuty} />
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-auto">
                    <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
                        <Button variant="outline" onClick={() => setIsAddFormOpen(true)}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Single Duty
                        </Button>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a New Duty</DialogTitle>
                            </DialogHeader>
                            <AddDutyForm onDutyAdd={handleAddDuty} onCancel={() => setIsAddFormOpen(false)} />
                        </DialogContent>
                    </Dialog>

                    <Button onClick={handleSaveAll} disabled={stagedDuties.length === 0}>
                        Add {stagedDuties.length > 0 ? stagedDuties.length : ''} Duties to Roster
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}