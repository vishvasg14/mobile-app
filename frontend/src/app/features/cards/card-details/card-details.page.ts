import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';

import { CardService } from '../../../core/services/card.service';
import { PageShellComponent } from '../../../shared/components';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [IonicModule, CommonModule, PageShellComponent],
  templateUrl: './card-details.page.html',
  styleUrls: ['./card-details.page.scss'],
})
export class CardDetailsPage implements OnInit {
  card: any;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService,
    private toastCtrl: ToastController,
  ) {}

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
      next: (res) => {
        this.card = res.responseObject || null;
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

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
