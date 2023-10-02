import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login';
import { UserService } from 'src/app/services/user.service';
import { UtilityService } from 'src/app/services/utility.service';
import { CookieService } from 'ngx-cookie-service';
import { JWTTokenService } from 'src/app/services/jwttoken.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: FormGroup;
  hidePassword: boolean = true;
  showLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router,
    private _userService: UserService, private _utilityService: UtilityService,
    private cookieService: CookieService, private _jwtService: JWTTokenService,) {

    this.form = fb.group({
      email: ['', [Validators.required, Validators.pattern(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/), Validators.maxLength(256)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    })

  }

  logIn(): void {

    this.showLoading = true;

    const CREDENTIALS: Login = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
    };

    if (this.form.valid) {

      this._userService.logIn(CREDENTIALS).subscribe({
        next: (data) => {

          console.log(data);

          if (data.isExitoso) {


            console.log('=============');
            this.cookieService.deleteAll();

            this._jwtService.setToken(data.resultado.token);

            this.cookieService.set('Token', data.resultado.token);
            this.cookieService.set('Rol', this._utilityService.encrypt(data.resultado.usuario.rol));
            this.cookieService.set('UserId', this._utilityService.encrypt(data.resultado.usuario.id));
            this.cookieService.set('email', this._utilityService.encrypt(data.resultado.usuario.email));
            this.cookieService.set('idRol', this._utilityService.encrypt(data.resultado.usuario.idRol));
            this.cookieService.set('Exp', this._utilityService.encrypt(this._jwtService.getExpiryTime()?.toString()));
  
            console.log(data);

            this.router.navigate(['pages']);
          }

        },
        complete: () => {
          this.showLoading = false;
        },error: (data) => {
            
console.log(data);

        if(data.error != null && !data.error.isExitoso && data.error.statusCode == 400){
           this._utilityService.showAlert('UserName o Password are Incorrect', 'Error');
        }else if(data.error != null && !data.error.isExitoso && data.error.statusCode == 500){
          this._utilityService.showAlert('Something was wrong!', 'Error');
        }else{
          this._utilityService.showAlert('Something was wrong!', 'Error');
        }
        this.showLoading = false;
        }
      });

    }

  }

}
