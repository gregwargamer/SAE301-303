import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { DashboardService } from '../services/dashboard-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements AfterViewInit {
  @ViewChild('pie') pie!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bar') bar!: ElementRef<HTMLCanvasElement>;

  constructor(private dashboardService: DashboardService) {}

  ngAfterViewInit() {
    this.dashboardService.getCategories().subscribe((data) => {
      // graphique camembert
      new Chart(this.pie.nativeElement, {
        type: 'pie',
        data: {
          labels: data.map(d => d.categorie),
          datasets: [{ data: data.map(d => d.total) }]
        }
      });

      // graphique barres
      new Chart(this.bar.nativeElement, {
        type: 'bar',
        data: {
          labels: data.map(d => d.categorie),
          datasets: [{ label: 'Produits', data: data.map(d => d.total) }]
        }
      });
    });
  }
}
