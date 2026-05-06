// Secure storage utilities for sensitive data
// Simple encryption for client-side data protection

export class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'beagvs_secure_key_2024';

  // Simple XOR encryption (for demonstration - use crypto-js in production)
  private static encrypt(text: string): string {
    const key = this.ENCRYPTION_KEY;
    let encrypted = '';
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    return btoa(encrypted); // Base64 encode
  }

  private static decrypt(encrypted: string): string {
    try {
      const text = atob(encrypted); // Base64 decode
      const key = this.ENCRYPTION_KEY;
      let decrypted = '';
      
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
      }
      
      return decrypted;
    } catch (error) {
      console.error('[v0] Decryption failed:', error);
      return '';
    }
  }

  // Secure getItem
  static getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      // Check if it's encrypted (starts with our marker)
      if (encrypted.startsWith('ENC_')) {
        return this.decrypt(encrypted.substring(4));
      }
      
      // Return as-is if not encrypted (backward compatibility)
      return encrypted;
    } catch (error) {
      console.error('[v0] SecureStorage getItem error:', error);
      return null;
    }
  }

  // Secure setItem
  static setItem(key: string, value: string, encrypt: boolean = false): void {
    if (typeof window === 'undefined') return;
    
    try {
      if (encrypt) {
        const encrypted = 'ENC_' + this.encrypt(value);
        localStorage.setItem(key, encrypted);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('[v0] SecureStorage setItem error:', error);
    }
  }

  // Remove item
  static removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  // Hash password (one-way)
  static hashPassword(password: string): string {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `hashed_${Math.abs(hash).toString(36)}_${password.length}`;
  }
}
