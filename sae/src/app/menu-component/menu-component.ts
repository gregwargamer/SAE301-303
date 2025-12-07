import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { PanierService } from '../services/panier.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Box {
  id: string;
  name: string;
  pieces: string;
  price: number;
  foods: Array<{ name: string; quantity: string }>;
  flavors: string[];
}

@Component({
  selector: 'app-menu-component',
  imports: [CommonModule],
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.css',
})
export class MenuComponent implements OnInit {
  boxes: Box[] = [];

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
}