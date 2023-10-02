import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { CookieService } from 'ngx-cookie-service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {
  jwtToken: string = '';
  decodedToken: { [key: string]: string } = {};

  constructor(private cookieService: CookieService, private _utlityService: UtilityService) { }

  setToken(token: string) {
    if (token) {
      this.jwtToken = token;
    }
  }

  decodeToken() {
    if (this.jwtToken) {
    this.decodedToken = jwt_decode(this.jwtToken);
    }
  }

  getDecodeToken() {
    return jwt_decode(this.jwtToken);
  }

  getUserId() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] : null;
  }

  getRol() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] : null;
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['exp'] : 'empty';
  }

  isTokenExpired(): boolean {
    const expiryTime: number = +this._utlityService.decrypt(this.cookieService.get('Exp'));
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }
}
