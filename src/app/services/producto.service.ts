import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, throwError } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = 'https://api-desarrollo-sw-production.up.railway.app/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getProductos(): Observable<Producto[]> {
    return this.http
      .get<Producto[]>(`${this.apiUrl}/productos`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getProductosPreparados(): Observable<Producto[]> {
    return this.http
      .get<Producto[]>(`${this.apiUrl}/productos/preparados`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  registerProducto(data: Producto): Observable<Producto> {
    return this.http
      .post<Producto>(`${this.apiUrl}/productos`, data, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateProducto(id: string, data: Partial<Producto>): Observable<Producto> {
    return this.http
      .patch<Producto>(`${this.apiUrl}/productos/${id}`, data, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteProducto(id: string): Observable<string> {
    return this.http
      .delete(`${this.apiUrl}/productos/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError.bind(this)));
  }

  addStock(id: string, data: { stock: number }): Observable<void> {
    return this.http
      .patch<void>(`${this.apiUrl}/productos/${id}`, data, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }
  private handleError(error: HttpErrorResponse) {
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
