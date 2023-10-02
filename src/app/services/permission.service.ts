import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../interfaces/response-api';
import { CustomHttpParams } from './header-token.interceptor';
import { Permissions } from 'src/app/interfaces/enums/permissions';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private urlApi: string = environment.endpoint + 'Permission';

  constructor(private http: HttpClient) { }


  hasPermission(idRol: string, actionModule: string, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}/${idRol}/${actionModule}`, {
      params: new CustomHttpParams(module, action)
    });
  }


  getPermisions(isAdd: boolean, idRol: string, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}?isAdd=${isAdd}&idRol=${idRol}`, {
      params: new CustomHttpParams(module, action)
    });
  }

}
