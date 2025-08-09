import { logToFile } from './logger';

export interface ParsedDuty {
  id: string;
  date: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureLocation: string;
  arrivalLocation: string;
}

/**
 * Parses the .ics file content and converts it to duty objects.
 * Robust parser tailored to Dienstplan-Konverter ICS export.
 */
export function parseIcsToDuties(icsContent: string): ParsedDuty[] {
  logToFile('Parsing .ics file content (robust parser)...', 'parsing.log');

  const duties: ParsedDuty[] = [];

  // 1) Unfold lines per RFC 5545 (continuation lines begin with space or tab)
  const rawLines = icsContent.split(/\r?\n/);
  const lines: string[] = [];
  for (const l of rawLines) {
    if ((l.startsWith(' ') || l.startsWith('\t')) && lines.length > 0) {
      lines[lines.length - 1] += l.slice(1);
    } else {
      lines.push(l);
    }
  }

  // 2) Collect VEVENT blocks with key/value pairs. Preserve DTSTART/DTEND type (DATE vs DATE-TIME)
  const events: Record<string, string>[] = [];
  let current: Record<string, string> | null = null;

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current) events.push(current);
      current = null;
      continue;
    }
    if (!current) continue;

    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const keyPart = line.substring(0, idx); // e.g., DTSTART;VALUE=DATE
    const value = line.substring(idx + 1);
    const baseKey = keyPart.split(';')[0].toUpperCase();

    current[baseKey] = value;
    if ((baseKey === 'DTSTART' || baseKey === 'DTEND') && /;VALUE=DATE/i.test(keyPart)) {
      current[baseKey + '_TYPE'] = 'DATE';
    }
  }

  // Helper to parse DTSTART/DTEND values
  const parseDateTime = (val?: string, type?: string): { date: string; time: string } => {
    if (!val) return { date: '', time: '' };
    // All-day date or explicit VALUE=DATE
    if (type === 'DATE' || /^\d{8}$/.test(val)) {
      const d = val.slice(0, 8);
      const date = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
      return { date, time: '' };
    }
    // Date-time like 20250807T161000Z or 20250807T161000
    const m = val.match(/^(\d{8})T(\d{6})/);
    if (m) {
      const d = m[1];
      const t = m[2];
      const date = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
      const time = `${t.slice(0, 2)}:${t.slice(2, 4)}`; // keep HH:mm (UTC if suffixed with Z)
      return { date, time };
    }
    return { date: '', time: '' };
  };

  let idCounter = 0;

  for (const ev of events) {
    const summary = ev['SUMMARY'] || '';
    const location = ev['LOCATION'] || '';
    const description = (ev['DESCRIPTION'] || '').replace(/\\n/g, '\n');
    // Capture full duty code including standby level (e.g., STBY_S3). Allow digits.
    const dutyCodeMatch = description.match(/DutyCode:\s*([A-Z0-9/_-]+)/i);
    const dutyCode = (dutyCodeMatch ? dutyCodeMatch[1] : '').toUpperCase();

    const start = parseDateTime(ev['DTSTART'], ev['DTSTART_TYPE']);
    const end = parseDateTime(ev['DTEND'], ev['DTEND_TYPE']);

    let flightNumber = 'Unknown';
    let departureLocation = 'Unknown';
    let arrivalLocation = 'Unknown';

    // Flight pattern examples:
    //  - "EW 6851 HAJ - PMI"
    //  - "DH/EW 9575 PMI - DUS"
    const flightPattern = /^(.*?)\s+([A-Z]{3})\s*-\s*([A-Z]{3})\s*$/;
    const fm = summary.match(flightPattern);
    if (fm) {
      const ident = fm[1].trim(); // e.g., 'EW 6851' or 'DH/EW 9575'
      departureLocation = fm[2];
      arrivalLocation = fm[3];
      flightNumber = ident.replace(/\s+/g, ' ');
    } else {
      // Other event types: Checkin/Checkout/Pickup/Standby/Off
      const checkMatch = summary.match(/^(Checkin|Checkout|Pickup)\s+([A-Z]{3})/i);
      const offMatch = summary.match(/^Off\s+([A-Z]{3})/i);
      const stbyMatch = summary.match(/^Standby\s+([A-Z]{3})/i);

      if (checkMatch) {
        flightNumber = dutyCode || checkMatch[1].toUpperCase();
        departureLocation = checkMatch[2].toUpperCase();
        arrivalLocation = departureLocation;
      } else if (offMatch) {
        flightNumber = dutyCode || 'OFF';
        departureLocation = (offMatch[1] || location || 'Unknown').toUpperCase();
        arrivalLocation = departureLocation;
      } else if (stbyMatch) {
        // If DutyCode carries standby subtype (e.g., STBY_S3), keep it in the label
        flightNumber = dutyCode || 'STBY';
        departureLocation = (stbyMatch[1] || location || 'Unknown').toUpperCase();
        arrivalLocation = departureLocation;
      } else {
        // Fallback: use LOCATION if present
        flightNumber = dutyCode || 'Unknown';
        if (location) {
          departureLocation = location;
          arrivalLocation = location;
        }
      }
    }

    const duty: ParsedDuty = {
      id: `parsed-${idCounter++}`,
      date: start.date || '',
      flightNumber,
      departureTime: start.time || '',
      arrivalTime: end.time || '',
      departureLocation,
      arrivalLocation,
    };

    logToFile(`Parsed duty: ${JSON.stringify(duty)}`, 'parsing.log');
    duties.push(duty);
  }

  logToFile(`Total parsed duties: ${duties.length}`, 'parsing.log');
  return duties;
}
