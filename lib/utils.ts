import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats seconds into a readable time string
 * @param seconds - The number of seconds to format
 * @param format - The format to use: 'short' (e.g., "2h 30m") or 'long' (e.g., "2 hours 30 minutes")
 * @returns Formatted time string
 */
export function formatDuration(seconds: number, format: 'short' | 'long' = 'short'): string {
  if (seconds === 0) return format === 'short' ? '0m' : '0 minutes';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (format === 'short') {
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 && hours === 0) parts.push(`${secs}s`);
  } else {
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    if (secs > 0 && hours === 0) parts.push(`${secs} ${secs === 1 ? 'second' : 'seconds'}`);
  }

  return parts.join(' ') || (format === 'short' ? '0m' : '0 minutes');
}