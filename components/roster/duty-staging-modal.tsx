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
import { PlusCircle, Plane, UploadCloud, FileText, X } from 'lucide-react';
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
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0] && files[0].type === "application/pdf") {
            setPdfFile(files[0]);
            // TODO: Implement PDF parsing logic here and populate stagedDuties
            // For example: `parsePdfAndSetDuties(files[0]);`
            console.log("PDF file selected:", files[0]);
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
        if (pdfFile) {
            console.log("With PDF file:", pdfFile.name)
        }
        onClose(); // Close the main modal after saving
    };

    const clearFile = () => {
        setPdfFile(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

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
                    {pdfFile ? (
                        <div className="flex flex-col items-center justify-center text-foreground">
                             <FileText className="w-12 h-12 mb-4 text-primary" />
                             <p className="font-semibold">{pdfFile.name}</p>
                             <p className="text-sm text-muted-foreground">({(pdfFile.size / 1024).toFixed(2)} KB)</p>
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
                            <p className="font-semibold text-foreground">Click "Add Single Duty" to get started.</p>
                            <p className="text-sm text-muted-foreground">No duties have been added manually.</p>                           
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