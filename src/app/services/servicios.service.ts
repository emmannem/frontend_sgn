import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError } from 'rxjs';
import { Servicio } from '../models/servicio';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private apiUrl = 'https://api-desarrollo-sw-production.up.railway.app/api';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  getServicios(): Observable<Servicio[]> {
    return this.http
      .get<Servicio[]>(`${this.apiUrl}/servicios`, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  registerServicio(data: Servicio): Observable<Servicio> {
    const { tarifas, ...datas } = data
    const datatarifas = tarifas.map((d) => {
      return {
        precio_base: parseFloat(d.precio_base),
        unidad_facturacion: d.unidad_facturacion
      }
    })
    const r = {
      ...datas,
      tarifas: datatarifas
    }
    console.log(data)

    return this.http
      .post<Servicio>(`${this.apiUrl}/servicios`, r, this.httpOptions)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateServicio(
    id: string,
    data: Partial<Servicio>
  ): Observable<Servicio> {
    console.log(data)

    const { tarifas, ...datas } = data

    const datatarifas = tarifas!.map((d) => {
      return {
        precio_base: parseFloat(d.precio_base.replace('$', '')),
        unidad_facturacion: d.unidad_facturacion
      }
    })
    const r = {
      ...datas,
      tarifas: tarifas!.length > 0 ? datatarifas : undefined
    }
    console.log(r)

    return this.http
      .patch<Servicio>(
        `${this.apiUrl}/servicios/${id}`,
        r,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteServicio(id: string | undefined): Observable<string> {
    return this.http
      .delete(`${this.apiUrl}/servicios/${id}`, { responseType: 'text' })
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
