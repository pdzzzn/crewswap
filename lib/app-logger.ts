import 'server-only';
import { createServiceClient } from '@/lib/supabase-service';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogPayload = {
  level: LogLevel;
  area?: string; // logical area/module e.g. 'ics', 'import', 'auth'
  route?: string; // API route path e.g. '/api/convert-roster'
  message: string;
  meta?: Record<string, any> | null;
  user_id?: string | null;
  request_id?: string | null;
  correlation_id?: string | null;
  artifact_type?: string | null;
  artifact_path?: string | null;
};

export async function logDb(payload: LogPayload) {
  const client = createServiceClient();
  const { level = 'info', area, route, message, meta, user_id, request_id, correlation_id, artifact_type, artifact_path } = payload;

  // Console fallback always
  const stamp = new Date().toISOString();
  // Keep console output minimal and safe
  // Never include large payloads like raw ICS in meta
  const safeMeta = meta ? JSON.stringify(meta).slice(0, 4000) : undefined;
  // eslint-disable-next-line no-console
  console.log(`[${stamp}] [${level.toUpperCase()}]${area ? ' [' + area + ']' : ''}${route ? ' ' + route : ''} - ${message}${safeMeta ? ' ' + safeMeta : ''}`);

  if (!client) return; // No service key available (e.g., local w/o envs), console already logged

  try {
    await client.from('app_logs' as any).insert({
      level,
      area: area ?? null,
      route: route ?? null,
      message,
      meta: meta ?? null,
      user_id: user_id ?? null,
      request_id: request_id ?? null,
      correlation_id: correlation_id ?? null,
      artifact_type: artifact_type ?? null,
      artifact_path: artifact_path ?? null,
    } as any);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to write app log to Supabase:', err);
  }
}

export async function logInfo(message: string, opts: Omit<LogPayload, 'level' | 'message'> = {}) {
  return logDb({ level: 'info', message, ...opts });
}

export async function logWarn(message: string, opts: Omit<LogPayload, 'level' | 'message'> = {}) {
  return logDb({ level: 'warn', message, ...opts });
}

export async function logError(message: string, opts: Omit<LogPayload, 'level' | 'message'> = {}) {
  return logDb({ level: 'error', message, ...opts });
}
