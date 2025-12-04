import { Component, signal } from '@angular/core';
import { MenuComponent } from './menu-component/menu-component';
import { HeaderComponent } from './header-component/header-component';
import { PanierComponent } from './panier-component/panier-component';
import { CommandeComponent } from './commande-component/commande-component';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, HeaderComponent, PanierComponent, CommandeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-app');
}
