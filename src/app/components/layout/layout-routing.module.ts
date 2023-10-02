import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserComponent } from './pages/user/user.component';
import { ProductComponent } from './pages/product/product.component';
import { SaleComponent } from './pages/sale/sale.component';
import { RecordSaleComponent } from './pages/record-sale/record-sale.component';
import { ReportSaleComponent } from './pages/report-sale/report-sale.component';
import { AuthorizeGuard } from 'src/app/services/authorize.guard';
import { Permissions } from 'src/app/interfaces/enums/permissions';
import { RoleComponent } from './pages/role/role.component';
import { RolePermissionAddComponent } from './pages/role/role-permission-add/role-permission-add.component';
import { RolePermissionEditComponent } from './pages/role/role-permission-edit/role-permission-edit.component';

const routes: Routes = [
  {path: '', component: LayoutComponent, children: [
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthorizeGuard], data: { actionModule: Permissions.DASH_BOARD_MODULE}},
    {path: 'user', component: UserComponent, canActivate: [AuthorizeGuard], data: { actionModule: Permissions.USERS_MODULE}},
    {path: 'product', component: ProductComponent, canActivate: [AuthorizeGuard], data: { actionModule: Permissions.PRODUCTS_MODULE}},
    {path: 'sale', component: SaleComponent, canActivate: [AuthorizeGuard], data: { actionModule: Permissions.SALE_MODULE}},
    {path: 'record_sale', component: RecordSaleComponent, canActivate: [AuthorizeGuard], data: { actionModule: Permissions.RECORD_SALE_MODULE}},
    {path: 'report_sale', component: ReportSaleComponent, canActivate: [AuthorizeGuard], data: { actionModule: Permissions.REPORT_SALE_MODULE}},
    {path: 'role', component: RoleComponent, canActivate: [AuthorizeGuard], data: { actionModule: Permissions.ROLES_MODULE}},
    {path: 'role_add', component: RolePermissionAddComponent, canActivate: [AuthorizeGuard], data: { actionModule: Permissions.ROLES_PERMISSION_ADD}},
    {path: 'role_edit/:id', component: RolePermissionEditComponent, canActivate: [AuthorizeGuard], data: { actionModule: Permissions.ROLES_PERMISSION_EDIT}}
  ],canActivate: [AuthorizeGuard], data: { actionModule: Permissions.LAYOUT}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
