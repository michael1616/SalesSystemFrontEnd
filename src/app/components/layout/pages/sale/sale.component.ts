import { Component } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from 'src/app/services/product.service';
import { SaleService } from 'src/app/services/sale.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Product } from 'src/app/interfaces/product';
import { Sale } from 'src/app/interfaces/sale';
import { SaleDetail } from 'src/app/interfaces/sale-detail';
import { Permissions } from 'src/app/interfaces/enums/permissions';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent {

  productList: Product[] = [];
  productListFilter: Product[] = [];
  productListForSale: SaleDetail[] = [];
  lockBtnAdd: boolean = false;
  selectedProduct!: Product;
  typeOfPay: string = 'cash';
  totalToPay: number = 0;
  form: FormGroup;

  columnsTable: string[] = ['producto', 'cantidad', 'price', 'total', 'acciones'];

  dataListSaleDetail = new MatTableDataSource(this.productListForSale);

  constructor(private fb: FormBuilder, private _productService: ProductService,
    private _saleServicer: SaleService, private _utilityService: UtilityService) {

    this.form = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.maxLength(6), Validators.pattern(/^([0-9])*$/)]]
    });

    this.getProductList();

    this.form.get('producto')?.valueChanges.subscribe(value => {
      this.productListFilter = this.getProductsByFilter(value);
    });

  }

  getProductsByFilter(search: any): Product[] {

    const value = typeof search == 'string' ? search.toLocaleLowerCase() : search.nombre.toLocaleLowerCase();
    return this.productList.filter(item => item.nombre.toLocaleLowerCase().includes(value));
  }



  getProductList(): void {

    this._productService.getProducts(Permissions.SALE_MODULE, Permissions.SALE_PRODUCT_LIST).subscribe({
      next: (data) => {
        if (data.isExitoso) {
          let products: Product[] = data.resultado;
          this.productList = products.filter(x => x.esActivo == true && x.stock > 0);
        }
      },
      error: (data) => {
        if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
          this._utilityService.showAlert('Error internal server', 'Error');
        } else {
          this._utilityService.showAlert('Something was wrong', 'Error');
        }
      }
    });

  }

  showProduct(product: Product): string {
    return product.nombre;
  }

  productForSale(event: any): void {
    this.selectedProduct = event.option.value;
  }

  addProductForSale(): void {

    const QUANTITY: number = this.form.get('cantidad')?.value;

    if (this.selectedProduct.stock < QUANTITY) {

      Swal.fire(
        'Information',
        `The stock of this product is ${this.selectedProduct.stock}`,
        'info'
      )

      return;
    }

    const PRICE: number = this.selectedProduct.precio;
    const TOTAL: number = QUANTITY * PRICE;
    this.totalToPay = this.totalToPay + TOTAL;

    this.productListForSale.push({
      cantidad: QUANTITY,
      precio: PRICE,
      total: TOTAL,
      idProducto: this.selectedProduct.idProducto,
      descripcionProducto: this.selectedProduct.nombre,
      idVenta: 0
    });

    this.dataListSaleDetail = new MatTableDataSource(this.productListForSale);

    this.form.patchValue({
      producto: '',
      cantidad: ''
    });

  }


  deleteProduct(detail: SaleDetail): void {
    this.totalToPay = this.totalToPay - detail.total;
    this.productListForSale = this.productListForSale.filter(p => p.idProducto != detail.idProducto);
    this.dataListSaleDetail = new MatTableDataSource(this.productListForSale);
  }


  addSale(): void {

    if (this.productListForSale.length <= 0) {

      this._utilityService.showAlert('There is not products selected', 'Error');
      return;
    }


    this.lockBtnAdd = true;

    const REQUEST: Sale = {
      tipoPago: this.typeOfPay,
      total: this.totalToPay,
      detalleVenta: this.productListForSale
    };


    this._saleServicer.addSale(REQUEST, Permissions.SALE_MODULE, Permissions.SALE_MODULE).subscribe({
      next: (data) => {
        if (data.isExitoso) {

          this.totalToPay = 0;
          this.productListForSale = [];
          this.dataListSaleDetail = new MatTableDataSource(this.productListForSale);

          Swal.fire({
            icon: 'success',
            title: 'Sale added successfully',
            text: `Sale number ${ data.resultado.numeroDocumento }`
          })

        }
      },
      error: (data) => {
        if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
          this._utilityService.showAlert('Error internal server', 'Error');
        } else {
          this._utilityService.showAlert('Something was wrong', 'Error');
        }
      },
      complete: () => {
        this.lockBtnAdd = false;
      }
    });

  }

}
