import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.css'
})
export class CookieBannerComponent implements OnInit {
  showBanner = false;
  shouldShowBanner = false; // stocke si le banner devrait être affiché

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private config: ConfigService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // vérifier si on est sur la page RGPD dès le départ
    const currentUrl = this.router.url;
    if (currentUrl === '/politique-rgpd') {
      this.showBanner = false;
      this.shouldShowBanner = false;
      return;
    }
    
    this.checkCookieConsent();
    
    // écouter les changements de route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // cacher sur la page RGPD, montrer ailleurs
        if (event.url === '/politique-rgpd') {
          this.showBanner = false;
        } else if (this.shouldShowBanner) {
          this.showBanner = true;
        }
      }
    });
  }

  // vérifie si le popup doit être affiché
  checkCookieConsent(): void {
    // ne JAMAIS afficher sur la page RGPD
    if (this.router.url === '/politique-rgpd') {
      this.showBanner = false;
      this.shouldShowBanner = false;
      return;
    }
    
    // si connecté, vérifier la BDD
    if (this.authService.isAuthenticated()) {
      const userId = this.authService.getUserId();
      const localConsent = localStorage.getItem(`cookieConsent_${userId}`);
      
      // vérifier d'abord le localStorage de CET utilisateur
      if (localConsent === 'accepted' || localConsent === 'refused') {
        this.showBanner = false;
        return;
      }

      // sinon vérifier la BDD
      const token = this.authService.getToken();
      this.http.get<{ cookie: number | null }>(`${this.config.apiBase}/user/cookie-status.php`, {
        headers: { 'X-Auth-Token': token || '', Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (response) => {
          // NULL = pas encore répondu, afficher le popup (sauf sur RGPD)
          if (response.cookie === null && this.router.url !== '/politique-rgpd') {
            this.shouldShowBanner = true;
            this.showBanner = true;
          } else {
            this.shouldShowBanner = false;
            this.showBanner = false;
            // synchroniser avec localStorage
            localStorage.setItem(`cookieConsent_${userId}`, response.cookie === 1 ? 'accepted' : 'refused');
          }
        },
        error: () => {
          // en cas d'erreur, afficher quand même (sauf sur RGPD)
          if (this.router.url !== '/politique-rgpd') {
            this.shouldShowBanner = true;
            this.showBanner = true;
          }
        }
      });
    } else {
      // non connecté : vérifier localStorage général
      const localConsent = localStorage.getItem('cookieConsent_guest');
      
      if (localConsent === 'accepted' || localConsent === 'refused') {
        this.shouldShowBanner = false;
        this.showBanner = false;
      } else {
        // afficher le popup (sauf sur RGPD)
        if (this.router.url !== '/politique-rgpd') {
          this.shouldShowBanner = true;
          this.showBanner = true;
        }
      }
    }
  }

  // accepter les cookies
  acceptCookies(): void {
    if (this.authService.isAuthenticated()) {
      const userId = this.authService.getUserId();
      localStorage.setItem(`cookieConsent_${userId}`, 'accepted');
      
      const token = this.authService.getToken();
      this.http.post(`${this.config.apiBase}/user/update-cookie.php`, 
        { cookie: 1 },
        { headers: { 'X-Auth-Token': token || '', Authorization: `Bearer ${token}` } }
      ).subscribe();
    } else {
      localStorage.setItem('cookieConsent_guest', 'accepted');
    }
    
    this.showBanner = false;
  }

  // refuser les cookies
  refuseCookies(): void {
    if (this.authService.isAuthenticated()) {
      const userId = this.authService.getUserId();
      localStorage.setItem(`cookieConsent_${userId}`, 'refused');
      
      const token = this.authService.getToken();
      this.http.post(`${this.config.apiBase}/user/update-cookie.php`, 
        { cookie: 0 },
        { headers: { 'X-Auth-Token': token || '', Authorization: `Bearer ${token}` } }
      ).subscribe();
    } else {
      localStorage.setItem('cookieConsent_guest', 'refused');
    }
    
    this.showBanner = false;
  }
}
