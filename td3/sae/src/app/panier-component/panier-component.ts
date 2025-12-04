import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanierService, CartItem } from '../services/panier.service';

@Component({
  selector: 'app-panier-component',
  imports: [CommonModule],
  templateUrl: './panier-component.html',
  styleUrl: './panier-component.css',
})
export class PanierComponent implements OnInit {
  panier: CartItem[] = [];
  total = 0;
  loading = false;
  errorMessage = '';

  constructor(private panierService: PanierService) {}

  ngOnInit(): void {
    this.loadPanier();
  }

  // charge le panier
  loadPanier(): void {
    this.loading = true;
    this.panierService.getPanier().subscribe({
      next: (response) => {
        this.panier = response.items;
        this.total = this.getTotal();
        this.loading = false;
        this.errorMessage = '';
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'erreur lors du chargement';
      },
    });
  }

  // addition simple
  getTotal(): number {
    let totalTemp = 0;
    this.panier.forEach((item) => {
      totalTemp += item.prix_unitaire * item.quantite;
    });
    return totalTemp;
  }

  // supprime une ligne puis recharge
  removeItem(item: CartItem): void {
    this.panierService.removeItem(item.box_id).subscribe({
      next: () => this.loadPanier(),
      error: () => (this.errorMessage = 'erreur suppression'),
    });
  }

  // ajuste la quantite petit a petit
  updateQuantity(item: CartItem, delta: number): void {
    const nouvelleQuantite = item.quantite + delta;
    if (nouvelleQuantite <= 0) {
      this.removeItem(item);
      return;
    }
    this.panierService.setQuantity(item.box_id, nouvelleQuantite).subscribe({
      next: () => this.loadPanier(),
      error: () => (this.errorMessage = 'erreur mise a jour'),
    });
  }
}