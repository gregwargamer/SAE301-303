import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError, of } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

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
  private readonly MAX_ITEMS = 10;
  private currentTotal = 0;
  private apiUrl: string;
  private panierRefresh$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private config: ConfigService
  ) {
    this.apiUrl = this.config.panierUrl;
  }

  // met a jour le panier
  getPanierRefresh(): Observable<void> {
    return this.panierRefresh$.asObservable();
  }

  // cree les headers avec le token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('X-Auth-Token', token).set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // recupere tout le panier
  getPanier(): Observable<ListResponse> {
    return this.http.get<ListResponse>(this.apiUrl, {
      headers: this.getHeaders(),
    }).pipe(
      tap(res => {
        // calcule total articles dans panier
        this.currentTotal = res.items.reduce((sum, item) => sum + item.quantite, 0);
      })
    );
  }

  // ajoute une box
  addItem(boxId: number | string, quantite = 1): Observable<ListResponse> {
    if (this.currentTotal + quantite > this.MAX_ITEMS) {
      return throwError(() => new Error('panier plein (max 10 articles)'));
    }
    return this.http.post<ListResponse>(
      this.apiUrl,
      { boxId, quantite },
      { headers: this.getHeaders() } //verifie que il y a un token
    ).pipe(
      tap(res => {
        this.currentTotal = res.items.reduce((sum, item) => sum + item.quantite, 0);
        this.panierRefresh$.next();
      })
    );
  }

  // retire une box
  removeItem(boxId: number | string): Observable<ListResponse> {
    return this.http.request<ListResponse>('DELETE', this.apiUrl, {
      body: { boxId },
      headers: this.getHeaders(), //verifie que il y a un token encore
    }).pipe(
      tap(res => {
        this.currentTotal = res.items.reduce((sum, item) => sum + item.quantite, 0);
        this.panierRefresh$.next();
      })
    );
  }

  // force une quantite
  setQuantity(boxId: number | string, quantite: number): Observable<ListResponse> {
    return this.http.put<ListResponse>( //fait fonctionenr le plus moins jsp merci stackoverflow
      this.apiUrl,
      { boxId, quantite },
      { headers: this.getHeaders() } //verifie que il y a un token encore encore (peut etre que cest trop mais bon on verra bien)
    ).pipe(
      switchMap(res => {
        // calcule nouveau total
        const newTotal = res.items.reduce((sum, item) => sum + item.quantite, 0);
        // verifie si - de 10
        if (newTotal > this.MAX_ITEMS) {
          return throwError(() => new Error('panier plein (max 10 articles)'));
        }
        return of(res);
      }),
      tap(res => {
        // met a jour le total et envoie la reponse pour mettre a jour 
        this.currentTotal = res.items.reduce((sum, item) => sum + item.quantite, 0);
        this.panierRefresh$.next();
      })
    );
  }
}