import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';


import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import Swal from 'sweetalert2';
import { UserModalComponent } from '../../modals/user-modal/user-modal.component';
import { MatSort, Sort } from '@angular/material/sort';

import { Permissions } from 'src/app/interfaces/enums/permissions';
import { CookieService } from 'ngx-cookie-service';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  hasPermissionAdd: boolean = false;
  hasPermissionList: boolean = false;
  hasPermissionEdit: boolean = false;
  hasPermissionDelete: boolean = false;

  columnsTable: string[] = ['fullName', 'email', 'rolDescription', 'state', 'acciones'];
  initData: User[] = [];
  dataListUser = new MatTableDataSource(this.initData);

  private paginator: MatPaginator = <MatPaginator>{};
  private sort: MatSort = <MatSort>{};

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    if(this.hasPermissionList){
      this.setDataSourceAttributes();
    }
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;

    if(this.hasPermissionList){
      this.setDataSourceAttributes();
    }
  }

  setDataSourceAttributes() {

    this.dataListUser.paginator = this.paginator;
    this.dataListUser.sort = this.sort;
  }

  constructor(private dialog: MatDialog, private _userService: UserService,
    private cookieService: CookieService,
    private _utilityService: UtilityService,
    private _permissionService: PermissionService
  ) { }

  ngOnInit(): void {

    this.permissionList();
    this.permissionAdd();
    this.permissionEdit();
    this.getUsers();
    this.permissionDelete();
  }


  getUsers(): void {
    this._userService.getUsers(Permissions.USERS_MODULE, Permissions.USERS_LIST).subscribe({
      next: (data) => {
        if (data.isExitoso) this.dataListUser.data = data.resultado;

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


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListUser.filter = filterValue.trim().toLocaleLowerCase();
  }

  newUser(): void {
    this.dialog.open(UserModalComponent, {
      disableClose: true,
      width: '40%'
    }).afterClosed().subscribe((result) => {

      if (result == 'true') this.getUsers();

    });
  }


  editUser(user: User): void {
    this.dialog.open(UserModalComponent, {
      disableClose: true,
      data: user,
      width: '40%'
    }).afterClosed().subscribe((result) => {

      if (result == 'true') this.getUsers();

    });
  }


  deleteUser(user: User): void {

    Swal.fire({
      title: 'are you sure you want to delete this user',
      text: user.fullName,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancel'
    }).then((result) => {

      if (result.isConfirmed) {

        this._userService.deleteUser(user.id, Permissions.USERS_MODULE, Permissions.USERS_DELETE).subscribe({
          next: (data) => {
            if (data.isExitoso) {
              this.getUsers();
              this._utilityService.showAlert('User deleted correctly', 'Ok');
            }
          },
          error: (data) => {
            if (data.error != null && !data.error.isExitoso && data.error.statusCode == 400) {
              this._utilityService.showAlert('Something was wrong deleting the user', 'Error');
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



  permissionAdd(): void {

    let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));
    let action: string = Permissions[Permissions.USERS_ADD];

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


  permissionList(): void {

    let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));
    let action: string = Permissions[Permissions.USERS_LIST];

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

  permissionEdit(): void {

    let idRol: string = this._utilityService.decrypt(this.cookieService.get('idRol'));
    let action: string = Permissions[Permissions.USERS_EDIT];

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
    let action: string = Permissions[Permissions.USERS_DELETE];

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
