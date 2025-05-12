
/**
 * Enhanced secure storage utility with encryption
 * Provides a more secure alternative to localStorage for sensitive data
 */

// Constants
const IV_LENGTH = 12; // 12 bytes for GCM mode
const ENCRYPTION_KEY_NAME = 'app_encryption_key';
const STORAGE_PREFIX = 'secure_storage:';

/**
 * Generates or retrieves an encryption key
 */
const getOrCreateEncryptionKey = async (): Promise<CryptoKey> => {
  // Try to get existing key from session storage
  const storedKey = sessionStorage.getItem(ENCRYPTION_KEY_NAME);
  
  if (storedKey) {
    try {
      // Convert from base64 and import key
      const keyData = _base64ToArrayBuffer(storedKey);
      return await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (err) {
      console.error('Failed to restore encryption key:', err);
      // Fall through to create new key
    }
  }
  
  // Generate a new encryption key
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    // Export and store the key
    const exportedKey = await window.crypto.subtle.exportKey('raw', key);
    const keyBase64 = _arrayBufferToBase64(exportedKey);
    sessionStorage.setItem(ENCRYPTION_KEY_NAME, keyBase64);
    
    return key;
  } catch (err) {
    console.error('Failed to generate encryption key:', err);
    throw new Error('Secure storage unavailable - encryption not supported');
  }
};

/**
 * Encrypt data
 */
const encryptData = async (data: string): Promise<string> => {
  try {
    const key = await getOrCreateEncryptionKey();
    
    // Create initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Encrypt the data
    const encodedData = new TextEncoder().encode(data);
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encodedData
    );
    
    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encryptedData), iv.length);
    
    // Convert to base64 for storage
    return _arrayBufferToBase64(result);
  } catch (err) {
    console.error('Encryption failed:', err);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data
 */
const decryptData = async (encryptedBase64: string): Promise<string> => {
  try {
    const key = await getOrCreateEncryptionKey();
    
    // Convert from base64
    const encryptedData = _base64ToArrayBuffer(encryptedBase64);
    
    // Extract IV and ciphertext
    const iv = encryptedData.slice(0, IV_LENGTH);
    const ciphertext = encryptedData.slice(IV_LENGTH);
    
    // Decrypt
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      ciphertext
    );
    
    // Convert to string
    return new TextDecoder().decode(decryptedBuffer);
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Failed to decrypt data');
  }
};

// Helper functions
const _arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const _base64ToArrayBuffer = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Secure storage API with encryption
 */
export const secureStorage = {
  /**
   * Securely store data with encryption
   */
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      const encryptedData = await encryptData(value);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, encryptedData);
    } catch (err) {
      console.error(`Failed to securely store item: ${key}`, err);
      throw err;
    }
  },
  
  /**
   * Retrieve and decrypt data
   */
  getItem: async (key: string): Promise<string | null> => {
    try {
      const encryptedData = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!encryptedData) return null;
      
      return await decryptData(encryptedData);
    } catch (err) {
      console.error(`Failed to retrieve secure item: ${key}`, err);
      return null;
    }
  },
  
  /**
   * Remove secure item
   */
  removeItem: (key: string): void => {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },
  
  /**
   * Clear all secure items
   */
  clear: (): void => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  },
  
  /**
   * Check if secure storage is supported in this browser
   */
  isSupported: (): boolean => {
    return window.crypto && 
           window.crypto.subtle && 
           typeof window.crypto.subtle.encrypt === 'function';
  }
};
