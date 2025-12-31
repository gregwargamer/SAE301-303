import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface Stats {
  totalUsers: number;
  totalStudents: number;
  studentPercentage: number;
  avgCart: number;
  totalOrders: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api: string;

  constructor(private http: HttpClient, private config: ConfigService) {
    this.api = `${this.config.apiBase}/dashboard/index.php`;
  }

  getCategories() {
    return this.http.get<any[]>(`${this.api}?action=categories`);
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.config.apiBase}/stats/index.php`);
  }
}