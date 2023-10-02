import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  key = 'landcruiser123';
  
  constructor(private _snackBar: MatSnackBar) { }

  public showAlert(msg: string, type: string):void{
     this._snackBar.open(msg, type,{
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000
     });
  }

  public encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  public decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }


  public formatedValueInput(event: any):any{

    let value: string = event.target.value;
    let valArr = value.split("");
    let stringValue: string = '';

    if(valArr.length == 1){

     stringValue = value;

    }else{

     valArr.shift();
     valArr.shift();

     stringValue = valArr.join("").replaceAll(',','').replaceAll('.','');

    }

    let val = parseInt(stringValue, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }

    let quantity: number = val;
    let quantityFormat: string = formatCurrency(val, 'es-CO', getCurrencySymbol('COP', 'wide','es-CO'),undefined, "1.0-0");

    let data = {
      quantity: quantity,
      quantityFormat: quantityFormat
    };

    return data;
 }

 public formatMoney(price: number):string{
    return formatCurrency(price, 'es-CO', getCurrencySymbol('COP', 'wide','es-CO'),undefined, "1.0-0");
 }
}
