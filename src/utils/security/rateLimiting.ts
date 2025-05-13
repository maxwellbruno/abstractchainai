
/**
 * Rate limiting for client-side actions
 */
export class RateLimiter {
  private timestamps: Record<string, number[]> = {};
  private maxAttempts: number;
  private timeWindow: number;

  constructor(maxAttempts: number = 5, timeWindowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindowMs;
  }

  public isRateLimited(key: string): boolean {
    const now = Date.now();
    if (!this.timestamps[key]) {
      this.timestamps[key] = [];
    }
    
    // Clean up old timestamps
    this.timestamps[key] = this.timestamps[key].filter(
      timestamp => now - timestamp < this.timeWindow
    );
    
    // Check if rate limited
    if (this.timestamps[key].length >= this.maxAttempts) {
      return true;
    }
    
    // Add current timestamp
    this.timestamps[key].push(now);
    return false;
  }
  
  public getTimeUntilReset(key: string): number {
    const now = Date.now();
    if (!this.timestamps[key] || this.timestamps[key].length === 0) {
      return 0;
    }
    
    const oldestTimestamp = Math.min(...this.timestamps[key]);
    return Math.max(0, (oldestTimestamp + this.timeWindow) - now);
  }
}

/**
 * Throttle function to limit execution frequency
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => ReturnType<T> | void) => {
  let lastCall = 0;
  return (...args: Parameters<T>): ReturnType<T> | void => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return func(...args);
    }
  };
};
