import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.api = `${this.config.apiBase}/dashboard/index.php`;
  }

  getCategories() {
    return this.http.get<any[]>(`${this.api}?action=categories`);
  }
}