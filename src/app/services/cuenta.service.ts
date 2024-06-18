import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, throwError } from 'rxjs';
import { Cuenta } from '../models/cuenta';

@Injectable({
  providedIn: 'root',
})
export class CuentaService {
  private apiUrl = 'https://api-desarrollo-sw-production.up.railway.app/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getCuentas(): Observable<Cuenta[]> {
    return this.http
      .get<Cuenta[]>(`${this.apiUrl}/cuentas`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  registerCuenta(nombre_titular: string): Observable<Cuenta> {
    const data = { nombre_titular };
    return this.http
      .post<Cuenta>(`${this.apiUrl}/cuentas`, data, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  addServiciosToCuenta(
    cuentaId: string,
    servicioIds: string[]
  ): Observable<Cuenta> {
    const data = { cuenta: cuentaId, servicios: servicioIds };
    return this.http
      .post<Cuenta>(
        `${this.apiUrl}/cuentas/add/servicios`,
        data,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  addProductosToCuenta(
    cuentaId: string,
    productos: { sku: string; cantidad: number }[]
  ): Observable<Cuenta> {
    const data = { cuenta: cuentaId, productos: productos };
    return this.http
      .post<Cuenta>(
        `${this.apiUrl}/cuentas/add/productos`,
        data,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  pagarProductos(cuentaId: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/cuentas/pagar/p/${cuentaId}`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  pagarServicios(cuentaId: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/cuentas/pagar/s/${cuentaId}`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateCuenta(
    idCuenta: string,
    cuentaData: { nombre_titular: string }
  ): Observable<any> {
    return this.http
      .patch<any>(
        `${this.apiUrl}/cuentas/${idCuenta}`,
        cuentaData,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteCuenta(idCuenta: string): Observable<Cuenta> {
    return this.http
      .delete<Cuenta>(`${this.apiUrl}/cuentas/${idCuenta}`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
