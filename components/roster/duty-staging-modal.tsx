'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { PlusCircle, Plane, UploadCloud, FileText, X, Loader2, List } from 'lucide-react';
import DutyCard from '@/components/dashboard/duty-card';
import { AddDutyForm } from './add-duty-form';
import type { Duty, FlightLeg } from '@/lib/types';

import { parseIcsToDuties } from '@/app/api/convert-roster/route';
import { fstat, readFile } from 'fs';


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

// Type for parsed duties from the backend
interface ParsedDuty {
    id: string;
    date: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    departureLocation: string;
    arrivalLocation: string;
}

export function DutyStagingModal({ isOpen, onClose }: DutyStagingModalProps) {
    const [stagedDuties, setStagedDuties] = useState<Duty[]>([]);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);
    const [showOverview, setShowOverview] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0] && files[0].type === "application/pdf") {
            setPdfFile(files[0]);
            setParseError(null);
            // Automatically parse the PDF when selected
            parsePdfAndSetDuties(files[0]);
        }
    };

    const parsePdfAndSetDuties = async (file: File) => {
        setIsParsing(true);
        setParseError(null);

        try {
            const formData = new FormData();
            formData.append('pdfFile', file);

            const response = await fetch('/api/convert-roster', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to parse PDF');
            }

            // Handle the JSON response from the backend
            const result = await response.json();

            // Convert parsed duties to Duty objects
            const duties: Duty[] = result.duties.map((parsedDuty: ParsedDuty, index: number) => {
                // Create a FlightLeg from the parsed duty data
                const flightLeg: FlightLeg = {
                    id: `leg-${index}`,
                    flightNumber: parsedDuty.flightNumber,
                    departureTime: parsedDuty.departureTime,
                    arrivalTime: parsedDuty.arrivalTime,
                    departureLocation: parsedDuty.departureLocation,
                    arrivalLocation: parsedDuty.arrivalLocation,
                    isDeadhead: false,
                };

                // Create a Duty object
                return {
                    id: parsedDuty.id,
                    date: parsedDuty.date,
                    legs: [flightLeg],
                    pairing: null,
                };
            });

            // Update the stagedDuties state
            setStagedDuties(duties);

            console.log(`Successfully parsed ${duties.length} duties from PDF`);

        } catch (error: any) {
            console.error('Error parsing PDF:', error);
            setParseError(error.message || 'Failed to parse PDF');
        } finally {
            setIsParsing(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        handleFileSelect(files);
    };

    const handleDeleteStagedDuty = (dutyId: string) => {
        setStagedDuties(prev => prev.filter(duty => duty.id !== dutyId));
    };

    const handleAddDuty = (formData: any) => {
        const newDuty: Duty = {
            id: `staged-${stagedDuties.length + 1}`, // Temporary ID
            date: formData.date.toISOString(),
            legs: [{
                id: `leg-${stagedDuties.length + 1}-1`,
                flightNumber: formData.flightNumber,
                departureTime: combineDateTime(formData.date, formData.departureTime),
                arrivalTime: combineDateTime(formData.date, formData.arrivalTime),
                departureLocation: formData.departureLocation,
                arrivalLocation: formData.arrivalLocation,
                isDeadhead: false,
            }],
            pairing: null,
        };
        setStagedDuties(prev => [...prev, newDuty]);
        setIsAddFormOpen(false); // Close the form modal after adding
    };

    const handleSaveAll = () => {
        // TODO: Implement API call to save all stagedDuties to the database
        console.log("Saving all duties:", stagedDuties);
        if (pdfFile) {
            console.log("With PDF file:", pdfFile.name)
        }
        onClose(); // Close the main modal after saving
    };

    const clearFile = () => {
        setPdfFile(null);
        setParseError(null);
        // Clear staged duties when file is cleared
        setStagedDuties([]);
        setShowOverview(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    // Calculate overview statistics
    const getOverviewStats = () => {
        const totalDuties = stagedDuties.length;
        const totalLegs = stagedDuties.reduce((acc, duty) => acc + duty.legs.length, 0);

        // Get unique destinations
        const destinations = new Set<string>();
        stagedDuties.forEach(duty => {
            duty.legs.forEach(leg => {
                destinations.add(leg.departureLocation);
                destinations.add(leg.arrivalLocation);
            });
        });

        // Get date range
        const dates = stagedDuties.map(duty => new Date(duty.date));
        const minDate = dates.length > 0 ? new Date(Math.min(...dates as any)) : null;
        const maxDate = dates.length > 0 ? new Date(Math.max(...dates as any)) : null;

        return {
            totalDuties,
            totalLegs,
            uniqueDestinations: destinations.size,
            dateRange: minDate && maxDate ? `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}` : 'N/A'
        };
    };

    const overviewStats = getOverviewStats();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[80vw] md:max-w-[75vw] w-full h-[80vh] flex flex-col bg-background">
                <DialogHeader>
                    <DialogTitle>Stage Duties for Upload</DialogTitle>
                    <DialogDescription>
                        Upload a PDF roster or add duties one by one. When you are finished, click "Add to Roster" to save them all.
                    </DialogDescription>
                </DialogHeader>

                {/* PDF Drag and Drop Section */}
                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ease-in-out ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="application/pdf"
                        onChange={(e) => handleFileSelect(e.target.files)}
                    />
                    {isParsing ? (
                        <div className="flex flex-col items-center justify-center text-foreground">
                            <Loader2 className="w-12 h-12 mb-4 text-primary animate-spin" />
                            <p className="font-semibold">Parsing your PDF roster...</p>
                            <p className="text-sm text-muted-foreground">This may take a moment</p>
                        </div>
                    ) : pdfFile ? (
                        <div className="flex flex-col items-center justify-center text-foreground">
                            <FileText className="w-12 h-12 mb-4 text-primary" />
                            <p className="font-semibold">{pdfFile.name}</p>
                            <p className="text-sm text-muted-foreground">({(pdfFile.size / 1024).toFixed(2)} KB)</p>
                            {parseError ? (
                                <p className="text-sm text-red-500 mt-2">Error: {parseError}</p>
                            ) : (
                                <div className="flex flex-col items-center mt-2">
                                    <p className="text-sm text-green-500">Successfully parsed {stagedDuties.length} duties!</p>
                                    {stagedDuties.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            onClick={(e) => { e.stopPropagation(); setShowOverview(!showOverview); }}
                                        >
                                            <List className="w-4 h-4 mr-2" />
                                            {showOverview ? 'Hide Overview' : 'Show Overview'}
                                        </Button>
                                    )}
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center cursor-pointer">
                            <UploadCloud className="w-12 h-12 mb-4 text-muted-foreground" />
                            <p className="font-semibold text-foreground">Drag and drop a PDF file here</p>
                            <p className="text-sm text-muted-foreground">or click to browse</p>
                        </div>
                    )}
                </div>

                {/* Overview Section */}
                {showOverview && stagedDuties.length > 0 && (
                    <div className="border rounded-md p-4 mb-4 bg-muted/50">
                        <h3 className="font-semibold text-lg mb-2 flex items-center">
                            <List className="w-5 h-5 mr-2" />
                            Duty Overview
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-background p-3 rounded-md border">
                                <p className="text-sm text-muted-foreground">Total Duties</p>
                                <p className="text-2xl font-bold">{overviewStats.totalDuties}</p>
                            </div>
                            <div className="bg-background p-3 rounded-md border">
                                <p className="text-sm text-muted-foreground">Total Legs</p>
                                <p className="text-2xl font-bold">{overviewStats.totalLegs}</p>
                            </div>
                            <div className="bg-background p-3 rounded-md border">
                                <p className="text-sm text-muted-foreground">Destinations</p>
                                <p className="text-2xl font-bold">{overviewStats.uniqueDestinations}</p>
                            </div>
                            <div className="bg-background p-3 rounded-md border">
                                <p className="text-sm text-muted-foreground">Date Range</p>
                                <p className="text-lg font-bold">{overviewStats.dateRange}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Separator */}
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="mx-4 text-xs font-semibold tracking-wider uppercase text-muted-foreground">OR</span>
                    <div className="flex-grow border-t border-border"></div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-md">
                    {stagedDuties.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Plane className="w-16 h-16 mb-4" />
                            <p className="font-semibold text-foreground">{pdfFile ? 'No duties were parsed from the PDF.' : 'Click "Add Single Duty" to get started.'}</p>
                            <p className="text-sm text-muted-foreground">{pdfFile ? 'Try a different PDF file.' : 'No duties have been added manually.'}</p>
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

                <DialogFooter className="mt-auto pt-4">
                    <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
                        <Button variant="outline" onClick={() => setIsAddFormOpen(true)}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Single Duty
                        </Button>
                        <Button variant="outline" onClick={parseIcsToDuties(readFile('/home/user/aviation-crew-swap/app/logs/ics-content-2025-07-31T19-40-00-751Z.log'))}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Parse ics
                        </Button>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a New Duty</DialogTitle>
                            </DialogHeader>
                            <AddDutyForm onDutyAdd={handleAddDuty} onCancel={() => setIsAddFormOpen(false)} />
                        </DialogContent>
                    </Dialog>

                    <Button onClick={handleSaveAll} disabled={stagedDuties.length === 0 && !pdfFile}>
                        Add {stagedDuties.length > 0 ? `${stagedDuties.length} ` : ''}Duties to Roster
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}