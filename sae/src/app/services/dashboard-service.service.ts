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

export interface RevenueMonth {
  mois: string;
  label: string;
  chiffre_affaires: number;
  nombre_commandes: number;
}

export interface RevenueData {
  success: boolean;
  year: number;
  available_years: number[];
  data: RevenueMonth[];
  total_revenue: number;
  total_orders: number;
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

  getRevenue(year?: number): Observable<RevenueData> {
    const url = year 
      ? `${this.config.apiBase}/stats/revenue.php?year=${year}`
      : `${this.config.apiBase}/stats/revenue.php`;
    return this.http.get<RevenueData>(url);
  }
}