import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { logInfo, logError } from '@/lib/app-logger';
import { parseIcsToDuties } from '@/lib/ics';
import type { ParsedDuty } from '@/lib/ics';
import path from 'path';
import FormData from 'form-data';

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

// Using ParsedDuty type from '@/lib/ics' for a single source of truth

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
// Using shared parseIcsToDuties from '@/lib/ics'

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

        await logInfo('ICS convert: request received', {
            area: 'ics',
            route: '/api/convert-roster',
            meta: { filename: file.originalname }
        });

        // --- Step 1: Forward the file to the external service ---
        const form = new FormData();
        form.append('file', file.buffer, file.originalname);
        form.append('MAX_FILE_SIZE', '10000000');
        form.append('alarmtime', '60');
        form.append('email', '');

        const uploadResponse = await axios.post(CONVERTER_URL, form, {
            headers: { ...form.getHeaders() },
        });

        // --- Step 2: Parse the HTML response for the download link ---
        const $ = cheerio.load(uploadResponse.data);
        const downloadLink = $('.modal-footer a').first().attr('href');

        if (!downloadLink) {
            await logError('ICS convert failed: could not find download link', {
                area: 'ics',
                route: '/api/convert-roster'
            });
            return NextResponse.json({ error: 'Conversion failed: Could not find download link.' }, { status: 500 });
        }
        
        const fullDownloadUrl = BASE_URL + downloadLink;

        // --- Step 3: Download the .ics file ---
        const fileResponse = await axios({
            method: 'get',
            url: fullDownloadUrl,
            responseType: 'text', // Get the response as text
        });

        // --- Step 4: Parse the .ics file and return duties as JSON ---
        const duties = parseIcsToDuties(fileResponse.data);
        
        await logInfo('ICS convert success', {
            area: 'ics',
            route: '/api/convert-roster',
            meta: { dutiesCount: duties.length }
        });
        
        // Return the parsed duties as JSON
        return NextResponse.json({ duties }, { status: 200 });

    } catch (error: unknown) {
        // Type-safe error handling
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('[API] An error occurred:', errorMessage);
        await logError('ICS convert error', {
            area: 'ics',
            route: '/api/convert-roster',
            meta: { error: errorMessage }
        });
        return NextResponse.json({ error: 'An error occurred on the server.' }, { status: 500 });
    }
}