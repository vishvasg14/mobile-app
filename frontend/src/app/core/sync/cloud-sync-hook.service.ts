import { Injectable } from '@angular/core';
import { CardImageVaultService } from '../storage/card-image-vault.service';

@Injectable({ providedIn: 'root' })
export class CloudSyncHookService {
  constructor(private imageVault: CardImageVaultService) {}

  async onLocalImageSaved(cardId: string): Promise<void> {
    await this.imageVault.markSyncStatus(cardId, 'pending_upload');
  }

  async onCardSynced(cardId: string): Promise<void> {
    await this.imageVault.markSyncStatus(cardId, 'synced');
  }

  async onCardMetadataUpdated(cardId: string): Promise<void> {
    await this.imageVault.markSyncStatus(cardId, 'pending_metadata_sync');
  }

  async flushPending(): Promise<void> {
    // Hook for future backend/cloud sync worker integration.
    return;
  }
}
