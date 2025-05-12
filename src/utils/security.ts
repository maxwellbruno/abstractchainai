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
    // Remove prototype pollution vulnerability - set USE_PROFILES explicitly
    USE_PROFILES: { html: true },
  });

  // Hook to force all links to open in a new tab and have noopener/noreferrer
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
    // Remove __proto__ and constructor references to prevent prototype pollution
    if (node.hasAttribute('__proto__') || node.hasAttribute('constructor')) {
      node.removeAttribute('__proto__');
      node.removeAttribute('constructor');
    }
  });
};

// Initialize DOMPurify with secure configuration
configureDOMPurify();

/**
 * Sanitizes HTML to prevent XSS attacks
 * Uses explicit configuration to prevent nesting-based attacks
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    WHOLE_DOCUMENT: false,
    SANITIZE_DOM: true
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

/**
 * Password strength evaluation
 */
export const evaluatePasswordStrength = (password: string): {
  score: number;
  feedback: string;
} => {
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push("Password is too short");
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  // Variety check
  const charTypes = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/];
  const typesPresent = charTypes.filter(regex => regex.test(password)).length;
  
  if (typesPresent < 3) {
    feedback.push("Use a mix of letters, numbers, and symbols");
  }
  
  // Common patterns check
  if (/^123|abc|qwerty|password|admin|welcome|[0-9]{4}$/i.test(password)) {
    score -= 1;
    feedback.push("Avoid common patterns");
  }
  
  return {
    score: Math.max(0, Math.min(5, score)), // Scale 0-5
    feedback: feedback.join(". ")
  };
};

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

/**
 * Check for suspicious activity patterns
 */
export const detectSuspiciousActivity = (): boolean => {
  const suspiciousPatterns = [
    // Iframe detection
    window !== window.top,
    
    // DevTools detection
    window.outerHeight - window.innerHeight > 200,
    
    // Unusual navigation timing
    performance.navigation?.type === 2, // Back/forward navigation
    
    // Rapid successive actions
    document.hasFocus() === false && document.visibilityState === 'visible',
  ];
  
  return suspiciousPatterns.some(Boolean);
};

/**
 * Device fingerprinting for fraud detection
 * Only collects non-PII data to help identify suspicious behavior patterns
 */
export const getDeviceFingerprint = async (): Promise<string> => {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
    navigator.hardwareConcurrency || '',
    navigator.platform || ''
    // Removed deviceMemory as it's not supported in all browsers
  ];
  
  // Use SubtleCrypto for secure hashing
  const msgBuffer = new TextEncoder().encode(components.join('###'));
  
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('Fingerprinting error:', err);
    return components.join('').slice(0, 32); // Fallback
  }
};
