import { Route } from '@angular/router';

export const clientAuthRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./landing-page/landing-page.component').then(m => m.LandingPageComponent),
    title : 'My Chat'
   },
   {
     path: 'login',
     loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
     title : 'Login'
   },
   {
     path: 'register',
     loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
     title : 'Register'
   },
   {
     path: 'reset-password',
     loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
     title : 'Reset Password'
   },
];
