import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  getProducts(): Observable<any> {
    return this.http.get(this.config.boxesUrl);
  }

  getProduct(id: string): Observable<any> {
    return this.http.get(`${this.config.boxesUrl}/${id}`);
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(this.config.boxesUrl, product);
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.config.boxesUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.config.boxesUrl}/${id}`);
  }
}