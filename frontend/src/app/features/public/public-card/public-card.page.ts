import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import {
  AppButtonComponent,
  PageShellComponent,
} from '../../../shared/components';

@Component({
  selector: 'app-public-card',
  standalone: true,
  imports: [IonicModule, CommonModule, PageShellComponent, AppButtonComponent],
  templateUrl: './public-card.page.html',
  styleUrls: ['./public-card.page.scss'],
})
export class PublicCardPage implements OnInit {
  card: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
    this.loadCard(code!);
  }

  loadCard(code: string) {
    this.api.get(`/public/${code}`).subscribe({
      next: (res: any) => {
        this.card = res.responseObject;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
