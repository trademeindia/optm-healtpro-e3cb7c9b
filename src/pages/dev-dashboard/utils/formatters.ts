
/**
 * Format bytes to a human-readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format duration in milliseconds to a human-readable format
 */
export function formatDuration(ms: number): string {
  const seconds = ms / 1000;
  
  if (seconds < 1) {
    return `${Math.round(ms)}ms`;
  }
  
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}m ${Math.round(remainingSeconds)}s`;
}

/**
 * Format a percentage value
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a datetime string to a human-readable format
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format angle in degrees to a human-readable string
 */
export function formatAngle(angle: number | null, decimal = 0): string {
  if (angle === null || angle === undefined) return 'N/A';
  return `${angle.toFixed(decimal)}°`;
}

/**
 * Format a number to a specific precision
 */
export function formatNumber(value: number | null, decimals = 1): string {
  if (value === null || value === undefined) return 'N/A';
  return value.toFixed(decimals);
}

/**
 * Format a timestamp to a relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(dateString: string | number): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) return `${diffSec} sec ago`;
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hr ago`;
  if (diffDay < 30) return `${diffDay} days ago`;
  
  return formatDate(date.toISOString());
}

/**
 * Format a score (0-100) with color indication
 */
export function formatScore(score: number): { value: string, color: string } {
  if (score >= 80) {
    return { value: `${score}`, color: 'text-green-500' };
  } else if (score >= 60) {
    return { value: `${score}`, color: 'text-yellow-500' };
  } else {
    return { value: `${score}`, color: 'text-red-500' };
  }
}
