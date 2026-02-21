import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActionSheetController,
  AlertController,
  IonicModule,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { CardService } from '../../../core/services/card.service';
import { TokenService } from '../../../core/auth/token.service';
import { CurrentUserService } from '../../../core/auth/current-user.service';
import { ApiService } from '../../../core/services/api.service';
import { CardImageVaultService } from '../../../core/storage/card-image-vault.service';
import { CloudSyncHookService } from '../../../core/sync/cloud-sync-hook.service';
import {
  AppButtonComponent,
  AppFooterComponent,
  PageShellComponent,
} from '../../../shared/components';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    PageShellComponent,
    AppButtonComponent,
    AppFooterComponent,
  ],
  templateUrl: './card-list.page.html',
  styleUrls: ['./card-list.page.scss'],
})
export class CardListPage implements OnInit {
  cards: any[] = [];
  loading = false;
  scanning = false;
  isAdmin = false;
  footerItems = [
    { label: 'Cards', icon: 'albums' },
    { label: 'Scan', icon: 'scan-outline', value: 'scan' },
    { label: 'Logout', icon: 'log-out-outline', value: 'logout' },
  ];

  constructor(
    private cardService: CardService,
    private api: ApiService,
    private tokenService: TokenService,
    private currentUser: CurrentUserService,
    private router: Router,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private imageVault: CardImageVaultService,
    private cloudSyncHooks: CloudSyncHookService,
  ) { }

  ngOnInit() {
    this.isAdmin = this.currentUser.getRole() === 'ADMIN';
    this.loadCards();
  }

  loadCards() {
    this.loading = true;

    this.cardService.getMyCards().subscribe({
      next: (res) => {
        this.cards = res.responseObject || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  async scanCard() {
    try {
      this.scanning = true;

      const image = await Camera.getPhoto({
        source: CameraSource.Camera,
        quality: 80,
        resultType: CameraResultType.Base64,
      });

      if (!image.base64String) {
        this.scanning = false;
        return;
      }

      this.api
        .post('/cards/ocr', {
          imageBase64: image.base64String,
          imageFormat: image.format || 'jpeg',
        })
        .subscribe({
          next: async (res: any) => {
            const createdCard = res?.responseObject;
            if (createdCard?._id && image.base64String) {
              const format = String(image.format || 'jpeg').toLowerCase();
              const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
              await this.imageVault.saveCardImage(
                createdCard._id,
                image.base64String,
                mimeType,
                'pending_upload',
              );
              await this.cloudSyncHooks.onLocalImageSaved(createdCard._id);
              await this.cloudSyncHooks.onCardSynced(createdCard._id);
            }

            this.scanning = false;
            await this.showToast('Card scanned successfully');
            this.loadCards();
          },
          error: async () => {
            this.scanning = false;
            await this.showToast('Failed to scan card');
          },
        });
    } catch {
      this.scanning = false;
    }
  }

  async togglePublic(card: any) {
    this.cardService.togglePublic(card._id).subscribe({
      next: async (res: any) => {
        card.isPublic = res.responseObject.isPublic;
        card.publicCode = res.responseObject.publicCode;

        if (card.isPublic) {
          await this.showToast('Public link enabled');
        } else {
          await this.showToast('Public link disabled');
        }
      },
      error: async () => {
        await this.showToast('Failed to update sharing');
      },
    });
  }

  copyLink(card: any) {
    const link = `${window.location.origin}/public/${card.publicCode}`;
    navigator.clipboard.writeText(link);
    this.showToast('Link copied');
  }

  async openActions(card: any, event?: Event) {
    event?.stopPropagation();

    const buttons: any[] = [
      {
        text: 'View',
        handler: () => this.viewCard(card),
      },
      {
        text: 'Edit details',
        handler: () => this.editCard(card),
      },
      card.isPublic
        ? {
          text: 'Share link',
          handler: () => this.copyLink(card),
        }
        : {
          text: 'Make public',
          handler: () => this.togglePublic(card),
        },
      card.isPublic
        ? {
          text: 'Make private',
          role: 'destructive',
          handler: () => this.togglePublic(card),
        }
        : null,
      {
        text: 'Cancel',
        role: 'cancel',
      },
    ].filter(Boolean);

    const sheet = await this.actionSheetCtrl.create({
      header: card.name || 'Card actions',
      buttons,
    });
    await sheet.present();
  }

  viewCard(card: any) {
    this.router.navigate(['/cards', card._id]);
  }

  async editCard(card: any) {
    const alert = await this.alertCtrl.create({
      header: 'Edit card',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: card.name || '',
          placeholder: 'Name',
        },
        {
          name: 'email',
          type: 'email',
          value: card.email || '',
          placeholder: 'Email',
        },
        {
          name: 'phone',
          type: 'tel',
          value: card.phone || '',
          placeholder: 'Phone',
        },
        {
          name: 'company',
          type: 'text',
          value: card.company || '',
          placeholder: 'Company',
        },
        {
          name: 'category',
          type: 'text',
          value: card.category || '',
          placeholder: 'Category',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            this.cardService.updateCard(card._id, data).subscribe({
              next: async (res: any) => {
                Object.assign(card, res.responseObject || data);
                await this.showToast('Card updated');
              },
              error: async () => {
                await this.showToast('Failed to update card');
              },
            });
          },
        },
      ],
    });
    await alert.present();
  }

  logout() {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }

  openAdminDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  onFooterSelect(item: any) {
    if (item.value === 'scan') {
      this.scanCard();
      return;
    }
    if (item.value === 'logout') {
      this.logout();
    }
  }
}
