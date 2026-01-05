import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  selector: 'app-product-component',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-component.html',
  styleUrl: './product-component.css',
})
export class ProductComponent implements OnInit {
  product: Box | null = null;
  loading = true;
  error = '';
  quantity = 1;
  showConfirmation = false;
  showError = false;
  errorMessage = '';
  similarProducts: Box[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restApiService: RestApiService,
    private panierService: PanierService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Écouter les changements de paramètres dans l'URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loading = true;
        this.error = '';
        this.quantity = 1;
        this.loadProduct(id);
        this.loadSimilarProducts();
      } else {
        this.error = 'ID produit non trouvé';
        this.loading = false;
      }
    });
  }

  loadProduct(id: string): void {
    this.restApiService.getProduct(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.product = response.data;
        } else {
          this.error = response.error || 'Produit non trouvé';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement du produit';
        this.loading = false;
      }
    });
  }

  loadSimilarProducts(): void {
    this.restApiService.getProducts().subscribe({
      next: (products) => {
        // Prend 3 produits aléatoires différents du produit actuel
        const currentId = this.route.snapshot.paramMap.get('id');
        this.similarProducts = products
          .filter((p: Box) => p.id !== currentId)
          .slice(0, 3);
      }
    });
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Ajoute la quantité sélectionnée au panier
    for (let i = 0; i < this.quantity; i++) {
      this.panierService.addItem(this.product.id).subscribe({
        next: () => {
          if (i === this.quantity - 1) {
            this.showConfirmation = true;
            setTimeout(() => {
              this.showConfirmation = false;
            }, 3000);
          }
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
            setTimeout(() => {
              this.showError = false;
            }, 3000);
          }
        }
      });
    }
  }
}
