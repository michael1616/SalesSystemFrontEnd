import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private urlApi: string = environment.endpoint + 'Category';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.urlApi}/GetCategories`);
  }
  
}
