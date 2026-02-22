import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';
import { Login } from './components/login/login.component';
import { Dashboard } from './components/dashboard/dashboard.component';
import { MainLayout } from './layouts/main-layout/main-layout';
import { ExpenseNew } from './components/expense-new/expense-new';
import { ExpenseNewType } from './components/expense-type-new/expense-type-new';

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
      { path: 'expense/new', component: ExpenseNew},
      { path: 'expense/newType', component: ExpenseNewType },
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
