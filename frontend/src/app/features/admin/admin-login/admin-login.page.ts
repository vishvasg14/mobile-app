import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AuthService } from 'src/app/core/auth/auth.service';
import { TokenService } from 'src/app/core/auth/token.service';
import { CurrentUserService } from 'src/app/core/auth/current-user.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
})
export class AdminLoginPage {
  loginForm: FormGroup;
  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private tokenService: TokenService,
    private currentUser: CurrentUserService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;
    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.responseCode !== 200) {
          this.error = res.responseMessage || 'Admin authentication failed';
          return;
        }

        const token = res.responseObject?.token;
        if (!token) {
          this.error = 'Invalid server response';
          return;
        }

        this.tokenService.set(token);
        if (this.currentUser.getRole() !== 'ADMIN') {
          this.tokenService.clear();
          this.error = 'Admin access required';
          return;
        }

        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Something went wrong';
      },
    });
  }
}
