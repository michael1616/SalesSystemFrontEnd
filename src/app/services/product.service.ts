import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../interfaces/response-api';
import { Product } from '../interfaces/product';
import { CustomHttpParams } from './header-token.interceptor';
import { Permissions } from 'src/app/interfaces/enums/permissions';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private urlApi: string = environment.endpoint + 'Product';

  constructor(private http: HttpClient) { }

  getProducts(module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}/GetProducts`, {
      params: new CustomHttpParams(module, action)
    });
  }

  addProduct(product: Product, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}/AddProduct`, product, {
      params: new CustomHttpParams(module, action)
    });
  }

  editProduct(product: Product, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}/UpdateProduct`, product, {
      params: new CustomHttpParams(module, action)
    });
  }

  deleteProduct(id: number, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}/${id}`, {
      params: new CustomHttpParams(module, action)
    });
  }


}
