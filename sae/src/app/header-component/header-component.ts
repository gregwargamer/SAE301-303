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
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // toggle menu mobile
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // ferme le menu mobile
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // verifie si l utilisateur est connecte
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // deconnexion
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMenu();
  }

  // recupere le prenom utilisateur
  getUsername(): string {
    return this.authService.getFirstname();
  }
}
