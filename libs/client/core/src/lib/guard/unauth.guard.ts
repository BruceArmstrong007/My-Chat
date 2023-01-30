import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const unauthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  return authService.isUserLoggedIn() ? router.createUrlTree(['/user']) : true;
};
