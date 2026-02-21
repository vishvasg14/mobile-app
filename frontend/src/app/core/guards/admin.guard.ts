import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../auth/token.service';
import { CurrentUserService } from '../auth/current-user.service';

export const adminGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const currentUser = inject(CurrentUserService);
  const router = inject(Router);

  const token = tokenService.get();
  if (!token) {
    router.navigate(['/admin-login']);
    return false;
  }

  if (currentUser.getRole() !== 'ADMIN') {
    router.navigate(['/cards']);
    return false;
  }

  return true;
};
