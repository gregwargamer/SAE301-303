import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CartItem, PanierService } from '../services/panier.service';

@Component({
  selector: 'app-panier-component',
  imports: [CommonModule, RouterLink],
  templateUrl: './panier-component.html',
  styleUrl: './panier-component.css',
})
export class PanierComponent implements OnInit, OnDestroy {
  panier: CartItem[] = [];
  subtotal = 0;
  reductionEtudiant = 0;
  reduction100 = 0;
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
      next: (response: any) => {//ouais ouais tg stp je veux pas d'erreurs
        this.panier = response.items; 
        this.subtotal = response.subtotal || 0;
        this.reductionEtudiant = response.reductionEtudiant || 0;
        this.reduction100 = response.reduction100 || 0;
        this.total = response.total || 0;
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
        this.errorMessage = 'maximum de 10 boxes';
      },
    });
  }

  // panier en localstorage 
  validerPanier(): void {
    if (this.panier.length > 0) {
      const cartData = {
        items: this.panier,
        total: this.total,
        date: new Date().toISOString()
      };
      localStorage.setItem('dernier_panier_valide', JSON.stringify(cartData));
      this.router.navigate(['/commander']);
    }
  }
}