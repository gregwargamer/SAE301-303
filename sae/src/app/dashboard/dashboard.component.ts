import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js/auto';
import { DashboardService, Stats } from '../services/dashboard-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, AfterViewInit {
  @ViewChild('pie') pie!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bar') bar!: ElementRef<HTMLCanvasElement>;

  // Stats
  stats: Stats | null = null;
  statsLoading = true;

  // Palette de couleurs du thème
  private chartColors = [
    '#E8722A', // Orange principal
    '#D35F1A', // Orange foncé
    '#F5EDE8', // Crème
    '#FF9F5A', // Orange clair
    '#2A2A2A', // Gris foncé
    '#6B7280', // Gris
    '#B85A1F', // Orange terre
    '#9CA3AF', // Gris clair
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // Charger les statistiques
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.statsLoading = false;
      },
      error: () => {
        this.statsLoading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dashboardService.getCategories().subscribe((data) => {
      // Options communes pour les graphiques
      const commonOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#F5EDE8',
              font: {
                family: "'Inter', sans-serif",
                size: 12,
                weight: 500
              },
              padding: 16
            }
          },
          tooltip: {
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            titleColor: '#E8722A',
            bodyColor: '#F5EDE8',
            borderColor: 'rgba(232, 114, 42, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: {
              family: "'Inter', sans-serif",
              size: 14,
              weight: 600
            },
            bodyFont: {
              family: "'Inter', sans-serif",
              size: 13
            }
          }
        }
      };

      // Graphique camembert
      new Chart(this.pie.nativeElement, {
        type: 'pie',
        data: {
          labels: data.map(d => d.categorie),
          datasets: [{
            data: data.map(d => d.total),
            backgroundColor: this.chartColors,
            borderColor: '#1A1A1A',
            borderWidth: 2,
            hoverBorderColor: '#F5EDE8',
            hoverBorderWidth: 3
          }]
        },
        options: {
          ...commonOptions,
          plugins: {
            ...commonOptions.plugins,
            legend: {
              position: 'bottom',
              labels: {
                color: '#F5EDE8',
                font: {
                  family: "'Inter', sans-serif",
                  size: 11
                },
                padding: 12,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          }
        }
      });

      // Graphique barres
      new Chart(this.bar.nativeElement, {
        type: 'bar',
        data: {
          labels: data.map(d => d.categorie),
          datasets: [{
            label: 'Produits',
            data: data.map(d => d.total),
            backgroundColor: this.chartColors.map(c => c + 'CC'), // 80% opacity
            borderColor: this.chartColors,
            borderWidth: 2,
            borderRadius: 8,
            hoverBackgroundColor: this.chartColors
          }]
        },
        options: {
          ...commonOptions,
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)'
              },
              ticks: {
                color: '#9CA3AF',
                font: {
                  family: "'Inter', sans-serif",
                  size: 11
                }
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)'
              },
              ticks: {
                color: '#9CA3AF',
                font: {
                  family: "'Inter', sans-serif",
                  size: 11
                }
              }
            }
          },
          plugins: {
            ...commonOptions.plugins,
            legend: {
              display: false
            }
          }
        }
      });
    });
  }
}
