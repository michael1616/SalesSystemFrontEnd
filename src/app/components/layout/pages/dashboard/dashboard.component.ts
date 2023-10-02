import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Permissions } from 'src/app/interfaces/enums/permissions';
import { CookieService } from 'ngx-cookie-service';
import { PermissionService } from 'src/app/services/permission.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  totalIncome: number = 0;
  totalSales: number = 0;
  totalProducts: number = 0;
  hasPermissionGraphic: boolean = false;
  hasPermissionTotal: boolean = false;

  constructor(private _dashboardService: DashboardService, private _utlityService: UtilityService,
    private cookieService: CookieService, private _permissionService: PermissionService) { }


  ngOnInit(): void {

    this.permissionTotals();
    this.permissionGraphic();
    this.getDashboardGraphic();
    this.getDashboardTotals();

  }

  showGraphic(labelGraphic: any[], dataGraphic: any[]): void {

    const chartBar = new Chart('charBar', {
      type: 'bar',
      data: {
        labels: labelGraphic,
        datasets: [{
          label: '# Sales',
          data: dataGraphic,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  }


  getDashboardGraphic(): void {

    this._dashboardService.getDashboardGraphic(Permissions.DASH_BOARD_MODULE, Permissions.DASH_BOARD_GRAPHIC).subscribe({
      next: (data) => {

        if (data.isExitoso) {
          const DATA: any[] = data.resultado.ventasUltimaSemana;
          
          const LABEL_TEMP = DATA.map((value) => value.fecha);
          const DATA_TEMP = DATA.map((value) => value.total);

          this.showGraphic(LABEL_TEMP, DATA_TEMP);
        }
      },
      error: (data) => {

        if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
          this._utlityService.showAlert('Error internal server', 'Error');
        } else {
          this._utlityService.showAlert('Something was wrong', 'Error');
        }

      }
    });

  }


  getDashboardTotals(): void {

    this._dashboardService.getDashboardTotals(Permissions.DASH_BOARD_MODULE, Permissions.DASH_BOARD_TOTALS).subscribe({
      next: (data) => {

        if (data.isExitoso) {

          this.totalIncome = data.resultado.totalIngresos;
          this.totalProducts = data.resultado.totalProductos;
          this.totalSales = data.resultado.totalVentas;

        }
      },
      error: (data) => {

        if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
          this._utlityService.showAlert('Error internal server', 'Error');
        } else {
          this._utlityService.showAlert('Something was wrong', 'Error');
        }

      }
    });

  }
  


  permissionGraphic(): void {

    let idRol: string = this._utlityService.decrypt(this.cookieService.get('idRol'));
    let action: string = Permissions[Permissions.DASH_BOARD_GRAPHIC];


    this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
       Permissions.PERMISSION).subscribe({
        next: (data) => {

          if (data.isExitoso) {
            this.hasPermissionGraphic = data.resultado;
          }
        },
        error: (data) => {

          if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
            this._utlityService.showAlert('Error internal server', 'Error');
          } else {
            this._utlityService.showAlert('Something was wrong', 'Error');
          }

          this.hasPermissionGraphic = false;
        }
      });

  }


  permissionTotals(): void {

    let idRol: string = this._utlityService.decrypt(this.cookieService.get('idRol'));
    let action: string = Permissions[Permissions.DASH_BOARD_TOTALS];


    this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
       Permissions.PERMISSION).subscribe({
        next: (data) => {

          if (data.isExitoso) {
            this.hasPermissionTotal = data.resultado;
          }
        },
        error: (data) => {

          if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
            this._utlityService.showAlert('Error internal server', 'Error');
          } else {
            this._utlityService.showAlert('Something was wrong', 'Error');
          }

          this.hasPermissionTotal = false;
        }
      });

  }

}
