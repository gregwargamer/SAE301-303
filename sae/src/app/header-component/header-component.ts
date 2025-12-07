import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink, CommonModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // verifie si l utilisateur est connecte
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // deconnexion
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
