import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../interfaces/response-api';
import { CustomHttpParams } from './header-token.interceptor';
import { Permissions } from 'src/app/interfaces/enums/permissions';
import { Role } from '../interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  private urlApi: string = environment.endpoint + 'Role';

  getRoles(module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}/GetRoles`, {
      params: new CustomHttpParams(module, action)
    });
  }


  getRolById(id: string, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}/${id}`, {
      params: new CustomHttpParams(module, action)
    });
  }

  addRole(role: Role, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}/AddRole`, role, {
      params: new CustomHttpParams(module, action)
    });
  }

  editRole(role: Role, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}/UpdateRole`, role, {
      params: new CustomHttpParams(module, action)
    });
  }


  deleteRole(id: string, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}/${id}`, {
      params: new CustomHttpParams(module, action)
    });
  }


}
