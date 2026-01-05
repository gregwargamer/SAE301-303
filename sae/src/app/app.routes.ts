import { Routes } from '@angular/router';
import { ConfirmationComponent } from './confirmation/confirmation';
import { Dashboard } from './dashboard/dashboard.component';
import { HomeComponent } from './home-component/home-component';
import { LoginComponent } from './login-component/login-component';
import { MenuComponent } from './menu-component/menu-component';
import { NouveautesComponent } from './nouveautes-component/nouveautes-component';
import { PanierComponent } from './panier-component/panier-component';
import { Passercommande } from './passercommande/passercommande';
import { PolitiqueRgpdComponent } from './politique-rgpd/politique-rgpd';
import { ProductComponent } from './product-component/product-component';
import { RegisterComponent } from './register-component/register-component';
import { AccountComponent } from './account-component/account-component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'carte',
    component: MenuComponent,
  },
  {
    path: 'produit/:id',
    component: ProductComponent,
  },
  {
    path: 'nouveautes',
    component: NouveautesComponent,
  },
  {
    path: 'panier',
    component: PanierComponent,
  },
  {
    path: 'commander',
    component: Passercommande,
  },
  {
    path: 'confirmation',
    component: ConfirmationComponent,
  },
  {
    path: 'politique-rgpd',
    component: PolitiqueRgpdComponent,
  },
  {
    path: 'mon-compte',
    component: AccountComponent,
  },
  {
    path: 'dashboard',
    component: Dashboard,
  },
];

