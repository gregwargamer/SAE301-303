import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PanierService, CartItem } from '../services/panier.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-panier-component',
  imports: [CommonModule],
  templateUrl: './panier-component.html',
  styleUrl: './panier-component.css',
})
export class PanierComponent implements OnInit, OnDestroy {
  panier: CartItem[] = [];
  total = 0;
  loading = false;
  errorMessage = '';
  private refreshSubscription?: Subscription;

  constructor(
    private panierService: PanierService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // verifie si l utilisateur est connecte
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadPanier();
    
    // sabonne aux changements du panier pour auto-refresh  (passur que ca marche)
    this.refreshSubscription = this.panierService.getPanierRefresh().subscribe(() => {
      this.loadPanier();
    });
  }

  ngOnDestroy(): void {
    // nettoie la subscription
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
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
      error: (error) => {
        this.loading = false;
        // si erreur 401, redirige vers login
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
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
      next: () => {
      },
      error: (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        this.errorMessage = 'erreur suppression';
      },
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
      next: () => {
      },
      error: (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        this.errorMessage = 'erreur mise a jour';
      },
    });
  }
}