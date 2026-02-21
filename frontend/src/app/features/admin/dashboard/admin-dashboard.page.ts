import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

import {
  AdminMonitorService,
  InteractionDashboard,
} from 'src/app/core/services/admin-monitor.service';
import { PageShellComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [IonicModule, CommonModule, PageShellComponent],
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit, OnDestroy {
  data: InteractionDashboard | null = null;
  loading = false;
  sinceHours = 24;
  private refreshSub?: Subscription;

  constructor(
    private adminMonitor: AdminMonitorService,
    private router: Router,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    this.loadDashboard();
    this.refreshSub = interval(5000).subscribe(() => this.loadDashboard(false));
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  loadDashboard(showLoader = true) {
    if (showLoader) {
      this.loading = true;
    }
    this.adminMonitor.getDashboard(this.sinceHours, 50).subscribe({
      next: (res) => {
        this.data = res.responseObject || null;
        this.loading = false;
      },
      error: async () => {
        this.loading = false;
        await this.showToast('Failed to load admin dashboard');
      },
    });
  }

  onWindowChange(hours: number) {
    this.sinceHours = hours;
    this.loadDashboard();
  }

  backToCards() {
    this.router.navigate(['/cards']);
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 1800,
      position: 'bottom',
    });
    toast.present();
  }
}
