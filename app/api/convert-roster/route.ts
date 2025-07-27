import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import * as cheerio from 'cheerio';
import path from 'path';


// --- External Service Configuration ---
const CONVERTER_URL = 'https://www.dienstplankonverter.de/index.php?action=convert';
const BASE_URL = 'https://www.dienstplankonverter.de/';

/**
 * A helper type for the parsed file data.
 */
interface ParsedFile {
    buffer: Buffer;
    originalname: string;
}

/**
 * A helper type for parsed duty data.
 */
interface ParsedDuty {
    id: string;
    date: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    departureLocation: string;
    arrivalLocation: string;
}

/**
 * Processes the FormData from the request to extract the uploaded file.
 * @param request The incoming NextRequest object.
 * @returns A promise that resolves to the parsed file or null if no file is found.
 */
async function processFile(request: NextRequest): Promise<ParsedFile | null> {
    const formData = await request.formData();
    const file = formData.get('pdfFile') as File | null;

    if (!file) {
        return null;
    }

    // Convert the file to a Node.js Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    return {
        buffer,
        originalname: file.name,
    };
}

/**
 * Parses the .ics file content and converts it to duty objects.
 * @param icsContent The content of the .ics file as a string.
 * @returns An array of parsed duty objects.
 */
function parseIcsToDuties(icsContent: string): ParsedDuty[] {
    // This is a simplified parser - in a real implementation, you would need
    // a proper .ics parser to extract the duty information
    
    const duties: ParsedDuty[] = [];
    
    // Split the content into lines
    const lines = icsContent.split('\n');
    
    // Simple parsing logic - this would need to be expanded for a real implementation
    let currentDuty: Partial<ParsedDuty> | null = null;
    let eventId = 0;
    
    for (const line of lines) {
        if (line.startsWith('BEGIN:VEVENT')) {
            currentDuty = {};
        } else if (line.startsWith('END:VEVENT') && currentDuty) {
            // Add the completed duty to our array
            duties.push({
                id: `parsed-${eventId++}`,
                date: currentDuty.date || new Date().toISOString(),
                flightNumber: currentDuty.flightNumber || 'Unknown',
                departureTime: currentDuty.departureTime || new Date().toISOString(),
                arrivalTime: currentDuty.arrivalTime || new Date().toISOString(),
                departureLocation: currentDuty.departureLocation || 'Unknown',
                arrivalLocation: currentDuty.arrivalLocation || 'Unknown',
            });
            currentDuty = null;
        } else if (currentDuty) {
            // Parse event properties
            if (line.startsWith('SUMMARY:')) {
                const summary = line.substring(8);
                // Extract flight number from summary (simplified)
                const flightMatch = summary.match(/([A-Z]{2}\d{1,4})/);
                if (flightMatch) {
                    currentDuty.flightNumber = flightMatch[1];
                }
            } else if (line.startsWith('DTSTART:')) {
                const time = line.split("T")[1].substring(0, 5);
                currentDuty.departureTime = time;
                console.log(`Departure time: ${currentDuty.departureTime}`);
                currentDuty.date = line.substring(8, 16); // Extract date part
            } else if (line.startsWith('DTEND:')) {
                currentDuty.arrivalTime = line.substring(6);
            } else if (line.startsWith('LOCATION:')) {
                const location = line.substring(9);
                // Split location into departure and arrival (simplified)
                const locations = location.split(' - ');
                if (locations.length >= 2) {
                    currentDuty.departureLocation = locations[0];
                    currentDuty.arrivalLocation = locations[1];
                }
            }
        }
    }
    
    return duties;
}

/**
 * Handles the POST request to convert the uploaded PDF roster.
 * @param request The incoming NextRequest from the client.
 * @returns A promise that resolves to a Response object, either the parsed duties or a JSON error.
 */
export async function POST(request: NextRequest): Promise<NextResponse | Response> {
    try {
        const file = await processFile(request);

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
        }

        console.log(`[API] Received file: ${file.originalname}`);

        // --- Step 1: Forward the file to the external service ---
        console.log('[API] Step 1: Forwarding file...');
        const form = new FormData();
        form.append('file', file.buffer, file.originalname);
        form.append('MAX_FILE_SIZE', '10000000');
        form.append('alarmtime', '60');
        form.append('email', '');

        const uploadResponse = await axios.post(CONVERTER_URL, form, {
            headers: { ...form.getHeaders() },
        });

        // --- Step 2: Parse the HTML response for the download link ---
        console.log('[API] Step 2: Parsing response...');
        const $ = cheerio.load(uploadResponse.data);
        const downloadLink = $('.modal-footer a').first().attr('href');

        if (!downloadLink) {
            console.error('[API] Could not find the download link.');
            return NextResponse.json({ error: 'Conversion failed: Could not find download link.' }, { status: 500 });
        }
        
        const fullDownloadUrl = BASE_URL + downloadLink;
        console.log(`[API] Found download link: ${fullDownloadUrl}`);

        // --- Step 3: Download the .ics file ---
        console.log('[API] Step 3: Downloading .ics file...');
        const fileResponse = await axios({
            method: 'get',
            url: fullDownloadUrl,
            responseType: 'text', // Get the response as text
        });

        // --- Step 4: Parse the .ics file and return duties as JSON ---
        console.log('[API] Step 4: Parsing .ics file to duties...');
        const duties = parseIcsToDuties(fileResponse.data);
        
        console.log(`[API] Parsed ${duties.length} duties from .ics file`);
        
        // Return the parsed duties as JSON
        return NextResponse.json({ duties }, { status: 200 });

    } catch (error: unknown) {
        // Type-safe error handling
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('[API] An error occurred:', errorMessage);
        return NextResponse.json({ error: 'An error occurred on the server.' }, { status: 500 });
    }
}