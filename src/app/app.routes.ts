import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'juego/:nivel',
    loadComponent: () => import('./pages/juego/juego.page').then( m => m.JuegoPage)
  },
  {
    path: 'ranking',
    loadComponent: () => import('./pages/ranking/ranking.page').then( m => m.RankingPage)
  },
];
