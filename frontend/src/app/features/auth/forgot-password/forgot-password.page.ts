import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
    forgotForm: FormGroup;
    loading = false;
    error = '';
    success = false;
    showPassword = false;
    showConfirmPassword = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private auth: AuthService,
    ) {
        this.forgotForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(group: FormGroup) {
        const newPassword = group.get('newPassword')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return newPassword === confirmPassword ? null : { passwordMismatch: true };
    }

    get f() {
        return this.forgotForm.controls;
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPassword() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    submit() {
        if (this.forgotForm.invalid) {
            this.forgotForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        this.error = '';
        this.success = false;

        const { email, newPassword } = this.forgotForm.value;

        this.auth.resetPassword({ email, password: newPassword }).subscribe({
            next: (res) => {
                this.loading = false;
                if (res.responseCode === 200) {
                    this.success = true;
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 3000);
                } else {
                    this.error = res.responseMessage || 'Reset failed';
                }
            },
            error: () => {
                this.loading = false;
                this.error = 'Something went wrong';
            },
        });
    }

    backToLogin() {
        this.router.navigate(['/login']);
    }
}
