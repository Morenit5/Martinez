import { inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ClientEntity } from '@app/@core/entities/Client.entity';
import { ServiceEntity } from '@app/@core/entities/Service.entity';
import { ClientService } from '@app/@core/services/Client.service';
import { ServicesInstances } from '@app/@core/services/Services.service';
import { TranslateModule } from '@ngx-translate/core';
import Chart, { ChartType } from 'chart.js/auto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {

  chart: any = [];
  chartService: any = [];
  clientList: Observable<ClientEntity[]> | undefined;
  clientService: ClientService = inject(ClientService);
  clients: ClientEntity[] = [];
  datasetsClientType: number[] = [];
  datasetsClientXMonth: number[] = [];
  evClient: number[] = [];
  fixClient: number[] = [];;
  valorEC: number;
  valorFC: number;
  isReady: boolean = false;
  eventualClient: any;
  fixedClient: any;
  months: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'];
  numericMonths: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  serviceList: ServiceEntity[] = [];
  service: ServiceEntity;
  quantityService: number[] = [];

  constructor(private readonly serviceInstance: ServicesInstances) {
    this.getAllDataClients();
    this.getAllServicesIntances();
  }

  ngOnInit() { } // Termino del OnInit

  printPie() {
    this.chartService = new Chart('canvasService', {
      type: 'doughnut',
      data: {
        labels: this.months,
        datasets: [{
          label: 'Servicios del mes',
          data: this.quantityService,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgba(54, 238, 21, 1)',
            'rgba(255, 171, 3, 1)',
            'rgba(235, 54, 175, 1)',
            'rgba(0, 21, 255, 1)',
            'rgba(254, 40, 76, 1)',
            'rgba(187, 255, 0, 1)',
            'rgba(8, 255, 230, 1)',
            'rgba(54, 235, 120, 1)',
            'rgba(130, 131, 133, 1)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Servicios por Mes'
          }
        }
      }
    });
  }// termino de PrintPie

  printChart() {
    //  Crear el gráfico
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: this.months,
        datasets: [
          {
            label: 'Eventuales',
            data: this.evClient,
            backgroundColor: 'rgba(209, 119, 8, 0.8)',
            borderRadius: 5
          }, {
            label: 'Fijos',
            data: this.fixClient,
            backgroundColor: 'rgba(105, 218, 39, 0.8)',
            borderRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Clientes Fijos y Eventuales por Mes'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }

  getAllServicesIntances() {
    this.serviceInstance.getAllServices().subscribe({
      next: (servList) => {
        this.serviceList = servList;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.getServiceXMonth();
        this.printPie();
      }
    });
  }

  getServiceXMonth() {
    this.numericMonths.forEach((n: number) => {
      const searchResults: ServiceEntity[] = this.serviceList.filter(item => {
        const itemDate = item.serviceDate instanceof Date ? item.serviceDate : new Date(item.serviceDate);
        return itemDate.getMonth() + 1 == n;
      });
      this.quantityService.push(searchResults.length > 0 ? searchResults.length : 0);
    });
    this.isReady = true;
  }

  getClientTypes() {
    // 1. Usa filter() para obtener solo los usuarios activos
    this.eventualClient = this.clients.filter(client => client.clientType === 'Eventual');
    this.fixedClient = this.clients.filter(client => client.clientType === 'Fijo');
    this.valorEC = this.eventualClient.length;
    this.valorFC = this.fixedClient.length;
    this.getClientEventual();
    this.getClientFixed();
  }

  getClientDates() {
    this.numericMonths.forEach((n: number) => {
      const searchResults: ClientEntity[] = this.clients.filter(item => {
        const itemDate = item.registryDate instanceof Date ? item.registryDate : new Date(item.registryDate);
        return itemDate.getMonth() + 1 == n;
      });
      this.datasetsClientXMonth.push(searchResults.length > 0 ? searchResults.length : 0);
    });
    this.isReady = true;
  }

  getClientEventual() {
    this.numericMonths.forEach((n: number) => {
      const searchResults: ClientEntity[] = this.eventualClient.filter(item => {
        const itemDate = item.registryDate instanceof Date ? item.registryDate : new Date(item.registryDate);
        return itemDate.getMonth() + 1 == n;
      });
      this.evClient.push(searchResults.length > 0 ? searchResults.length : 0);
    });
    this.isReady = true;
  }

  getClientFixed() {
    this.numericMonths.forEach((n: number) => {
      const searchResults: ClientEntity[] = this.fixedClient.filter(item => {
        const itemDate = item.registryDate instanceof Date ? item.registryDate : new Date(item.registryDate);
        return itemDate.getMonth() + 1 == n;
      });
      this.fixClient.push(searchResults.length > 0 ? searchResults.length : 0);
    });
    this.isReady = true;
  }

  getAllDataClients() {
    this.clientService.fetchData1().subscribe({
      next: (clientsList) => {
        this.clients = clientsList;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.getClientTypes();
        this.getClientDates();
        this.printChart();
      }
    });
  }
}
