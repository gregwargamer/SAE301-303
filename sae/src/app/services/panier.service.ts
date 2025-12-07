import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface CartItem {
  id: number;
  box_id: number;
  quantite: number;
  prix_unitaire: number;
  name: string;
  pieces: string;
  current_price: number;
}

interface ListResponse {
  items: CartItem[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class PanierService {
  private apiUrl = 'http://localhost/sitevassil/Sans%20titre/SAE301-303/sushi_box/api/panier/index.php';
  private panierRefresh$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // met a jour le panier
  getPanierRefresh(): Observable<void> {
    return this.panierRefresh$.asObservable();
  }

  // cree les headers avec le token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // recupere tout le panier
  getPanier(): Observable<ListResponse> {
    return this.http.get<ListResponse>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  // ajoute une box
  addItem(boxId: number | string, quantite = 1): Observable<ListResponse> {
    return this.http.post<ListResponse>(
      this.apiUrl,
      { boxId, quantite },
      { headers: this.getHeaders() } //verifie que il y a un token
    ).pipe(
      tap(() => this.panierRefresh$.next())
    );
  }

  // retire une box
  removeItem(boxId: number | string): Observable<ListResponse> {
    return this.http.request<ListResponse>('DELETE', this.apiUrl, {
      body: { boxId },
      headers: this.getHeaders(), //verifie que il y a un token encore
    }).pipe(
      tap(() => this.panierRefresh$.next())
    );
  }

  // force une quantite
  setQuantity(boxId: number | string, quantite: number): Observable<ListResponse> {
    return this.http.put<ListResponse>( //fait fonctionenr le plus moins jsp merci stackoverflow
      this.apiUrl,
      { boxId, quantite },
      { headers: this.getHeaders() } //verifie que il y a un token encore encore (peut etre que cest trop mais bon on verra bien)
    ).pipe(
      tap(() => this.panierRefresh$.next())
    );
  }
}