import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // verifie si lutilisateur est connecte
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token; 
  }

  // recupere le token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // deconnexion
  logout(): void {
    localStorage.removeItem('auth_token');
  }
}


