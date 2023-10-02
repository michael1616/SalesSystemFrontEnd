import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../interfaces/response-api';
import { CustomHttpParams } from './header-token.interceptor';
import { Permissions } from 'src/app/interfaces/enums/permissions';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private urlApi: string = environment.endpoint + 'Dashboard';

  constructor(private http: HttpClient) { }


  getDashboardGraphic(module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}/GetDashboardGraphic`, {
      params: new CustomHttpParams(module, action)
    });
  }

  getDashboardTotals(module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}/GetDashboardTotals`, {
      params: new CustomHttpParams(module, action)
    });
  }

}
