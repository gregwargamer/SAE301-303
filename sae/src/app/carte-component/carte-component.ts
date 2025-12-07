import { Component } from '@angular/core';
import { CommandeComponent } from '../commande-component/commande-component';
import { MenuComponent } from '../menu-component/menu-component';
import { PanierComponent } from '../panier-component/panier-component';

@Component({
  selector: 'app-carte-component',
  imports: [MenuComponent, PanierComponent, CommandeComponent],
  templateUrl: './carte-component.html',
  styleUrl: './carte-component.css',
})
export class CarteComponent {}
