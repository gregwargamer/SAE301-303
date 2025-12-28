import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-passercommande',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './passercommande.html',
  styleUrl: './passercommande.css',
})
export class Passercommande implements OnInit {
  form: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private config: ConfigService,
    private auth: AuthService
  ) {
    // initialisation du formulaire
    this.form = this.fb.group({
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      code_postal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      ville: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // verification connexion
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
  }

  // envoi de la commande
  passerCommande(): void {
    if (this.form.invalid) {
      this.error = 'veuillez remplir tous les champs correctement';
      return;
    }

    this.loading = true;
    this.error = '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth.getToken()}`
    });

    this.http.post(this.config.commanderUrl, this.form.value, { headers })
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          // redirection vers confirmation avec id commande
          this.router.navigate(['/confirmation'], { 
            queryParams: { id: response.commande_id } 
          });
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || 'erreur lors de la commande';
        }
      });
  }
}
