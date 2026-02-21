import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';

import { CardService } from '../../../core/services/card.service';
import { CardImageVaultService } from '../../../core/storage/card-image-vault.service';
import { CloudSyncHookService } from '../../../core/sync/cloud-sync-hook.service';
import { PageShellComponent } from '../../../shared/components';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, PageShellComponent],
  templateUrl: './card-details.page.html',
  styleUrls: ['./card-details.page.scss'],
})
export class CardDetailsPage implements OnInit {
  card: any;
  cardForm: FormGroup;
  loading = false;
  saving = false;
  imageSrc = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cardService: CardService,
    private toastCtrl: ToastController,
    private imageVault: CardImageVaultService,
    private cloudSyncHooks: CloudSyncHookService,
  ) {
    this.cardForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      category: ['General'],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/cards']);
      return;
    }
    this.loadCard(id);
  }

  loadCard(id: string) {
    this.loading = true;
    this.cardService.getCard(id).subscribe({
      next: async (res) => {
        this.card = res.responseObject || null;
        if (this.card) {
          this.cardForm.patchValue({
            name: this.card.name || '',
            email: this.card.email || '',
            phone: this.card.phone || '',
            company: this.card.company || '',
            category: this.card.category || 'General',
          });

          const localImage = await this.imageVault.getCardImage(this.card._id);
          if (localImage?.base64) {
            this.imageSrc = `data:${localImage.mimeType};base64,${localImage.base64}`;
          } else if (this.card.imageBase64) {
            const mimeType = this.card.imageMimeType || 'image/jpeg';
            this.imageSrc = `data:${mimeType};base64,${this.card.imageBase64}`;
            await this.imageVault.saveCardImage(
              this.card._id,
              this.card.imageBase64,
              mimeType,
            );
          } else {
            this.imageSrc = '';
          }
        }
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        await this.showToast('Failed to load card details');
        this.router.navigate(['/cards']);
      },
    });
  }

  back() {
    this.router.navigate(['/cards']);
  }

  get f() {
    return this.cardForm.controls;
  }

  saveChanges() {
    if (!this.card?._id) {
      return;
    }
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    this.saving = true;

    const payload = {
      name: (this.cardForm.value.name || '').trim(),
      email: (this.cardForm.value.email || '').trim(),
      phone: (this.cardForm.value.phone || '').trim(),
      company: (this.cardForm.value.company || '').trim(),
      category: (this.cardForm.value.category || '').trim() || 'General',
    };

    this.cardService.updateCard(this.card._id, payload).subscribe({
      next: async (res: any) => {
        this.saving = false;
        this.card = res.responseObject || { ...this.card, ...payload };
        this.cardForm.patchValue({
          name: this.card.name || '',
          email: this.card.email || '',
          phone: this.card.phone || '',
          company: this.card.company || '',
          category: this.card.category || 'General',
        });
        await this.cloudSyncHooks.onCardMetadataUpdated(this.card._id);
        await this.showToast('Card updated');
      },
      error: async () => {
        this.saving = false;
        await this.showToast('Failed to update card');
      },
    });
  }

  getCardImageSrc() {
    return this.imageSrc;
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
