import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Empleado } from '../models/empleado';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private apiUrl = 'https://api-desarrollo-sw-production.up.railway.app/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getEmpleados(): Observable<Empleado[]> {
    return this.http
      .get<Empleado[]>(`${this.apiUrl}/usuarios`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  registerEmpleado(data: Empleado): Observable<Empleado> {
    return this.http
      .post<Empleado>(`${this.apiUrl}/auth/register`, data, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateEmpleado(id: string, data: Empleado): Observable<Empleado> {
    return this.http
      .patch<Empleado>(`${this.apiUrl}/usuarios/${id}`, data, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteEmpleado(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/usuarios/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El servidor devolvió un código de error
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
