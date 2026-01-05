import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ConfigService } from '../services/config.service';

interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  etudiant?: number;
  api_token?: string;
  created_at?: string;
  telephone?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  cookie?: number | null;
  newsletter?: number;
}

interface Order {
  id: number;
  utilisateur_id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  total: number;
  status_commande: string;
  date_commande: string;
  details?: OrderDetail[];
}

interface OrderDetail {
  id: number;
  commande_id: number;
  id_box: number;
  quantite: number;
  box_name: string;
  price: number;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-component.html',
  styleUrls: ['./account-component.css']
})
export class AccountComponent implements OnInit {
  userData: UserData | null = null;
  orders: Order[] = [];
  isEditMode = false;
  showDeleteConfirm = false;
  showLogoutButton = true;
  
  // Données d'édition
  editData: Partial<UserData> = {};
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserData();
    this.loadOrders();
  }

  loadUserData(): void {
    const token = this.authService.getToken();
    console.log('🔑 Token:', token);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    console.log('📡 Appel API profile...');
    this.http.get<UserData>(`${this.configService.apiBase}/user/profile.php`, { headers })
      .subscribe({
        next: (data) => {
          console.log('✅ Données reçues:', data);
          this.userData = data;
          this.editData = { ...data };
        },
        error: (error) => {
          console.error('❌ Erreur lors du chargement des données:', error);
          console.error('Détails:', error.message, error.status);
        }
      });
  }

  loadOrders(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    console.log('📦 Chargement des commandes...');
    this.http.get<Order[]>(`${this.configService.apiBase}/order/list.php`, { headers })
      .subscribe({
        next: (data) => {
          console.log('✅ Commandes reçues:', data);
          console.log('Nombre de commandes:', data.length);
          this.orders = data;
        },
        error: (error) => {
          console.error('❌ Erreur lors du chargement des commandes:', error);
          this.orders = [];
        }
      });
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      // Sauvegarder les modifications
      this.saveChanges();
    } else {
      this.isEditMode = true;
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editData = { ...this.userData };
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  saveChanges(): void {
    // Vérifier les mots de passe si on veut les changer
    if (this.newPassword || this.confirmPassword) {
      if (!this.oldPassword) {
        alert('Vous devez entrer votre ancien mot de passe pour en définir un nouveau');
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        alert('Les nouveaux mots de passe ne correspondent pas');
        return;
      }
      if (this.newPassword.length < 6) {
        alert('Le nouveau mot de passe doit contenir au moins 6 caractères');
        return;
      }
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    
    const dataToUpdate: any = { ...this.editData };
    if (this.newPassword && this.oldPassword) {
      dataToUpdate.old_password = this.oldPassword;
      dataToUpdate.new_password = this.newPassword;
    }
    
    this.http.put(`${this.configService.apiBase}/user/update.php`, dataToUpdate, { headers })
      .subscribe({
        next: () => {
          this.userData = { ...this.userData, ...this.editData } as UserData;
          this.isEditMode = false;
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          alert('Modifications enregistrées avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde:', error);
          if (error.status === 401) {
            alert('Ancien mot de passe incorrect');
          } else {
            alert('Erreur lors de la sauvegarde des modifications');
          }
        }
      });
  }

  toggleCookie(): void {
    const newValue = this.editData.cookie === 1 ? 0 : 1;
    this.editData.cookie = newValue;
    this.updateCookiePreference(newValue);
  }

  toggleNewsletter(): void {
    const newValue = this.editData.newsletter === 1 ? 0 : 1;
    this.editData.newsletter = newValue;
    this.updateNewsletterPreference(newValue);
  }

  updateCookiePreference(value: number): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    
    this.http.post(`${this.configService.apiBase}/user/update-cookie.php`, 
      { cookie: value }, 
      { headers }
    ).subscribe({
      next: () => {
        if (this.userData) {
          this.userData.cookie = value;
        }
      },
      error: (error) => console.error('Erreur mise à jour cookies:', error)
    });
  }

  updateNewsletterPreference(value: number): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    
    this.http.put(`${this.configService.apiBase}/user/update.php`, 
      { newsletter: value }, 
      { headers }
    ).subscribe({
      next: () => {
        if (this.userData) {
          this.userData.newsletter = value;
        }
      },
      error: (error) => console.error('Erreur mise à jour newsletter:', error)
    });
  }

  showDeletePopup(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  confirmDelete(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.delete(`${this.configService.apiBase}/user/delete.php`, { headers })
      .subscribe({
        next: () => {
          alert('Votre compte a été supprimé');
          this.authService.logout();
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du compte');
        }
      });
  }

  exportData(): void {
    if (!this.userData) return;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
    
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mes Données - Eishi</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            background: white;
            color: black;
          }
          h1 {
            font-family: 'Playfair Display', serif;
            color: #252525;
            margin-bottom: 30px;
          }
          .data-line {
            margin: 15px 0;
            font-size: 16px;
          }
          .data-line strong {
            display: inline-block;
            width: 150px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>Données</h1>
        <div class="data-line"><strong>Prénom :</strong> ${this.userData.firstname || 'Non renseigné'}</div>
        <div class="data-line"><strong>Nom :</strong> ${this.userData.lastname || 'Non renseigné'}</div>
        <div class="data-line"><strong>Email :</strong> ${this.userData.email || 'Non renseigné'}</div>
        <div class="data-line"><strong>Mot de passe :</strong> ••••••••</div>
        <div class="data-line"><strong>Étudiant :</strong> ${this.userData.etudiant ? 'Oui' : 'Non'}</div>
      </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
