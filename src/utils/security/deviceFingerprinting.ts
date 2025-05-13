
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
