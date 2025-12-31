import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  selector: 'app-home-component',
  imports: [RouterLink, CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  nouveautes: Box[] = [];
  bestSellers: Box[] = [];

  constructor(private restApiService: RestApiService) { }

  ngOnInit(): void {
    // Récupère les 3 derniers produits ajoutés (nouveautés)
    this.restApiService.getNouveautes(3).subscribe((data: Box[]) => {
      this.nouveautes = data;
    });

    // Récupère les 3 produits les plus ajoutés au panier (best-sellers)
    this.restApiService.getBestSellers().subscribe((data: Box[]) => {
      this.bestSellers = data;
    });
  }
}
