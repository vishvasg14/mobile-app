import { Injectable } from '@angular/core';

export type SyncStatus =
  | 'local_only'
  | 'pending_upload'
  | 'synced'
  | 'pending_metadata_sync';

export interface CardLocalIndexEntry {
  id: string;
  userId: string;
  cardId: string;
  localImageKey: string;
  syncStatus: SyncStatus;
  updatedAt: number;
}

@Injectable({ providedIn: 'root' })
export class CardLocalIndexService {
  private dbName = 'mobile_card_secure_v1';
  private storeName = 'card_index';

  async upsert(entry: CardLocalIndexEntry): Promise<void> {
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(entry);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getByCard(userId: string, cardId: string): Promise<CardLocalIndexEntry | null> {
    const id = this.composeId(userId, cardId);
    const db = await this.openDb();
    return new Promise<CardLocalIndexEntry | null>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.get(id);
      req.onsuccess = () => resolve((req.result as CardLocalIndexEntry) || null);
      req.onerror = () => reject(req.error);
    });
  }

  async markSyncStatus(
    userId: string,
    cardId: string,
    syncStatus: SyncStatus,
  ): Promise<void> {
    const current = await this.getByCard(userId, cardId);
    if (!current) {
      return;
    }
    await this.upsert({
      ...current,
      syncStatus,
      updatedAt: Date.now(),
    });
  }

  async listByUser(userId: string): Promise<CardLocalIndexEntry[]> {
    const db = await this.openDb();
    return new Promise<CardLocalIndexEntry[]>((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.getAll();
      req.onsuccess = () => {
        const rows = ((req.result as CardLocalIndexEntry[]) || []).filter(
          (row) => row.userId === userId,
        );
        resolve(rows);
      };
      req.onerror = () => reject(req.error);
    });
  }

  composeId(userId: string, cardId: string): string {
    return `${userId}:${cardId}`;
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
}
