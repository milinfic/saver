import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';
import { Login } from './components/login/login.component';
import { Dashboard } from './components/dashboard/dashboard.component';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Customers } from './components/customers/customers';

export const routes: Routes = [
  // Login
  { path: 'login',component: Login },

  // Área protegida
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      
      { path: 'dashboard', component: Dashboard },
      { path: 'customers/new', component: Customers }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
