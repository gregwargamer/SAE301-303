import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  firstname = '';
  lastname = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private http: HttpClient) {}

  // inscription
  register(): void {
    if (!this.firstname || !this.lastname || !this.email || !this.password) {
      this.errorMessage = 'rempli tous les champs';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http
      .post<{ response?: string; error?: string }>(
        'http://localhost/td3/sushi_box/api/user/add_user.php',
        {
          firstname: this.firstname,
          lastname: this.lastname,
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
