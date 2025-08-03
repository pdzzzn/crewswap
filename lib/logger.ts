import fs from 'fs';
import path from 'path';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Logs a message to a file with a timestamp
 * @param message The message to log
 * @param filename The name of the log file (default: 'app.log')
 */
export function logToFile(message: string, filename: string = 'app.log'): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  const logFilePath = path.join(logsDir, filename);
  
  try {
    fs.appendFileSync(logFilePath, logMessage);
  } catch (error) {
    console.error(`Failed to write to log file: ${error}`);
  }
}

/**
 * Logs .ics file content to a dedicated file
 * @param icsContent The content of the .ics file
 */
export function logIcsContent(icsContent: string): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `ics-content-${timestamp}.log`;
  const logFilePath = path.join(logsDir, filename);
  
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
  const logFilePath = path.join(logsDir, filename);
  
  try {
    fs.writeFileSync(logFilePath, JSON.stringify(duties, null, 2));
    logToFile(`Parsed duties saved to ${filename}`, 'parsing.log');
  } catch (error) {
    console.error(`Failed to write parsed duties to file: ${error}`);
    logToFile(`Failed to write parsed duties to file: ${error}`, 'error.log');
  }
}
