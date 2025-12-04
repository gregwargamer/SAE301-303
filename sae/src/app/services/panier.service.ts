import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost/td3/sushi_box/api/panier/index.php';

  constructor(private http: HttpClient) {}

  // recupere tout le panier
  getPanier(): Observable<ListResponse> {
    return this.http.get<ListResponse>(this.apiUrl);
  }

  // ajoute une box
  addItem(boxId: number | string, quantite = 1): Observable<ListResponse> {
    return this.http.post<ListResponse>(this.apiUrl, { boxId, quantite });
  }

  // retire une box
  removeItem(boxId: number | string): Observable<ListResponse> {
    return this.http.request<ListResponse>('DELETE', this.apiUrl, {
      body: { boxId },
    });
  }

  // force une quantite
  setQuantity(boxId: number | string, quantite: number): Observable<ListResponse> {
    return this.http.put<ListResponse>(this.apiUrl, { boxId, quantite });
  }
}