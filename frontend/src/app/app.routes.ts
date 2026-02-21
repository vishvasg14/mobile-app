import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'forgot',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.page').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.page').then(
        (m) => m.RegisterPage,
      ),
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./features/admin/admin-login/admin-login.page').then(
        (m) => m.AdminLoginPage,
      ),
  },
  {
    path: 'cards',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cards/card-list/card-list.page').then(
        (m) => m.CardListPage,
      ),
  },
  {
    path: 'cards/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/cards/card-details/card-details.page').then(
        (m) => m.CardDetailsPage,
      ),
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/dashboard/admin-dashboard.page').then(
        (m) => m.AdminDashboardPage,
      ),
  },
  {
    path: 'public/:code',
    loadComponent: () =>
      import('./features/public/public-card/public-card.page').then(
        (m) => m.PublicCardPage,
      ),
  },

  {
    path: '',
    redirectTo: 'cards',
    pathMatch: 'full',
  },
  {
    path: 'public-card',
    loadComponent: () =>
      import('./features/public/public-card/public-card.page').then(
        (m) => m.PublicCardPage,
      ),
  },
];
