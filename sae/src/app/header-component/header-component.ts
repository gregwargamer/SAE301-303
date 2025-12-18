import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink, RouterLinkActive, CommonModule],
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

  // recupere le prenom utilisateur
  getUsername(): string {
    return this.authService.getFirstname();
  }
}
