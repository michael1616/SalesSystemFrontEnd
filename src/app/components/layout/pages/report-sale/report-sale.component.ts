import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Report } from 'src/app/interfaces/report';
import { SaleService } from 'src/app/services/sale.service';
import { UtilityService } from 'src/app/services/utility.service';
import { MatSort } from '@angular/material/sort';
import { FormatDatePipe } from 'src/app/services/format-date.pipe';
import { Permissions } from 'src/app/interfaces/enums/permissions';
import { PermissionService } from 'src/app/services/permission.service';
import { CookieService } from 'ngx-cookie-service';

export const MAT_DATA_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY'
  },
  display: {
    dateInput: 'MMMM DD YYYY',
    monthYearLabel: 'MMMM-YYYY'
  }
}

@Component({
  selector: 'app-report-sale',
  templateUrl: './report-sale.component.html',
  styleUrls: ['./report-sale.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MAT_DATA_FORMATS }, FormatDatePipe]
})
export class ReportSaleComponent implements AfterViewInit {

  form: FormGroup;
  hasPermissionExport: boolean = false;

  SaleReportList: Report[] = [];
  columnsTable: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalVentas'];

  dataSaleReport = new MatTableDataSource(this.SaleReportList);

  @ViewChild(MatPaginator) paginationTable!: MatPaginator;
  @ViewChild(MatSort) sortTable!: MatSort;

  constructor(private fb: FormBuilder,
    private _saleService: SaleService, private _utlityService: UtilityService,
    private _formDataPipe: FormatDatePipe, private _permissionService: PermissionService,
    private cookieService: CookieService) {

    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    },
      {
        validators: [validateDates()]
      });

      this.hasPermission();

  }

  ngAfterViewInit(): void {
    this.dataSaleReport.paginator = this.paginationTable;
    this.dataSaleReport.sort = this.sortTable;
  }


  searcSales(): void {

    let startDate: string = this._formDataPipe.transform(this.form.get('startDate')?.value as Date);
    let endDate: string = this._formDataPipe.transform(this.form.get('endDate')?.value as Date);

    if (startDate == 'Invalid date' || endDate == 'Invalid date') {

      this._utlityService.showAlert('Invalid Dates', 'Error');
      return;
    }

    this._saleService.getReport(startDate, endDate, Permissions.REPORT_SALE_MODULE, Permissions.REPORT_SALE_MODULE).subscribe({
      next: (data) => {

        if (data.isExitoso) {
          this.dataSaleReport.data = data.resultado;
          this.SaleReportList = data.resultado;
        }
      },
      error: (data) => {

        if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
          this._utlityService.showAlert('Error internal server', 'Error');
        } else {
          this._utlityService.showAlert('Something was wrong', 'Error');
        }

        this.dataSaleReport.data = [];
        this.SaleReportList = [];

      }
    });

  }


  exportToExcel(): void {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.SaleReportList);

    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'Report_Sale.xlsx');
  }

  hasPermission(): void {

    let idRol: string = this._utlityService.decrypt(this.cookieService.get('idRol'));
    let action: string = Permissions[Permissions.REPORT_SALE_EXPORT];


    this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
       Permissions.PERMISSION).subscribe({
        next: (data) => {

          if (data.isExitoso) {
            this.hasPermissionExport = data.resultado;
          }
        },
        error: (data) => {

          if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
            this._utlityService.showAlert('Error internal server', 'Error');
          } else {
            this._utlityService.showAlert('Something was wrong', 'Error');
          }

          this.hasPermissionExport = false;
        }
      });

  }

}


function validateDates(): ValidatorFn {

  return (controls: AbstractControl) => {

    let startDate = controls.get('startDate');
    let endDate = controls.get('endDate');

    if ((startDate?.value == undefined || startDate?.value == '') &&
      (endDate?.value == undefined || endDate?.value == '')) {

      controls.get('startDate')?.setErrors({ 'ErrorRequiredEndDate': 'StartDate is required' });
      controls.get('endDate')?.setErrors({ 'ErrorRequiredEndDate': 'EndDate is required' });

      return { 'ErrorRequiredDates': 'Dates are required' };
    }

    if (endDate?.value < startDate?.value) {
      return { 'ErrorInvalidDates': 'EndDate cannot be less than StartDate' };
    }

    return null;
  }
}