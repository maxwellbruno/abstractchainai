
import DOMPurify from "dompurify";

/**
 * Enhanced DOMPurify configuration for XSS prevention
 */
export const configureDOMPurify = () => {
  // Configure DOMPurify to be more strict
  DOMPurify.setConfig({
    ALLOWED_TAGS: [
      'a', 'b', 'br', 'code', 'div', 'em', 'i', 'li', 'ol', 'p', 'pre', 
      'span', 'strong', 'u', 'ul'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'nonce'
    ],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    FORBID_CONTENTS: ['script', 'style'],
    ADD_ATTR: ['target', 'nonce'], // allow target="_blank" and nonce for CSP
    ADD_URI_SAFE_ATTR: [],
    // Remove prototype pollution vulnerability - set USE_PROFILES explicitly
    USE_PROFILES: { html: true },
    // Prevent nesting-based mXSS vulnerability
    WHOLE_DOCUMENT: false,
    SANITIZE_DOM: true,
    SAFE_FOR_TEMPLATES: true
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
    
    // Add nonce to scripts and styles if they're allowed and CSP_NONCE is available
    if ((node.tagName === 'SCRIPT' || node.tagName === 'STYLE') && window.CSP_NONCE) {
      node.setAttribute('nonce', window.CSP_NONCE);
    }
  });
  
  // Add a hook to prevent nesting-based mXSS attacks
  DOMPurify.addHook('beforeSanitizeElements', (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Check for potentially malicious nesting patterns
      const content = node.textContent || '';
      if (content.includes('<script') || content.includes('<style') || 
          content.includes('<if') || content.includes('<object')) {
        node.textContent = DOMPurify.sanitize(content);
      }
    }
    return node;
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
    SANITIZE_DOM: true,
    SAFE_FOR_TEMPLATES: true
  });
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
 * Create Content Security Policy nonce
 */
export const createCSPNonce = (): string => {
  if (typeof window !== 'undefined' && window.CSP_NONCE) {
    return window.CSP_NONCE;
  }
  
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Add CSP_NONCE to window interface
declare global {
  interface Window {
    CSP_NONCE?: string;
  }
}
