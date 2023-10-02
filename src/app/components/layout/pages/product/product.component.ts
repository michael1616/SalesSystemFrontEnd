import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';


import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';
import { ProductModalComponent } from '../../modals/product-modal/product-modal.component';
import { MatSort } from '@angular/material/sort';

import { Permissions } from 'src/app/interfaces/enums/permissions';
import { PermissionService } from 'src/app/services/permission.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  hasPermissionAdd: boolean = false;
  hasPermissionList: boolean = false;
  hasPermissionEdit: boolean = false;
  hasPermissionDelete: boolean = false;

  columnsTable: string[] = ['nombre', 'stock', 'precio', 'esActivo', 'descripcionCategoria', 'acciones'];
  initData: Product[] = [];
  dataListProduct = new MatTableDataSource(this.initData);

  private paginator: MatPaginator = <MatPaginator>{};
  private sort: MatSort = <MatSort>{};

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    if(this.hasPermissionList){
      this.setDataSourceAttributes();
    }
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;

    if(this.hasPermissionList){
      this.setDataSourceAttributes();
    }
  }

  setDataSourceAttributes() {

    this.dataListProduct.paginator = this.paginator;
    this.dataListProduct.sort = this.sort;
  }

  constructor(private dialog: MatDialog, private _productService: ProductService,
    private _utilityService: UtilityService,private _permissionService: PermissionService,
    private cookieService: CookieService) { }

    ngOnInit(): void {
      this.permissionList();
      this.permissionAdd();
      this.permissionEdit();
      this.permissionDelete();
      this.getProducts();
    }

  
    getProducts(): void {
      this._productService.getProducts(Permissions.PRODUCTS_MODULE, Permissions.PRODUCTS_LIST).subscribe({
        next: (data) => {
          
          if (data.isExitoso) this.dataListProduct.data = data.resultado;
          
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


    applyFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataListProduct.filter = filterValue.trim().toLocaleLowerCase();
    }
  
    newProduct(): void {
      this.dialog.open(ProductModalComponent, {
        disableClose: true,
        width: '40%'
      }).afterClosed().subscribe((result) => {
  
        if (result == 'true') this.getProducts();
  
      });
    }
  
  
    editProduct(product: Product): void {


      product.precioFormateado = this._utilityService.formatMoney(product.precio);

      this.dialog.open(ProductModalComponent, {
        disableClose: true,
        data: product,
        width: '40%'
      }).afterClosed().subscribe((result) => {
  
        if (result == 'true') this.getProducts();
  
      });
    }
  
  
    deleteProduct(product: Product): void {
  
      Swal.fire({
        title: 'are you sure you want to delete this product',
        text: product.nombre,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'No, cancel'
      }).then((result) => {
  
        if (result.isConfirmed) {
  
          this._productService.deleteProduct(product.idProducto,
            Permissions.PRODUCTS_MODULE, Permissions.PRODUCTS_DELETE).subscribe({
            next: (data) => {
              if (data.isExitoso) {
                this.getProducts();
                this._utilityService.showAlert('Product deleted correctly', 'Ok');
              }
            },
            error: (data) => {
              if (data.error != null && !data.error.isExitoso && data.error.statusCode == 400) {
                this._utilityService.showAlert('Something was wrong deleting the product', 'Error');
              } else if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
                this._utilityService.showAlert('Error internal server', 'Error');
              } else {
                this._utilityService.showAlert('Something was wrong', 'Error');
              }
            }
          });
  
        }
  
      })
  
    }


    permissionAdd(): void {

      let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));
      let action: string = Permissions[Permissions.PRODUCTS_ADD];
  
      this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
        Permissions.PERMISSION).subscribe({
          next: (data) => {
  
            if (data.isExitoso) {
              this.hasPermissionAdd = data.resultado;
            }
          },
          error: (data) => {
  
            if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
              this._utilityService.showAlert('Error internal server', 'Error');
            } else {
              this._utilityService.showAlert('Something was wrong', 'Error');
            }
  
            this.hasPermissionAdd = false;
          }
        });
  
    }


    permissionList(): void {

      let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));
      let action: string = Permissions[Permissions.PRODUCTS_LIST];
  
      this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
        Permissions.PERMISSION).subscribe({
          next: (data) => {
  
            if (data.isExitoso) {
              this.hasPermissionList = data.resultado;
            }
          },
          error: (data) => {
  
            if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
              this._utilityService.showAlert('Error internal server', 'Error');
            } else {
              this._utilityService.showAlert('Something was wrong', 'Error');
            }
  
            this.hasPermissionList = false;
          }
        });
  
    }

    permissionEdit(): void {

      let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));
      let action: string = Permissions[Permissions.PRODUCTS_EDIT];
  
      this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
        Permissions.PERMISSION).subscribe({
          next: (data) => {
  
            if (data.isExitoso) {
              this.hasPermissionEdit = data.resultado;
            }
          },
          error: (data) => {
  
            if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
              this._utilityService.showAlert('Error internal server', 'Error');
            } else {
              this._utilityService.showAlert('Something was wrong', 'Error');
            }
  
            this.hasPermissionEdit = false;
          }
        });
  
    }

    permissionDelete(): void {

      let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));
      let action: string = Permissions[Permissions.PRODUCTS_DELETE];
  
      this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
        Permissions.PERMISSION).subscribe({
          next: (data) => {
  
            if (data.isExitoso) {
              this.hasPermissionDelete = data.resultado;
            }
          },
          error: (data) => {
  
            if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
              this._utilityService.showAlert('Error internal server', 'Error');
            } else {
              this._utilityService.showAlert('Something was wrong', 'Error');
            }
  
            this.hasPermissionDelete = false;
          }
        });
  
    }

}
