import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, throwError } from 'rxjs';
import { Ingrediente } from '../models/ingrediente';

@Injectable({
  providedIn: 'root',
})
export class IngredienteService {
  private apiUrl = 'https://api-desarrollo-sw-production.up.railway.app/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getIngredientes(): Observable<Ingrediente[]> {
    return this.http
      .get<Ingrediente[]>(`${this.apiUrl}/ingredientes`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  registerIngrediente(data: Ingrediente): Observable<Ingrediente> {
    return this.http
      .post<Ingrediente>(`${this.apiUrl}/ingredientes`, data, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateIngrediente(
    id: string,
    data: Partial<Ingrediente>
  ): Observable<Ingrediente> {
    return this.http
      .patch<Ingrediente>(
        `${this.apiUrl}/ingredientes/${id}`,
        data,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteIngrediente(id: string): Observable<string> {
    return this.http
      .delete(`${this.apiUrl}/ingredientes/${id}`, { responseType: 'text' })
      .pipe(catchError(this.handleError.bind(this)));
  }

  addStock(id: string, data: { agregar_stock: number }): Observable<void> {
    return this.http
      .patch<void>(`${this.apiUrl}/ingredientes/${id}`, data, this.httpOptions)
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
