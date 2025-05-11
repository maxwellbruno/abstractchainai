
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DOMPurify from "dompurify";

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Handles API errors in a consistent way
 */
export const handleApiError = (error: unknown): ApiError => {
  console.error("API Error:", error);
  
  // Handle different error types
  if (error instanceof Error) {
    return { message: error.message };
  }
  
  if (typeof error === 'string') {
    return { message: error };
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return { 
      message: String(error.message),
      // @ts-ignore - we're doing runtime type checking
      status: error.status || error.statusCode,
      // @ts-ignore - we're doing runtime type checking
      code: error.code
    };
  }
  
  return { message: 'An unknown error occurred' };
};

/**
 * Secure data sanitizer to prevent XSS attacks
 */
export const sanitizeData = <T>(data: T): T => {
  if (!data) return data;
  
  if (typeof data === 'string') {
    return DOMPurify.sanitize(data) as unknown as T;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item)) as unknown as T;
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitizedData: Record<string, any> = {};
    
    Object.entries(data).forEach(([key, value]) => {
      sanitizedData[key] = sanitizeData(value);
    });
    
    return sanitizedData as T;
  }
  
  return data;
};

/**
 * Type for API rate limiters
 */
interface RateLimiterOptions {
  maxCalls: number;
  timeWindowMs: number;
  keyPrefix: string;
}

/**
 * API rate limiter to prevent abuse
 */
export class ApiRateLimiter {
  private calls: Map<string, number[]> = new Map();
  private options: RateLimiterOptions;
  
  constructor(options: Partial<RateLimiterOptions> = {}) {
    this.options = {
      maxCalls: options.maxCalls || 5,
      timeWindowMs: options.timeWindowMs || 60000, // 1 minute by default
      keyPrefix: options.keyPrefix || 'rate_limit',
    };
  }
  
  public checkLimit(key: string): boolean {
    const fullKey = `${this.options.keyPrefix}:${key}`;
    const now = Date.now();
    
    // Get existing calls or initialize empty array
    let calls = this.calls.get(fullKey) || [];
    
    // Filter out calls outside the time window
    calls = calls.filter(timestamp => now - timestamp < this.options.timeWindowMs);
    
    // Check if we're over the limit
    if (calls.length >= this.options.maxCalls) {
      return false;
    }
    
    // Add the current call
    calls.push(now);
    
    // Update the calls
    this.calls.set(fullKey, calls);
    
    return true;
  }
  
  public getTimeUntilReset(key: string): number {
    const fullKey = `${this.options.keyPrefix}:${key}`;
    const calls = this.calls.get(fullKey) || [];
    
    if (calls.length === 0) return 0;
    
    const now = Date.now();
    const oldestCall = Math.min(...calls);
    const resetTime = oldestCall + this.options.timeWindowMs - now;
    
    return Math.max(resetTime, 0);
  }
}

// Create global rate limiters
export const formRateLimiter = new ApiRateLimiter({
  maxCalls: 5,
  timeWindowMs: 60000, // 1 minute
  keyPrefix: 'form_submission'
});

export const newsletterRateLimiter = new ApiRateLimiter({
  maxCalls: 3,
  timeWindowMs: 3600000, // 1 hour
  keyPrefix: 'newsletter'
});
