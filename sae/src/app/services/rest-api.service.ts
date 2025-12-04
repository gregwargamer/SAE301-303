import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  private apiURL = 'http://localhost/td3/sushi_box/api/boxes/index.php';

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