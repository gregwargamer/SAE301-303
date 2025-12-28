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
    // 3 premieres nouveautes parce que jsp je vais pas daté les ajouts dans la db... 
    this.restApiService.getProducts().subscribe((data: Box[]) => {
      this.nouveautes = data.slice(0, 6);
    });
  }
}
