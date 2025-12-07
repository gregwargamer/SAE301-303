import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  private apiURL = 'http://localhost/sitevassil/Sans%20titre/SAE301-303/sushi_box/api/boxes/index.php';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(this.apiURL);
  }

  getProduct(id: string): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(this.apiURL, product);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.apiURL}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}