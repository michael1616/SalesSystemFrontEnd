import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';

import { Observable, lastValueFrom } from 'rxjs';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { JWTTokenService } from './jwttoken.service';
import { PermissionService } from './permission.service';
import { UtilityService } from './utility.service';
import { Permissions } from 'src/app/interfaces/enums/permissions';


@Injectable({
  providedIn: 'root',
})
export class AuthorizeGuard {

  hasPermission: boolean = false;
  
  constructor(public authService: UserService, public router: Router,
    private cookieService: CookieService, private _jwtService: JWTTokenService,
    private _permissionService: PermissionService, private _utilityService: UtilityService) { 

    }
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<boolean> | Promise<boolean> | UrlTree | boolean> {

    if (this.cookieService.get('Token') === '' || this._jwtService.isTokenExpired()) {

      this.cookieService.deleteAll('/', 'localhost');
      this.cookieService.delete('Token', '/', 'localhost');
      this.cookieService.delete('Rol', '/','localhost' );
      this.cookieService.delete('UserId', '/','localhost');
      this.cookieService.delete('email', '/','localhost');
      this.cookieService.delete('idRol', '/','localhost');
      this.cookieService.delete('Exp', '/','localhost');

      this.router.navigate(['/']);
    }

    let index: number = next.data['actionModule'] as number;
    let permission: string = Permissions[index];

    if (index != Permissions.LAYOUT) {

      let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));

      await this.loadPermision(idRol, permission);
    }

console.log(index+"==="+this.hasPermission);

    if(index != Permissions.LAYOUT && !this.hasPermission ){
      console.log(index+"=||="+this.hasPermission);
      this.router.navigate(['/forbidden']);
      return false;
    }

    return true;
  }


  public async loadPermision(idRol: string, permission: string) {

    const result$ = this._permissionService.hasPermission(idRol, permission, Permissions.PERMISSION, Permissions.PERMISSION);
    let data = await lastValueFrom(result$);
    this.hasPermission = data.resultado;
    
  }

}

