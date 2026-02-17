import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';
import { Login } from './components/login/login.component';
import { Dashboard } from './components/dashboard/dashboard.component';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  // Layout de autenticação (login)
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login }
    ]
  },

  // Layout principal (protegido)
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard }
    ]
  },

  // Redirecionamentos
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
