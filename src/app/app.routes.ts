import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Forgot } from './features/auth/forgot/forgot';
import { List } from './features/catalog/list/list';
import { Detail } from './features/catalog/detail/detail';
import { Cart } from './features/cart/cart';
import { Submit } from './features/custom/submit/submit';
import { Dashboard } from './features/orders/dashboard/dashboard';
import { Support } from './features/support/support/support';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },
  { path: 'auth/forgot', component: Forgot },
  { path: 'catalog', component: List },
  { path: 'catalog/:id', component: Detail },
  { path: 'cart', component: Cart },
  { path: 'custom', component: Submit },
  { path: 'orders', component: Dashboard },
  { path: 'support', component: Support },
  { path: '**', redirectTo: '' }
];