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
    localStorage.removeItem('user_firstname');
    localStorage.removeItem('user_lastname');
  }

  // recupere le prenom
  getFirstname(): string {
    return localStorage.getItem('user_firstname') || '';
  }

  // recupere le nom
  getLastname(): string {
    return localStorage.getItem('user_lastname') || '';
  }
}


