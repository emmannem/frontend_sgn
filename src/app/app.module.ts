import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PersonalComponent } from './components/personal/personal.component';
import { ProductosComponent } from './components/productos/productos.component';
import { IngredientesComponent } from './components/ingredientes/ingredientes.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { CuentasComponent } from './components/cuentas/cuentas.component';
import { LayoutComponent } from './components/layout/layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExistenciasComponent } from './components/existencias/existencias.component';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PersonalComponent,
    ProductosComponent,
    IngredientesComponent,
    ServiciosComponent,
    CuentasComponent,
    LayoutComponent,
    ExistenciasComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
