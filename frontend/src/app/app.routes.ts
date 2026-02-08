import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.page').then((m) => m.LoginPage),
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
