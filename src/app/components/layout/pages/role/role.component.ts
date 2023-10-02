import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';


import { Product } from 'src/app/interfaces/product';
import { RoleService } from 'src/app/services/role.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';

import { Permissions } from 'src/app/interfaces/enums/permissions';
import { PermissionService } from 'src/app/services/permission.service';
import { CookieService } from 'ngx-cookie-service';
import { Role } from 'src/app/interfaces/role';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  hasPermissionList: boolean = false;
  hasPermissionAdd: boolean = false;
  hasPermissionEdit: boolean = false;
  hasPermissionDelete: boolean = false;
  
  columnsTable: string[] = ['name', 'registrationDate', 'acciones'];
  initData: Role[] = [];
  dataListRoles = new MatTableDataSource(this.initData);

  constructor(private dialog: MatDialog, private _roleService: RoleService,
    private _utilityService: UtilityService, private _permissionService: PermissionService,
    private cookieService: CookieService) { }

  private paginator: MatPaginator = <MatPaginator>{};
  private sort: MatSort = <MatSort>{};

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    if (this.hasPermissionList) {
      this.setDataSourceAttributes();
    }
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;

    if (this.hasPermissionList) {
      this.setDataSourceAttributes();
    }
  }

  setDataSourceAttributes() {

    this.dataListRoles.paginator = this.paginator;
    this.dataListRoles.sort = this.sort;
  }


  ngOnInit(): void {

    this.permissionList();
    this.permissionAdd();
    this.permissionEdit();
    this.permissionDelete();
    this.getRoles();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListRoles.filter = filterValue.trim().toLocaleLowerCase();
  }

  getRoles(): void {
    this._roleService.getRoles(Permissions.ROLES_MODULE, Permissions.ROLES_LIST).subscribe({
      next: (data) => {

        if (data.isExitoso) this.dataListRoles.data = data.resultado;

      },
      error: (data) => {

        if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
          this._utilityService.showAlert('Error internal server', 'Error');
        } else {
          this._utilityService.showAlert('Something was wrong', 'Error');
        }

        console.log(data);

      }
    });
  }


  deleteRole(role: Role): void {

    Swal.fire({
      title: 'are you sure you want to delete this role',
      text: role.name,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancel'
    }).then((result) => {

      if (result.isConfirmed) {

        this._roleService.deleteRole(role.id as string,
          Permissions.PRODUCTS_MODULE, Permissions.PRODUCTS_DELETE).subscribe({
            next: (data) => {
              if (data.isExitoso) {
                this.getRoles();
                this._utilityService.showAlert('Role deleted correctly', 'Ok');
              }
            },
            error: (data) => {
              if (data.error != null && !data.error.isExitoso && data.error.statusCode == 400) {

                if (data.error.errorMessages[0] == 'a user already exists with this role') {
                  this._utilityService.showAlert('a user already exists with this role', 'Error');
                } else {
                  this._utilityService.showAlert('Something was wrong deleting the product', 'Error');
                }

              } else if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
                this._utilityService.showAlert('Error internal server', 'Error');
              } else {
                this._utilityService.showAlert('Something was wrong', 'Error');
              }
            }
          });

      }

    })

  }


  permissionList(): void {

    let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));
    let action: string = Permissions[Permissions.ROLES_LIST];

    this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
      Permissions.PERMISSION).subscribe({
        next: (data) => {

          if (data.isExitoso) {
            this.hasPermissionList = data.resultado;
          }
        },
        error: (data) => {

          if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
            this._utilityService.showAlert('Error internal server', 'Error');
          } else {
            this._utilityService.showAlert('Something was wrong', 'Error');
          }

          this.hasPermissionList = false;
        }
      });

  }


  permissionAdd(): void {

    let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));
    let action: string = Permissions[Permissions.ROLES_PERMISSION_ADD];

    this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
      Permissions.PERMISSION).subscribe({
        next: (data) => {

          if (data.isExitoso) {
            this.hasPermissionAdd = data.resultado;
          }
        },
        error: (data) => {

          if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
            this._utilityService.showAlert('Error internal server', 'Error');
          } else {
            this._utilityService.showAlert('Something was wrong', 'Error');
          }

          this.hasPermissionAdd = false;
        }
      });

  }

  permissionEdit(): void {

    let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));
    let action: string = Permissions[Permissions.ROLES_PERMISSION_EDIT];

    this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
      Permissions.PERMISSION).subscribe({
        next: (data) => {

          if (data.isExitoso) {
            this.hasPermissionEdit = data.resultado;
          }
        },
        error: (data) => {

          if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
            this._utilityService.showAlert('Error internal server', 'Error');
          } else {
            this._utilityService.showAlert('Something was wrong', 'Error');
          }

          this.hasPermissionEdit = false;
        }
      });

  }


  permissionDelete(): void {

    let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));
    let action: string = Permissions[Permissions.ROLES_PERMISSION_DELETE];

    this._permissionService.hasPermission(idRol, action, Permissions.PERMISSION,
      Permissions.PERMISSION).subscribe({
        next: (data) => {

          if (data.isExitoso) {
            this.hasPermissionDelete = data.resultado;
          }
        },
        error: (data) => {

          if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
            this._utilityService.showAlert('Error internal server', 'Error');
          } else {
            this._utilityService.showAlert('Something was wrong', 'Error');
          }

          this.hasPermissionDelete = false;
        }
      });

  }

}
