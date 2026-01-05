import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-register-component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  firstname = '';
  lastname = '';
  email = '';
  password = '';
  confirmPassword = '';
  etudiant = false;
  rgpdConsent = false;
  newsletter = false;
  errorMessage = '';
  successMessage = '';
  loading = false;
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  // inscription
  register(): void {
    if (!this.firstname || !this.lastname || !this.email || !this.password) {
      this.errorMessage = 'rempli tous les champs';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'les mots de passe ne correspondent pas';
      return;
    }

    if (!this.rgpdConsent) {
      this.errorMessage = 'vous devez accepter la politique de protection des données';
      return;
    }


    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http
      .post<{ response?: string; error?: string }>(
        this.config.registerUrl,
        {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password,
          etudiant: this.etudiant,
          newsletter: this.newsletter,
        }
      )
      .subscribe({
        next: (response) => {
          if (response.response === 'user created') {
            this.successMessage = 'compte crée avec succes';
            this.loading = false;
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else {
            this.errorMessage = response.error || 'erreur lors de la creation';
            this.loading = false;
          }
        },
        error: (error) => {
          this.errorMessage =
            error.error?.error || 'erreur lors de la creation du compte';
          this.loading = false;
        },
      });
  }
}
