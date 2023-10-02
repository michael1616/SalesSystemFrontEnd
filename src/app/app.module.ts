import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AngularMaterialModule } from './shared/angular-material/angular-material.module';

import { LOCALE_ID } from "@angular/core";
import { registerLocaleData } from '@angular/common';
import localeCo from '@angular/common/locales/es-CO';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

registerLocaleData(localeCo, 'es-CO');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule
  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: "es-CO"
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
