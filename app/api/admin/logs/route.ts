import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { getCurrentUser } from '@/lib/auth';

const LOGS_DIR = path.join(process.cwd(), 'logs');

async function safeListLogs() {
  try {
    const entries = await fs.readdir(LOGS_DIR, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((e) => e.isFile())
        .map(async (e) => {
          const full = path.join(LOGS_DIR, e.name);
          const stat = await fs.stat(full);
          return {
            name: e.name,
            size: stat.size,
            lastModified: stat.mtime.toISOString(),
          };
        })
    );
    // Sort by lastModified desc
    files.sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1));
    return files;
  } catch (err) {
    return [] as Array<{ name: string; size: number; lastModified: string }>;
  }
}

function isSafeFileName(name: string) {
  // Prevent path traversal and subdirectories
  return name === path.basename(name) && !name.includes('/') && !name.includes('..');
}

async function readLogFileLines(fileName: string): Promise<string[] | null> {
  try {
    const full = path.join(LOGS_DIR, fileName);
    const buf = await fs.readFile(full, 'utf8');
    return buf.split(/\r?\n/);
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  // Admin-only guard
  const user = await getCurrentUser();
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const url = new URL(req.url);
  const params = url.searchParams;

  // List available files
  if (params.get('list') === 'true') {
    const files = await safeListLogs();
    return NextResponse.json({ files });
  }

  // Return contents of a file (optionally limited)
  const file = params.get('file');
  if (!file) {
    return NextResponse.json(
      { error: 'Missing query parameter: file or list=true' },
      { status: 400 }
    );
  }

  if (!isSafeFileName(file)) {
    return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
  }

  const limitParam = params.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : 0;
  const tail = params.get('tail') === 'true';

  const lines = await readLogFileLines(file);
  if (!lines) {
    return NextResponse.json({ error: 'File not found or unreadable' }, { status: 404 });
  }

  let returned: string[] = lines;
  if (limit && Number.isFinite(limit) && limit > 0) {
    returned = tail ? lines.slice(-limit) : lines.slice(0, limit);
  }

  return NextResponse.json({
    file,
    totalLines: lines.length,
    returnedLines: returned.length,
    lines: returned,
  });
}
