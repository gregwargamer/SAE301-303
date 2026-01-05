import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RestApiService } from '../services/rest-api.service';
import { ConfigService } from '../services/config.service';

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
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  nouveautes: Box[] = [];
  bestSellers: Box[] = [];
  
  // Formulaire de contact
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  isSubmitting = false;
  contactMessage = '';
  contactSuccess = false;

  constructor(
    private restApiService: RestApiService,
    private http: HttpClient,
    private config: ConfigService
  ) { }

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

  onSubmitContact(): void {
    if (this.isSubmitting) return;

    // Validation basique
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.subject || !this.contactForm.message) {
      this.contactMessage = 'Veuillez remplir tous les champs.';
      this.contactSuccess = false;
      return;
    }

    this.isSubmitting = true;
    this.contactMessage = '';

    this.http.post(`${this.config.apiBase}/contact/index.php`, this.contactForm)
      .subscribe({
        next: (response: any) => {
          this.contactSuccess = true;
          this.contactMessage = 'Votre message a été envoyé avec succès !';
          // Réinitialiser le formulaire
          this.contactForm = {
            name: '',
            email: '',
            subject: '',
            message: ''
          };
          this.isSubmitting = false;
          
          // Effacer le message après 5 secondes
          setTimeout(() => {
            this.contactMessage = '';
          }, 5000);
        },
        error: (error) => {
          this.contactSuccess = false;
          this.contactMessage = 'Une erreur est survenue. Veuillez réessayer.';
          this.isSubmitting = false;
        }
      });
  }
}
