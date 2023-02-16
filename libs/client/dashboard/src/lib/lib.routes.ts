import { Route } from '@angular/router';

export const clientDashboardRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'my-chats',
    pathMatch: 'full'
  },
  {
    path: 'my-chats',
    loadComponent: () => import('./my-chat/my-chat.component').then(m => m.MyChatComponent),
    title : 'Chats'
  },
  {
    path: 'friend-list',
    loadComponent: () => import('./friend-list/friend-list.component').then(m => m.FriendListComponent),
    title : 'Friend List'
  },
  {
    path: 'find-friend',
    loadComponent: () => import('./find-friend/find-friend.component').then(m => m.FindFriendComponent),
    title : 'Find Friends'
  },
  {
    path: 'reset-password',
    loadComponent: () => import('@client/auth').then(m => m.ResetPasswordComponent),
    title : 'Reset Password'
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    title : 'Edit Profile'
  }
];
