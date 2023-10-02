import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Menu } from 'src/app/interfaces/menu';
import { MenuService } from 'src/app/services/menu.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Permissions } from 'src/app/interfaces/enums/permissions';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  menuList: Menu[] = [];
  emailUser: string = '';
  rolUser: string = '';

  constructor(private cookieService: CookieService, private router: Router,
    private _menuService: MenuService, private _utilityService: UtilityService) { }

  ngOnInit(): void {

    const EMAIL: string = this.cookieService.get('email');
    const ROL: string = this.cookieService.get('Rol');
    let id_rol: string = this.cookieService.get('idRol');

    if (EMAIL != null || EMAIL != undefined) {
      this.emailUser = this._utilityService.decrypt(EMAIL);
    }

    if (ROL != null || ROL != undefined) {
      this.rolUser = this._utilityService.decrypt(ROL);
    }

    if (id_rol != null || id_rol != undefined) {

      id_rol = this._utilityService.decrypt(id_rol);

      this._menuService.getMenu(id_rol, Permissions.MENU, Permissions.MENU).subscribe({
        next: (data) => {

          if (data.isExitoso) {
            this.menuList = data.resultado;
          }
        },
        error: (data) => {

          if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
            this._utilityService.showAlert('Error internal server', 'Error');
          } else {
            this._utilityService.showAlert('Something was wrong', 'Error');
          }

        }
      });

    }



  }

  signOut(): void {

    this.cookieService.deleteAll('/', 'localhost');
    this.cookieService.delete('Token', '/', 'localhost');
    this.cookieService.delete('Rol', '/','localhost' );
    this.cookieService.delete('UserId', '/','localhost');
    this.cookieService.delete('email', '/','localhost');
    this.cookieService.delete('idRol', '/','localhost');
    this.cookieService.delete('Exp', '/','localhost');

    this.router.navigate(['/login']);
  }


}
