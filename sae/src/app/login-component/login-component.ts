import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  // connexion
  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'rempli tous les champs';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.http
      .post<{ success: boolean; token?: string; user_id?: number; firstname?: string; lastname?: string; error?: string }>(
        this.config.loginUrl,
        {
          email: this.email,
          password: this.password,
        }
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.token) {
            localStorage.setItem('auth_token', response.token);
            if (response.user_id) {
              localStorage.setItem('user_id', response.user_id.toString());
            }
            if (response.firstname) {
              localStorage.setItem('user_firstname', response.firstname);
            }
            if (response.lastname) {
              localStorage.setItem('user_lastname', response.lastname);
            }
            window.location.href = '/';
          } else {
            this.errorMessage = response.error || 'erreur de connexion';
            this.loading = false;
          }
        },
        error: (error) => {
          this.errorMessage =
            error.error?.error || 'erreur lors de la connexion';
          this.loading = false;
        },
      });
  }
}
