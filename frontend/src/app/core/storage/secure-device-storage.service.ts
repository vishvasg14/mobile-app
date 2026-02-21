import { Injectable } from '@angular/core';

interface SecureRecord {
  id: string;
  cipherText: string;
  iv: string;
  fallbackPlainText?: string;
  updatedAt: number;
}

@Injectable({ providedIn: 'root' })
export class SecureDeviceStorageService {
  private dbName = 'mobile_card_secure_v1';
  private storeName = 'secure_records';

  async putEncrypted(
    userId: string,
    key: string,
    payload: Record<string, any>,
  ): Promise<void> {
    const id = `${userId}:${key}`;
    const serialized = JSON.stringify(payload);

    if (!crypto?.subtle) {
      await this.putRecord({
        id,
        cipherText: '',
        iv: '',
        fallbackPlainText: serialized,
        updatedAt: Date.now(),
      });
      return;
    }

    const encryptionKey = await this.deriveKey(userId);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(serialized);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      encoded,
    );

    await this.putRecord({
      id,
      cipherText: this.arrayBufferToBase64(encrypted),
      iv: this.arrayBufferToBase64(iv.buffer),
      updatedAt: Date.now(),
    });
  }

  async getDecrypted<T>(
    userId: string,
    key: string,
  ): Promise<T | null> {
    const id = `${userId}:${key}`;
    const record = await this.getRecord(id);
    if (!record) {
      return null;
    }

    if (record.fallbackPlainText) {
      return JSON.parse(record.fallbackPlainText) as T;
    }

    if (!crypto?.subtle || !record.cipherText || !record.iv) {
      return null;
    }

    try {
      const encryptionKey = await this.deriveKey(userId);
      const cipher = this.base64ToArrayBuffer(record.cipherText);
      const iv = new Uint8Array(this.base64ToArrayBuffer(record.iv));
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        encryptionKey,
        cipher,
      );
      return JSON.parse(new TextDecoder().decode(decrypted)) as T;
    } catch {
      return null;
    }
  }

  async remove(userId: string, key: string): Promise<void> {
    const id = `${userId}:${key}`;
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private async deriveKey(userId: string): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(`${userId}|mobile-card-key-v1`),
      'PBKDF2',
      false,
      ['deriveKey'],
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('mobile-card-salt-v1'),
        iterations: 120000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  private async putRecord(record: SecureRecord): Promise<void> {
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private async getRecord(id: string): Promise<SecureRecord | null> {
    const db = await this.openDb();
    return new Promise<SecureRecord | null>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve((req.result as SecureRecord) || null);
      req.onerror = () => reject(req.error);
    });
  }

  private async openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
