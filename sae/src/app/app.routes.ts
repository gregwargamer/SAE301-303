import { Routes } from '@angular/router';
import { CarteComponent } from './carte-component/carte-component';
import { HomeComponent } from './home-component/home-component';
import { LoginComponent } from './login-component/login-component';
import { NouveautesComponent } from './nouveautes-component/nouveautes-component';
import { RegisterComponent } from './register-component/register-component';
import { ReservationsComponent } from './reservations-component/reservations-component';

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
    component: CarteComponent,
  },
  {
    path: 'nouveautes',
    component: NouveautesComponent,
  },
  {
    path: 'reservations',
    component: ReservationsComponent,
  },
];
