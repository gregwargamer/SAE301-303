import { Component } from '@angular/core';
import { MenuComponent } from '../menu-component/menu-component';
import { PanierComponent } from '../panier-component/panier-component';
import { CommandeComponent } from '../commande-component/commande-component';

@Component({
  selector: 'app-home-component',
  imports: [MenuComponent, PanierComponent, CommandeComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {}
