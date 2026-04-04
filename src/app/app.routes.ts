import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guards';
import { Login } from './components/login/login.component';
import { Dashboard } from './components/dashboard/dashboard.component';
import { MainLayout } from './layouts/main-layout/main-layout';
import { ExpenseNew } from './components/expense-new/expense-new';
import { ExpenseList } from './components/expense-list/expense-list.component';
import { ExpenseNewType } from './components/expense-type-new/expense-type-new';
import { ExpenseTypeList } from './components/expense-type-list/expense-type-list.component';
import { RevenueNew } from './components/revenue-new/revenue-new';
import { RevenueList } from './components/revenue/revenue-list.component';
import { RevenueNewType } from './components/revenue-type-new/revenue-type-new';
import { RevenueTypeList } from './components/revenue-type-list/revenue-type-list.component';
import { ExpenseGroupsNew } from './components/expense-groups-new/expense-groups-new';
import { ExpenseGroupsListComponent } from './components/expense-groups-list/expense-groups-list.component';
import { RevenueGroupsNew } from './components/revenue-groups-new/revenue-groups-new';
import { RevenueGroupsListComponent } from './components/revenue-groups-list/revenue-groups-list.component';

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
      { path: 'expense/list', component: ExpenseList},
      { path: 'expense/newType', component: ExpenseNewType },
      { path: 'expense/listType', component: ExpenseTypeList },
      { path: 'expense/newGroup', component: ExpenseGroupsNew },
      { path: 'expense/listGroup', component: ExpenseGroupsListComponent },
      { path: 'revenue/new', component: RevenueNew},
      { path: 'revenue/list', component: RevenueList},
      { path: 'revenue/newType', component: RevenueNewType },
      { path: 'revenue/listType', component: RevenueTypeList },
      { path: 'revenue/newGroup', component: RevenueGroupsNew },
      { path: 'revenue/listGroup', component: RevenueGroupsListComponent },
      { path: 'revenue/listType', component: RevenueTypeList }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
