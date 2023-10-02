import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/interfaces/category';
import { Product } from 'src/app/interfaces/product';

import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { UtilityService } from 'src/app/services/utility.service';

import { Permissions } from 'src/app/interfaces/enums/permissions';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent implements OnInit {


  form: FormGroup;
  actionTitule: string = 'Add Product';
  btnActionText: string = 'Save';
  categoriesList: Category[] = [];

  constructor(private currentModal: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataProduct: Product,
    private fb: FormBuilder, private _categoryService: CategoryService,
    private _productService: ProductService, private _utilityService: UtilityService) {

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      stock: ['', [Validators.required, Validators.maxLength(6), Validators.pattern(/^([0-9])*$/)]],
      precioFormat: ['', [Validators.required, Validators.maxLength(13)]],
      esActivo: ['true', Validators.required],
      idCategoria: ['', Validators.required],
      precio: [0]
    });

    if (dataProduct != null) {

      this.actionTitule = 'Edit Product';
      this.btnActionText = 'Edit';

    }

    this._categoryService.getCategories().subscribe({
      next: (data) => {
        if (data.isExitoso) this.categoriesList = data.resultado;
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


  ngOnInit(): void {

    if (this.dataProduct != null) {

      this.form.patchValue({
        nombre: this.dataProduct.nombre,
        stock: this.dataProduct.stock,
        precio: this.dataProduct.precio,
        precioFormat: this.dataProduct.precioFormateado,
        esActivo: this.dataProduct.esActivo ? 'true' : 'false',
        idCategoria: this.dataProduct.idCategoria
      });

    }

  }


  saveProduct(): void {

    const PRODUCT: Product = {
      idProducto: this.dataProduct == null ? 0 : this.dataProduct.idProducto,
      nombre: this.form.get('nombre')?.value,
      stock: this.form.get('stock')?.value,
      precio: this.form.get('precio')?.value,
      precioFormateado: this.form.get('precioFormat')?.value,
      idCategoria: this.form.get('idCategoria')?.value,
      esActivo: this.form.get('esActivo')?.value == 'true' ? true : false,
      descripcionCategoria: ''
    };

    //Edit User
    if (this.dataProduct != null) {

      this.editProduct(PRODUCT);

    } else {

      this.addProduct(PRODUCT);

    }

  }

  editProduct(product: Product): void {

    this._productService.editProduct(product, Permissions.PRODUCTS_MODULE, Permissions.PRODUCTS_EDIT).subscribe({
      next: (data) => {

        if (data.isExitoso) {
          this._utilityService.showAlert('Product was edited correctly', 'Ok');
          this.currentModal.close('true');
        }
      },
      error: (data) => {

        if (data.error != null && !data.error.isExitoso && data.error.statusCode == 400) {
          this._utilityService.showAlert('Something was wrong', 'Error');
        } else if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
          this._utilityService.showAlert('Error internal server', 'Error');
        } else {
          this._utilityService.showAlert('Something was wrong', 'Error');
        }

      }
    });

  }


  addProduct(product: Product): void {

    this._productService.addProduct(product, Permissions.PRODUCTS_MODULE, Permissions.PRODUCTS_ADD).subscribe({
      next: (data) => {

        if (data.isExitoso) {
          this._utilityService.showAlert('Product was added correctly', 'Ok');
          this.currentModal.close('true');
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

  updateValue(event: any):void{

    let data: any = this._utilityService.formatedValueInput(event);

    this.form.patchValue({
      precioFormat: data.quantityFormat,
      precio: data.quantity
    });
  }

}


function validatePrice(control: AbstractControl) {

  let isValid: boolean = true;

  let value: string = control?.value;
  let stringValue: string = '';

  if (value != undefined && value != '') {

    let valArr = control.value?.split('');

    if (valArr.length == 1) {

      stringValue = value;

    } else {

      valArr.shift();
      valArr.shift();

      stringValue = valArr.join("").replaceAll(',', '').replaceAll('.', '');
    }

    let val = parseInt(stringValue, 10);
    if (Number.isNaN(val)) {
      isValid = false;
    } else {
      isValid = true;
    }

  }


  return isValid ? null : { 'ErrorPrice': 'The price must be a number' };
}


