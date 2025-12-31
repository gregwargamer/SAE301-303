import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.css',
})
export class MenuComponent implements OnInit {
  boxes: Box[] = [];
  searchTerm: string = '';
  showConfirmation = false;
  showError = false;
  errorMessage = '';

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

  // Getter pour filtrer les boxes en temps réel
  get filteredBoxes(): Box[] {
    if (!this.searchTerm.trim()) {
      return this.boxes;
    }
    const term = this.searchTerm.toLowerCase().trim();
    return this.boxes.filter(box => 
      box.name.toLowerCase().includes(term) ||
      (box.description && box.description.toLowerCase().includes(term))
    );
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
        // affiche l'erreur si le panier est plein
        if (error.message && error.message.includes('panier plein')) {
          this.errorMessage = 'maximum de 10 boxes';
          this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 3000);
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
        // affiche l'erreur si le panier est plein
        if (error.message && error.message.includes('panier plein')) {
          this.errorMessage = 'maximum de 10 boxes';
          this.showError = true;
        }
      },
    });
  }
}