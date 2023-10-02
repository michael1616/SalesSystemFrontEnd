import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { JWTTokenService } from './jwttoken.service';
import { Router } from '@angular/router';
import { Permissions } from 'src/app/interfaces/enums/permissions';


@Injectable()
export class HeaderTokenInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService, private _jwtService: JWTTokenService,
    private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const TOKEN: string = this.cookieService.get('Token');


    if (TOKEN == null || TOKEN == undefined || TOKEN == '' || this._jwtService.isTokenExpired()) {

      this.cookieService.deleteAll('/', 'localhost');
      this.cookieService.delete('Token', '/', 'localhost');
      this.cookieService.delete('Rol', '/','localhost' );
      this.cookieService.delete('UserId', '/','localhost');
      this.cookieService.delete('email', '/','localhost');
      this.cookieService.delete('idRol', '/','localhost');
      this.cookieService.delete('Exp', '/','localhost');

      return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }));

    }

    request = request.clone({ setHeaders: { Authorization: 'Bearer ' + TOKEN } });


    let params = request.params as CustomHttpParams;


    let indexModule = params.module;
    let indexAction = params.action;

    if (indexModule == undefined || indexAction == undefined) {

      return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }));

    }

    let module: string = Permissions[indexModule];
    let action: string = Permissions[indexAction];

    request = request.clone({ setHeaders: { Module: module } });
    request = request.clone({ setHeaders: { Action: action } });

    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {

      // if (error.status === 401 || error.status === 403) {
      //   this.router.navigate(['/login']);
      // }

      return throwError(() => error);
    }));
  }
}


export class CustomHttpParams extends HttpParams {
  constructor(public module: Permissions, public action: Permissions) {
    super();
  }
}