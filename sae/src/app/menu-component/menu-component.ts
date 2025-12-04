import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { PanierService } from '../services/panier.service';
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
    private panierService: PanierService
  ) {}

  ngOnInit(): void {
    this.restApiService.getProducts().subscribe((data) => {
      this.boxes = data;
    });
  }

  addToCart(box: Box) {
    this.panierService.addItem(box.id).subscribe({
      next: () => {
        console.log('Ajoute au panier');
      },
      error: (error) => {
        console.error('Erreur lors de l ajout au panier', error);
      },
    });
  }
}