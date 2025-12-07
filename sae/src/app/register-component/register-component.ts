import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  firstname = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private http: HttpClient) {}

  // inscription
  register(): void {
    if (!this.firstname || !this.email || !this.password) {
      this.errorMessage = 'rempli tous les champs';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'les mots de passe ne correspondent pas';
      return;
    }


    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http
      .post<{ response?: string; error?: string }>(
        'http://localhost/sitevassil/Sans%20titre/SAE301-303/sushi_box/api/user/add_user.php',
        {
          firstname: this.firstname,
          email: this.email,
          password: this.password,
        }
      )
      .subscribe({
        next: (response) => {
          if (response.response === 'user created') {
            this.successMessage = 'compte cree avec succes';
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
