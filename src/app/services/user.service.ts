import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../interfaces/response-api';
import { Login } from '../interfaces/login';
import { User } from '../interfaces/user';
import { CustomHttpParams } from './header-token.interceptor';
import { Permissions } from 'src/app/interfaces/enums/permissions';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private urlApi: string = environment.endpoint + 'User';

  constructor(private http: HttpClient) { }


  logIn(credentials: Login): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}/Login`, credentials);
  }

  getUsers(module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}/GetUsers`, {
      params: new CustomHttpParams(module, action)
    });
  }

  addUser(credentials: User, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.urlApi}/AddUser`, credentials, {
      params: new CustomHttpParams(module, action)
    });
  }

  editUser(credentials: User, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.urlApi}/UpdateUser`, credentials, {
      params: new CustomHttpParams(module, action)
    });
  }

  deleteUser(id: string, module: Permissions, action: Permissions): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.urlApi}/${id}`, {
      params: new CustomHttpParams(module, action)
    });
  }

}
