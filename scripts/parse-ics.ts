#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import process from 'process';
import { parseIcsToDuties } from '../lib/ics';
import { logParsedDuties, logToFile } from '../lib/logger';

function usage() {
  console.log(`Usage: yarn parse:ics [--file <path-to-ics-or-log>]

If --file is omitted, the script will try to find the newest file matching logs/ics-content-*.log.
`);
}

function getNewestIcsLog(): string | null {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) return null;
  const files = fs.readdirSync(logsDir)
    .filter(f => /^ics-content-.*\.log$/.test(f))
    .map(f => path.join(logsDir, f));
  if (files.length === 0) return null;
  files.sort((a, b) => (fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs));
  return files[0];
}

async function main() {
  const args = process.argv.slice(2);
  let fileArg: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--help' || a === '-h') {
      usage();
      process.exit(0);
    }
    if (a === '--file' && i + 1 < args.length) {
      fileArg = args[i + 1];
      i++;
      continue;
    }
  }

  let targetPath: string | null = null;

  if (fileArg) {
    targetPath = path.isAbsolute(fileArg) ? fileArg : path.join(process.cwd(), fileArg);
    if (!fs.existsSync(targetPath)) {
      console.error(`File not found: ${targetPath}`);
      process.exit(1);
    }
  } else {
    targetPath = getNewestIcsLog();
    if (!targetPath) {
      console.error('No logs/ics-content-*.log files found. Provide --file <path> to an .ics/.log file.');
      process.exit(1);
    }
  }

  const content = fs.readFileSync(targetPath, 'utf-8');
  logToFile(`Parsing ICS from ${path.relative(process.cwd(), targetPath)}`, 'parsing.log');
  const duties = parseIcsToDuties(content);

  // Write parsed duties to logs as well
  try {
    logParsedDuties(duties as any[]);
  } catch (err) {
    // Non-fatal
  }

  // Print to stdout
  console.log(JSON.stringify({ file: targetPath, count: duties.length, duties }, null, 2));
}

main().catch(err => {
  console.error('Error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
