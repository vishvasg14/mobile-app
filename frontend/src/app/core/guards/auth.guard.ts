import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../auth/token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const token = tokenService.get();

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
