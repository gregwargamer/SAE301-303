import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PanierService } from '../services/panier.service';
import { RestApiService } from '../services/rest-api.service';

interface Box {
  id: string;
  name: string;
  pieces: string;
  price: number;
  lien_image?: string;
  description?: string;
  foods: Array<{ name: string; quantity: string }>;
  flavors: string[];
}

@Component({
  selector: 'app-menu-component',
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.css',
})
export class MenuComponent implements OnInit {
  boxes: Box[] = [];
  showConfirmation = false;

  constructor(
    private restApiService: RestApiService,
    private panierService: PanierService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.restApiService.getProducts().subscribe((data) => {
      this.boxes = data;
    });
  }

  addToCart(box: Box) {
    // verifie si lutilisateur est connecte
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.panierService.addItem(box.id).subscribe({
      next: () => {
        // article ajoute au panier
      },
      error: (error) => {
        // si 401 redirige vers login
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
      },
    });
  }

  addToCartAndReservation(box: Box) {
    // verifie si lutilisateur est connecte
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Ajoute au panier
    this.panierService.addItem(box.id).subscribe({
      next: () => {
        // Affiche le message de confirmation
        this.showConfirmation = true;

        // Cache le message après 3 secondes
        setTimeout(() => {
          this.showConfirmation = false;
        }, 3000);
      },
      error: (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return;
        }
        console.error('Erreur lors de l\'ajout au panier', error);
      },
    });
  }
}