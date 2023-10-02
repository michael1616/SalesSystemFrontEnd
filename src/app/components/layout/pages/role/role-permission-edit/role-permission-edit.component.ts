import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionsAction } from 'src/app/interfaces/permissions-action';
import { PermissionService } from 'src/app/services/permission.service';
import { RoleService } from 'src/app/services/role.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Permissions } from 'src/app/interfaces/enums/permissions';
import { Role } from 'src/app/interfaces/role';

@Component({
  selector: 'app-role-permission-edit',
  templateUrl: './role-permission-edit.component.html',
  styleUrls: ['./role-permission-edit.component.css']
})
export class RolePermissionEditComponent {

  idRole: string = '';
  roleName: string = '';
  permissionList: PermissionsAction[] = [];


  constructor(private _utilityService: UtilityService, private _permissionService: PermissionService,
    private _roleService: RoleService, private router: Router, private activatedroute: ActivatedRoute) {

      this.idRole = this.activatedroute.snapshot.paramMap.get('id')!;

     }

  ngOnInit(): void {
    this.getPermission();
    this.getRol();
  }


  getPermission(): void {

    this._permissionService.getPermisions(false, this.idRole ,Permissions.ROLES_MODULE, Permissions.ROLES_PERMISSION_EDIT).subscribe({
      next: (data) => {

        if (data.isExitoso) {
          this.permissionList = data.resultado;
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


  getRol():void{

    this._roleService.getRolById(this.idRole, Permissions.ROLES_MODULE, Permissions.ROLES_PERMISSION_EDIT).subscribe({
      next: (data) => {

        if (data.isExitoso) {
          this.roleName = data.resultado.name;
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


  editRol():void{


    if (this.roleName == '' || this.roleName == undefined) {
      this._utilityService.showAlert('The role name is required', 'Error');
      return;
    }

    if (this.permissionList.length <= 0) {
      this._utilityService.showAlert('Somthing was wrong', 'Error');
      return;
    }

    const ROLE_PERMISSIONS: Role = {
      id:this.idRole,
      name: this.roleName,
      permissions: this.permissionList
    };

    this._roleService.editRole(ROLE_PERMISSIONS, Permissions.ROLES_MODULE, Permissions.ROLES_PERMISSION_EDIT).subscribe({
      next: (data) => {

        if (data.isExitoso) {
          this._utilityService.showAlert('Role was edited sucessfully', 'Ok');
          this.router.navigate(['/pages/role']);
        }
      },
      error: (data) => {

        if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
          this._utilityService.showAlert('Error internal server', 'Error');
        } else if (data.error != null && !data.error.isExitoso && data.error.statusCode == 400) {
          this._utilityService.showAlert('Error trying to edited the role', 'Error');
        } else {
          this._utilityService.showAlert('Something was wrong', 'Error');
        }

      }
    });


  }

}
