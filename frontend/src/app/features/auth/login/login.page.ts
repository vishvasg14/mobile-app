import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { TokenService } from '../../../core/auth/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private token: TokenService,
    private router: Router,
  ) {}

  login() {
    this.loading = true;
    this.error = '';

    this.auth
      .login({
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;

          if (res.responseCode !== 200) {
            this.error = res.responseMessage;
            return;
          }

          this.token.set(res.responseObject.token);
          this.router.navigate(['/cards']);
        },
        error: () => {
          this.loading = false;
          this.error = 'Something went wrong';
        },
      });
  }
}
