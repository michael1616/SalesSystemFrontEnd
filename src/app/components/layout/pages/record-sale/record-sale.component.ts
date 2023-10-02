import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { SaleDetailModalComponent } from '../../modals/sale-detail-modal/sale-detail-modal.component';
import { UtilityService } from 'src/app/services/utility.service';
import { Sale } from 'src/app/interfaces/sale';
import { MatSort } from '@angular/material/sort';
import { SaleService } from 'src/app/services/sale.service';
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
  selector: 'app-record-sale',
  templateUrl: './record-sale.component.html',
  styleUrls: ['./record-sale.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MAT_DATA_FORMATS }, FormatDatePipe]
})
export class RecordSaleComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  hasPermissionDetail: boolean = false;

  optionsSerach: any[] = [
    { value: 'date', description: 'By date' },
    { value: 'number', description: 'By document number' }
  ];

  columnsTable: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'acciones'];
  initData: Sale[] = [];
  dataSaleList = new MatTableDataSource(this.initData);

  @ViewChild(MatPaginator) paginationTable!: MatPaginator;
  @ViewChild(MatSort) sortTable!: MatSort;

  constructor(private fb: FormBuilder, private matDialog: MatDialog,
    private _saleService: SaleService, private _utlityService: UtilityService,
    private _formDataPipe: FormatDatePipe, private _permissionService: PermissionService,
    private cookieService: CookieService) {

    this.form = this.fb.group({
      searchBy: ['date'],
      number: [''],
      startDate: [''],
      endDate: ['']
    },
      {
        validators: [validateRequired()]
      });


    this.form.get('searchBy')?.valueChanges.subscribe(data => {

      this.dataSaleList.data = [];

    });

    this.form.get('date')?.valueChanges.subscribe(data => {
      this.form.patchValue({
        number: '',
        startDate: '',
        endDate: ''
      });
    });

    this.hasPermission();

  }

  ngAfterViewInit(): void {
    this.dataSaleList.paginator = this.paginationTable;
    this.dataSaleList.sort = this.sortTable;
  }
  ngOnInit(): void {

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSaleList.filter = filterValue.trim().toLocaleLowerCase();
  }


  searchSale(): void {

    let startDate: string;
    let endDate: string;

    let searchBy: string = this.form.get('searchBy')?.value;
    let documentNumber: string = this.form.get('number')?.value;

    if (searchBy == 'date') {

      startDate = this._formDataPipe.transform(this.form.get('startDate')?.value as Date);
      endDate = this._formDataPipe.transform(this.form.get('endDate')?.value as Date);

      if (startDate == 'Invalid date' || endDate == 'Invalid date') {

        this._utlityService.showAlert('Invalid Dates', 'Error');
        return;
      }

    } else {

      startDate = this._formDataPipe.transform(new Date());
      endDate = this._formDataPipe.transform(new Date());

    }


    this._saleService.getRecord(searchBy, documentNumber, startDate, endDate,
      Permissions.RECORD_SALE_MODULE, Permissions.RECORD_SALE_MODULE).subscribe({
        next: (data) => {

          if (data.isExitoso) {
            this.dataSaleList = new MatTableDataSource(data.resultado);
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


  watchSaleDetail(sale: Sale): void {

    this.matDialog.open(SaleDetailModalComponent, {
      data: sale,
      disableClose: true,
      width: '700px'
    });
  }

  hasPermission(): void {

    let idRol: string = this._utlityService.decrypt(this.cookieService.get('idRol'));
    let action: string = Permissions[Permissions.RECORD_SALE_DETAIL];


    this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
       Permissions.PERMISSION).subscribe({
        next: (data) => {

          if (data.isExitoso) {
            this.hasPermissionDetail = data.resultado;
          }
        },
        error: (data) => {

          if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
            this._utlityService.showAlert('Error internal server', 'Error');
          } else {
            this._utlityService.showAlert('Something was wrong', 'Error');
          }

          this.hasPermissionDetail = false;
        }
      });

  }

}


function validateRequired(): ValidatorFn {

  return (controls: AbstractControl) => {

    let searchBy = controls.get('searchBy');

    let number = controls.get('number');
    let startDate = controls.get('startDate');
    let endDate = controls.get('endDate');
    let isValid: boolean = true;


    if (searchBy?.value != undefined || searchBy?.value != '') {

      if (searchBy?.value == 'date') {

        controls.get('number')?.setErrors(null);

        if (startDate?.value == '' || startDate?.value == null) {

          controls.get('startDate')?.setErrors({ 'ErrorRequiredEndDate': 'StartDate is required' });
          isValid = false;
        }

        if (endDate?.value == '' || endDate?.value == null) {

          controls.get('endDate')?.setErrors({ 'ErrorRequiredEndDate': 'EndDate is required' });
          isValid = false;
        }

        if (!isValid) {
          return { 'ErrorRequiredDates': 'Dates are required' };
        } else {


          if (endDate?.value < startDate?.value) {
            return { 'ErrorInvalidDates': 'EndDate cannot be less than StartDate' };
          } else {
            return null;
          }
        }

      } else if (searchBy?.value == 'number') {

        controls.get('startDate')?.setErrors(null);
        controls.get('endDate')?.setErrors(null);

        if (number?.value == '') {

          controls.get('number')?.setErrors({ 'ErrorRequiredNumber': 'DocumentNumber is required' });
          return { 'ErrorRequiredNumber': 'DocumentNumber is required' };

        } else {
          return null;
        }

      } else {
        controls.get('searchBy')?.setErrors({ 'ErrorRequiredSearch': 'Search by is required' });
        return { 'ErrorRequiredSearch': 'Search by is required' };
      }

    } else {
      controls.get('searchBy')?.setErrors({ 'ErrorRequiredSearch': 'Search by is required' });
      return { 'ErrorRequiredSearch': 'Search by is required' };
    }


  }
}

