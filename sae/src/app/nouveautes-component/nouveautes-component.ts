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
  selector: 'app-nouveautes-component',
  imports: [RouterLink, CommonModule],
  templateUrl: './nouveautes-component.html',
  styleUrl: './nouveautes-component.css',
})
export class NouveautesComponent implements OnInit {
  nouveautes: Box[] = [];

  constructor(private restApiService: RestApiService) { }

  ngOnInit(): void {
    // Récupère les 6 derniers produits ajoutés (nouveautés)
    this.restApiService.getNouveautes(6).subscribe((data: Box[]) => {
      this.nouveautes = data;
    });
  }
}
