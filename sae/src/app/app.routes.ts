import { Routes } from '@angular/router';
import { MenuComponent } from './menu-component/menu-component';
import { HomeComponent } from './home-component/home-component';
import { LoginComponent } from './login-component/login-component';
import { NouveautesComponent } from './nouveautes-component/nouveautes-component';
import { PanierComponent } from './panier-component/panier-component';
import { ProductComponent } from './product-component/product-component';
import { RegisterComponent } from './register-component/register-component';
import { ReservationsComponent } from './reservations-component/reservations-component';
import { Passercommande } from './passercommande/passercommande';
import { ConfirmationComponent } from './confirmation/confirmation';
import { Dashboard } from './dashboard/dashboard.component';
import { PolitiqueRgpdComponent } from './politique-rgpd/politique-rgpd';

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
    path: 'reservations',
    component: ReservationsComponent,
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
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'politique-rgpd',
    component: PolitiqueRgpdComponent,
  },
];

