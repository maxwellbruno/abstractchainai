
import DOMPurify from "dompurify";

/**
 * Enhanced DOMPurify configuration for XSS prevention
 */
const configureDOMPurify = () => {
  // Configure DOMPurify to be more strict
  DOMPurify.setConfig({
    ALLOWED_TAGS: [
      'a', 'b', 'br', 'code', 'div', 'em', 'i', 'li', 'ol', 'p', 'pre', 
      'span', 'strong', 'u', 'ul'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class'
    ],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    FORBID_CONTENTS: ['script', 'style'],
    ADD_ATTR: ['target'], // allow target="_blank" for links
    ADD_URI_SAFE_ATTR: [],
  });

  // Hook to force all links to open in a new tab and have noopener/noreferrer
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
};

// Initialize DOMPurify
configureDOMPurify();

/**
 * Sanitizes HTML to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
};

/**
 * Validates an email address
 */
export const validateEmail = (email: string): boolean => {
  // RFC 5322 compliant regex pattern for email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

/**
 * Validates a URL string
 */
export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

/**
 * Escapes HTML entities to prevent XSS when not using DOMPurify
 */
export const escapeHtml = (unsafeText: string): string => {
  return unsafeText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Simple CSRF token generation
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Store CSRF token in sessionStorage
 */
export const storeCSRFToken = (token: string): void => {
  sessionStorage.setItem('csrf_token', token);
};

/**
 * Validate a CSRF token against stored token
 */
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return storedToken === token;
};

/**
 * Create Content Security Policy nonce
 */
export const createCSPNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

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
