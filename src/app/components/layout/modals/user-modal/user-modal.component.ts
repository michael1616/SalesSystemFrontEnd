import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/interfaces/role';
import { User } from 'src/app/interfaces/user';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { Permissions } from 'src/app/interfaces/enums/permissions';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {

  form: FormGroup;
  hidePassword: boolean = true;
  actionTitule: string = 'Add User';
  btnActionText: string = 'Save';
  rolesList: Role[] = [];

  constructor(private currentModal: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dataUser: User,
    private fb: FormBuilder, private _rolService: RoleService,
    private _userService: UserService, private _utilityService: UtilityService) {

    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/), Validators.maxLength(150)]],
      idRol: ['', Validators.required],
      isActive: ['true', Validators.required],
      passwordHash: ['']
    },
      {
        validators: [validateRequired(dataUser)]
      });

    if (dataUser != null) {

      this.actionTitule = 'Edit User';
      this.btnActionText = 'Edit';

    }

    this._rolService.getRoles(Permissions.ROLES_MODULE, Permissions.ROLES_LIST).subscribe({
      next: (data) => {
        if (data.isExitoso) this.rolesList = data.resultado;
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

  ngOnInit(): void {

    if (this.dataUser != null) {

      this.form.patchValue({
        fullName: this.dataUser.fullName,
        email: this.dataUser.email,
        idRol: this.dataUser.idRol,
        isActive: this.dataUser.isActive ? 'true' : 'false',
        passwordHash: ''
      });

    }

  }

  saveUser(): void {

    const USER: User = {
      id: this.dataUser == null ? '' : this.dataUser.id,
      fullName: this.form.get('fullName')?.value,
      email: this.form.get('email')?.value,
      idRol: this.form.get('idRol')?.value,
      isActive: this.form.get('isActive')?.value == 'true' ? true : false,
      passwordHash: this.form.get('passwordHash')?.value,
      rolDescription: ''
    };

    //Edit User
    if (this.dataUser != null) {

      this.editUser(USER);

    } else {

      this.addUser(USER);

    }

  }

  editUser(user: User): void {

    this._userService.editUser(user, Permissions.USERS_MODULE, Permissions.USERS_EDIT).subscribe({
      next: (data) => {

        if (data.isExitoso) {
          this._utilityService.showAlert('User was edited correctly', 'Ok');
          this.currentModal.close('true');
        }
      },
      error: (data) => {

        if (data.error != null && !data.error.isExitoso && data.error.statusCode == 400) {
          this._utilityService.showAlert('Something was wrong', 'Error');
        } else if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {
          this._utilityService.showAlert('Error internal server', 'Error');
        } else {
          this._utilityService.showAlert('Something was wrong', 'Error');
        }

      }
    });

  }


  addUser(user: User): void {

    this._userService.addUser(user, Permissions.USERS_MODULE, Permissions.USERS_ADD).subscribe({
      next: (data) => {

        if (data.isExitoso) {
          this._utilityService.showAlert('User was added correctly', 'Ok');
          this.currentModal.close('true');
        }
      },
      error: (data) => {

        if (data.error != null && !data.error.isExitoso && data.error.statusCode == 400
          && data.error.errorMessages[0] == 'Usuario ya Existe!') {

          this._utilityService.showAlert('The user already exists', 'Error');

        } else if (data.error != null && !data.error.isExitoso && data.error.statusCode == 400
          && data.error.errorMessages[0] == 'Error al registrar Usuario!') {

          this._utilityService.showAlert('Failed to register User', 'Error');

        } else if (data.error != null && !data.error.isExitoso && data.error.statusCode == 500) {

          this._utilityService.showAlert('Error internal server', 'Error');

        } else {
          console.log(data);
          this._utilityService.showAlert('Something was wrong', 'Error');
        }

      }
    });

  }

}

function validateRequired(dataUser: User): ValidatorFn {

  return (controls: AbstractControl) => {

    let controlPass = controls.get('passwordHash');

    if (dataUser == null) {


      if (controlPass?.value == undefined || controlPass?.value == '') {
        controls.get('passwordHash')?.setErrors({ 'Error': 'The password is required' });
        return { 'Error': 'The password is required' };
      } else {

        if (controlPass?.value.length < 4) {
          controls.get('passwordHash')?.setErrors({ 'ErrorLenghtMinPass': 'The password must be higher than 3' });
          return { 'ErrorLenghtMinPass': 'The password must be higher than 3' };
        } else if(controlPass?.value.length > 50) {
          controls.get('passwordHash')?.setErrors({ 'ErrorLenghtMaxPass': 'The password must be less than 51' });
          return { 'ErrorLenghtMaxPass': 'The password must be less than 51'};
        }else{
          return null;
        }
        
      }

    } else {
      return null;
    }

  }
}
