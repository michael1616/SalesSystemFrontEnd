import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../interfaces/response-api';
import { Permissions } from 'src/app/interfaces/enums/permissions';
import { CustomHttpParams } from './header-token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private urlApi: string = environment.endpoint + 'Menu';

  constructor(private http: HttpClient) { }


  getMenu(idRol: string, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}/${idRol}`,{
      params: new CustomHttpParams(module, action)
    });
  }

}
