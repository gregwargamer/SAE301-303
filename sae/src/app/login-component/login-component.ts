import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  constructor(private http: HttpClient) {}

  // connexion
  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'rempli tous les champs';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.http
      .post<{ success: boolean; token?: string; error?: string }>(
        'http://localhost/sitevassil/Sans%20titre/SAE301-303/sushi_box/api/user/login.php',
        {
          email: this.email,
          password: this.password,
        }
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.token) {
            localStorage.setItem('auth_token', response.token);
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
