import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

const routes: Routes = [
  {path: '', component:LoginComponent, pathMatch:'full'},
  {path: 'login', component:LoginComponent, pathMatch:'full'},
  {path: 'forbidden', component:ForbiddenComponent, pathMatch:'full'},
  {path: 'pages', loadChildren: ()=> import('./components/layout/layout.module').then(m => m.LayoutModule)},
  {path: '**', redirectTo: 'login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
