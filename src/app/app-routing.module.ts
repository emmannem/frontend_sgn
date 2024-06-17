import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CuentasComponent } from './components/cuentas/cuentas.component';
import { IngredientesComponent } from './components/ingredientes/ingredientes.component';
import { PersonalComponent } from './components/personal/personal.component';
import { ProductosComponent } from './components/productos/productos.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ExistenciasComponent } from './components/existencias/existencias.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['administrador', 'ayudante'] },
      },
      {
        path: 'personal',
        component: PersonalComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['administrador'] },
      },
      {
        path: 'productos',
        component: ProductosComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['administrador'] },
      },
      {
        path: 'ingredientes',
        component: IngredientesComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['administrador'] },
      },
      {
        path: 'servicios',
        component: ServiciosComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['administrador'] },
      },
      {
        path: 'cuentas',
        component: CuentasComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['administrador', 'ayudante'] },
      },
      {
        path: 'existencias',
        component: ExistenciasComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: ['administrador', 'ayudante'] },
      },
    ],
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
