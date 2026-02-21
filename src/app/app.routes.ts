import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';
import { Login } from './components/login/login.component';
import { Dashboard } from './components/dashboard/dashboard.component';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  // Login
  { path: 'login',component: Login },

  // Área protegida
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard }
    ]
  },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];
