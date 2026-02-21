import { Injectable } from '@angular/core';
import { CurrentUserService } from '../auth/current-user.service';
import {
  CardLocalIndexService,
  CardLocalIndexEntry,
  SyncStatus,
} from './card-local-index.service';
import { SecureDeviceStorageService } from './secure-device-storage.service';

interface CardImagePayload {
  mimeType: string;
  base64: string;
}

@Injectable({ providedIn: 'root' })
export class CardImageVaultService {
  constructor(
    private currentUser: CurrentUserService,
    private secureStorage: SecureDeviceStorageService,
    private cardIndex: CardLocalIndexService,
  ) {}

  async saveCardImage(
    cardId: string,
    base64: string,
    mimeType: string,
    syncStatus: SyncStatus = 'synced',
  ): Promise<void> {
    const userId = this.currentUser.getUserId();
    if (!userId || !cardId || !base64) {
      return;
    }

    const localImageKey = this.getImageKey(cardId);
    await this.secureStorage.putEncrypted(userId, localImageKey, {
      mimeType,
      base64,
    });

    const entry: CardLocalIndexEntry = {
      id: this.cardIndex.composeId(userId, cardId),
      userId,
      cardId,
      localImageKey,
      syncStatus,
      updatedAt: Date.now(),
    };
    await this.cardIndex.upsert(entry);
  }

  async getCardImage(cardId: string): Promise<CardImagePayload | null> {
    const userId = this.currentUser.getUserId();
    if (!userId || !cardId) {
      return null;
    }
    const localImageKey = this.getImageKey(cardId);
    return this.secureStorage.getDecrypted<CardImagePayload>(userId, localImageKey);
  }

  async markSyncStatus(cardId: string, syncStatus: SyncStatus): Promise<void> {
    const userId = this.currentUser.getUserId();
    if (!userId || !cardId) {
      return;
    }
    await this.cardIndex.markSyncStatus(userId, cardId, syncStatus);
  }

  async listCurrentUserIndex(): Promise<CardLocalIndexEntry[]> {
    const userId = this.currentUser.getUserId();
    if (!userId) {
      return [];
    }
    return this.cardIndex.listByUser(userId);
  }

  private getImageKey(cardId: string): string {
    return `card-image:${cardId}`;
  }
}
