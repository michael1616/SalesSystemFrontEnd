import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserComponent } from './pages/user/user.component';
import { ProductComponent } from './pages/product/product.component';
import { SaleComponent } from './pages/sale/sale.component';
import { RecordSaleComponent } from './pages/record-sale/record-sale.component';
import { ReportSaleComponent } from './pages/report-sale/report-sale.component';
import { AngularMaterialModule } from 'src/app/shared/angular-material/angular-material.module';
import { UserModalComponent } from './modals/user-modal/user-modal.component';
import { ProductModalComponent } from './modals/product-modal/product-modal.component';
import { SaleDetailModalComponent } from './modals/sale-detail-modal/sale-detail-modal.component';
import { RoleComponent } from './pages/role/role.component';
import { RolePermissionAddComponent } from './pages/role/role-permission-add/role-permission-add.component';
import { RolePermissionEditComponent } from './pages/role/role-permission-edit/role-permission-edit.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    ProductComponent,
    SaleComponent,
    RecordSaleComponent,
    ReportSaleComponent,
    UserModalComponent,
    ProductModalComponent,
    SaleDetailModalComponent,
    RoleComponent,
    RolePermissionAddComponent,
    RolePermissionEditComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    AngularMaterialModule
  ]
})
export class LayoutModule { }
