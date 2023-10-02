import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from 'src/app/services/permission.service';
import { Permissions } from 'src/app/interfaces/enums/permissions';
import { UtilityService } from 'src/app/services/utility.service';
import { PermissionsAction } from 'src/app/interfaces/permissions-action';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/interfaces/role';

@Component({
  selector: 'app-role-permission-add',
  templateUrl: './role-permission-add.component.html',
  styleUrls: ['./role-permission-add.component.css']
})
export class RolePermissionAddComponent implements OnInit {


  roleName: string = '';
  permissionList: PermissionsAction[] = [];

  constructor(private _utilityService: UtilityService, private _permissionService: PermissionService,
    private _roleService: RoleService, private router: Router) { }


  ngOnInit(): void {
    this.getPermission();
  }


  getPermission(): void {

    this._permissionService.getPermisions(true, '',Permissions.ROLES_MODULE, Permissions.ROLES_PERMISSION_ADD).subscribe({
      next: (data) => {

        if (data.isExitoso) {
          this.permissionList = data.resultado;
          console.log(this.permissionList);
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


  changeModule(isChecked: boolean, action: PermissionsAction): void {

    if (!isChecked) {

      action.childrenActions.forEach((el) => {
        el.state = false;
        el.isDisabled = true;
      });

    } else {
      action.childrenActions.forEach((el) => {

        let actionSplit: string[] = el.action.split("_");
        let lastIndex: string = actionSplit[actionSplit.length - 1];

        if (lastIndex == 'LIST') {
          el.state = true;
        }

        el.isDisabled = false;
      });
    }

  }

  changeAction(isChecked: boolean, module: PermissionsAction, action: PermissionsAction): void {

    let actionSplit: string[] = action.action.split("_");
    let lastIndex: string = actionSplit[actionSplit.length - 1];

    if (!isChecked) {

      if (lastIndex == 'LIST') {
        module.state = false;

        module.childrenActions.forEach((el) => {

          el.state = false;
          el.isDisabled = true;

        });
      }

    } else {

      if (lastIndex == 'LIST') {
        module.state = true;
      }

    }

  }

  addRol(): void {

    if (this.roleName == '' || this.roleName == undefined) {
      this._utilityService.showAlert('The role name is required', 'Error');
      return;
    }

    if (this.permissionList.length <= 0) {
      this._utilityService.showAlert('Somthing was wrong', 'Error');
      return;
    }

    const ROLE_PERMISSIONS: Role = {
      name: this.roleName,
      permissions: this.permissionList
    };

    this._roleService.addRole(ROLE_PERMISSIONS, Permissions.ROLES_MODULE, Permissions.ROLES_PERMISSION_ADD).subscribe({
      next: (data) => {

        if (data.isExitoso) {
          this._utilityService.showAlert('Role was added sucessfully', 'Ok');
          this.router.navigate(['/pages/role']);
        }
      },
      error: (data) => {

        if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
          this._utilityService.showAlert('Error internal server', 'Error');
        } else if (data.error != null && !data.error.isExitoso && data.error.statusCode == 400) {
          this._utilityService.showAlert('Error trying to added the role', 'Error');
        } else {
          this._utilityService.showAlert('Something was wrong', 'Error');
        }

      }
    });

  }


}
