import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sale } from 'src/app/interfaces/sale';
import { SaleDetail } from 'src/app/interfaces/sale-detail';
import { FormatDatePipe } from 'src/app/services/format-date.pipe';
import { UtilityService } from 'src/app/services/utility.service';


@Component({
  selector: 'app-sale-detail-modal',
  templateUrl: './sale-detail-modal.component.html',
  styleUrls: ['./sale-detail-modal.component.css'],
  providers:[FormatDatePipe]
})
export class SaleDetailModalComponent implements AfterViewInit{

registrationDate: string;
documentNumber: string;
typeOfPay: string;
total: string;
saleDetail: SaleDetail[] = [];

columnsTable: string[] = ['producto', 'cantidad', 'precio', 'total'];

@ViewChild(MatPaginator) paginationTable!: MatPaginator;
@ViewChild(MatSort) sortTable!: MatSort;

dataListDetail = new MatTableDataSource(this.saleDetail);

constructor(@Inject(MAT_DIALOG_DATA) public data: Sale, private formatPipe: FormatDatePipe,
private _utilityService: UtilityService){


  this.registrationDate = formatPipe.transform(data.fechaRegistro!);
  this.documentNumber = data.numeroDocumento!;
  this.typeOfPay = data.tipoPago;
  this.total = this._utilityService.formatMoney(data.total);
  this.saleDetail = data.detalleVenta;
  this.dataListDetail.data = this.saleDetail;

}

ngAfterViewInit(): void {
  this.dataListDetail.sort = this.sortTable;
}

}
