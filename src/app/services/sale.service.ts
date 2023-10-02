import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../interfaces/response-api';
import { Sale } from '../interfaces/sale';
import { CustomHttpParams } from './header-token.interceptor';
import { Permissions } from 'src/app/interfaces/enums/permissions';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private urlApi: string = environment.endpoint + 'Sale';

  constructor(private http: HttpClient) { }

  getRecord(searchBy: string, documentNumber: string, startDate: string, endDate: string,
    module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}/GetRecord?SearchBy=${searchBy}&DocumentNumber=${documentNumber}&StartDate=${startDate}&EndDate=${endDate}`,{
      params: new CustomHttpParams(module, action)
    });
  }

  getReport(startDate: string, endDate: string,
    module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}/GetReport?StartDate=${startDate}&EndDate=${endDate}`,{
      params: new CustomHttpParams(module, action)
    });
  }

  addSale(sale: Sale, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}/AddSale`, sale,{
      params: new CustomHttpParams(module, action)
    });
  }

  
}
