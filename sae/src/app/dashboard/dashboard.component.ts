import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js/auto';
import { DashboardService, RevenueData, Stats } from '../services/dashboard-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('pie') pie!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bar') bar!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart') revenueChart!: ElementRef<HTMLCanvasElement>;

  // Stats
  stats: Stats | null = null;
  statsLoading = true;

  // Date actuelle
  currentDate: Date = new Date();
  private dateInterval: any;

  // Revenue data
  revenueData: RevenueData | null = null;
  selectedYear: number = new Date().getFullYear();
  availableYears: number[] = [];
  revenueLoading = false;
  private revenueChartInstance: Chart | null = null;

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
    // Mettre à jour la date toutes les minutes
    this.dateInterval = setInterval(() => {
      this.currentDate = new Date();
    }, 60000);

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

    // Charger les données de revenue
    this.loadRevenue();
  }

  ngOnDestroy() {
    if (this.dateInterval) {
      clearInterval(this.dateInterval);
    }
    if (this.revenueChartInstance) {
      this.revenueChartInstance.destroy();
    }
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

    // Créer le graphique revenue si les données sont déjà chargées
    if (this.revenueData) {
      this.createRevenueChart();
    }
  }

  private createRevenueChart() {
    if (!this.revenueData || !this.revenueChart?.nativeElement) return;

    if (this.revenueChartInstance) {
      this.revenueChartInstance.destroy();
    }

    this.revenueChartInstance = new Chart(this.revenueChart.nativeElement, {
      type: 'line',
      data: {
        labels: this.revenueData.data.map(d => d.label),
        datasets: [{
          label: 'Chiffre d\'affaires (€)',
          data: this.revenueData.data.map(d => d.chiffre_affaires),
          borderColor: '#E8722A',
          backgroundColor: 'rgba(232, 114, 42, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#E8722A',
          pointBorderColor: '#1A1A1A',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#9CA3AF',
              font: {
                family: "'Inter', sans-serif",
                size: 10
              },
              maxRotation: 45,
              minRotation: 45
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
              },
              callback: function(value) {
                return value + ' €';
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            titleColor: '#E8722A',
            bodyColor: '#F5EDE8',
            borderColor: 'rgba(232, 114, 42, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const value = context.parsed.y ?? 0;
                return value.toFixed(2) + ' €';
              }
            }
          }
        }
      }
    });
  }

  // Formater la date pour l'affichage
  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  }

  // Formater l'heure pour l'affichage
  formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleTimeString('fr-FR', options);
  }

  // Charger les données de revenue pour une année
  loadRevenue(year?: number): void {
    this.revenueLoading = true;
    const targetYear = year ?? this.selectedYear;
    
    this.dashboardService.getRevenue(targetYear).subscribe({
      next: (data) => {
        this.revenueData = data;
        this.selectedYear = data.year;
        this.availableYears = data.available_years;
        this.revenueLoading = false;
        if (this.revenueChart?.nativeElement) {
          this.createRevenueChart();
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des revenus:', err);
        this.revenueLoading = false;
      }
    });
  }

  // Changer l'année sélectionnée
  changeYear(year: number): void {
    if (year !== this.selectedYear) {
      this.selectedYear = year;
      this.loadRevenue(year);
    }
  }
}
