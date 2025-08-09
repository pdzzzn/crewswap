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
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import type { Duty, FlightLeg, StagedDutyBlock } from '@/lib/types';
import { transformParsedDutiesToStagedBlocks } from '@/lib/staging';


interface DutyStagingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onParsed: (blocks: StagedDutyBlock[], duties: Duty[]) => void;
}

// ParsedDuty type comes from the API response of /api/convert-roster

export function DutyStagingModal({ isOpen, onClose, onParsed }: DutyStagingModalProps) {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);
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

            // Transform parsed ICS duties -> staged blocks for selection
            const newBlocks: StagedDutyBlock[] = transformParsedDutiesToStagedBlocks(result.duties);

            // Convert to existing Duty objects for the visual cards overview (non-authoritative)
            const duties: Duty[] = result.duties.map((parsedDuty: any, index: number) => {
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

            // Hand parsed data to parent and close this upload-only modal
            onParsed(newBlocks, duties);
            console.log(`Successfully parsed ${duties.length} duties from PDF`);
            onClose();

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

    const clearFile = () => {
        setPdfFile(null);
        setParseError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    // Upload-only modal UI
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[80vw] md:max-w-[75vw] w-full h-[60vh] flex flex-col bg-background">
                <DialogHeader>
                    <DialogTitle>Upload Roster PDF</DialogTitle>
                    <DialogDescription>
                        Upload your duty roster as a PDF. We will parse it and show the results in the next step.
                    </DialogDescription>
                </DialogHeader>

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
                            {parseError && (
                                <p className="text-sm text-red-500 mt-2">Error: {parseError}</p>
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

                <DialogFooter className="mt-auto pt-2">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}