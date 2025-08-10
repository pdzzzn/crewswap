import fs from 'fs';
import path from 'path';

// Lightweight, serverless-safe logger utilities
let cachedLogsDir: string | null = null;

function isServerlessEnv(): boolean {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.NOW_REGION
  );
}

function resolveLogsDir(): string | null {
  if (cachedLogsDir !== null) return cachedLogsDir;

  const baseDir = isServerlessEnv() ? '/tmp' : process.cwd();
  const dir = path.join(baseDir, 'logs');
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cachedLogsDir = dir;
  } catch (err) {
    console.error(
      'Logger: unable to create logs directory; falling back to console-only logging.',
      err
    );
    cachedLogsDir = null;
  }
  return cachedLogsDir;
}

/**
 * Logs a message to a file with a timestamp
 * @param message The message to log
 * @param filename The name of the log file (default: 'app.log')
 */
export function logToFile(message: string, filename: string = 'app.log'): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  const dir = resolveLogsDir();
  if (!dir) {
    // Fall back to console logging when filesystem is not writable
    console.log(logMessage.trim());
    return;
  }

  const logFilePath = path.join(dir, filename);

  try {
    fs.appendFileSync(logFilePath, logMessage);
  } catch (error) {
    console.error(`Failed to write to log file ${logFilePath}:`, error);
    console.log(logMessage.trim());
  }
}

/**
 * Logs .ics file content to a dedicated file
 * @param icsContent The content of the .ics file
 */
export function logIcsContent(icsContent: string): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `ics-content-${timestamp}.log`;
  const dir = resolveLogsDir();
  if (!dir) {
    console.log('[ICS CONTENT START]');
    console.log(icsContent);
    console.log('[ICS CONTENT END]');
    logToFile('ICS content logging fell back to console', 'parsing.log');
    return;
  }

  const logFilePath = path.join(dir, filename);

  try {
    fs.writeFileSync(logFilePath, icsContent);
    logToFile(`ICS content saved to ${filename}`, 'parsing.log');
  } catch (error) {
    console.error(`Failed to write ICS content to file: ${error}`);
    logToFile(`Failed to write ICS content to file: ${error}`, 'error.log');
  }
}

/**
 * Logs parsed duty information to a file
 * @param duties The parsed duties
 */
export function logParsedDuties(duties: any[]): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `parsed-duties-${timestamp}.log`;
  const dir = resolveLogsDir();
  if (!dir) {
    console.log(`[PARSED DUTIES SAVED] count=${duties?.length ?? 0}`);
    logToFile('Parsed duties logging fell back to console', 'parsing.log');
    return;
  }

  const logFilePath = path.join(dir, filename);

  try {
    fs.writeFileSync(logFilePath, JSON.stringify(duties, null, 2));
    logToFile(`Parsed duties saved to ${filename}`, 'parsing.log');
  } catch (error) {
    console.error(`Failed to write parsed duties to file: ${error}`);
    logToFile(`Failed to write parsed duties to file: ${error}`, 'error.log');
  }
}
