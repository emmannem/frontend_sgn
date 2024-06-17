import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

interface AuthResponse {
  email: string;
  expiresIn: string;
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl =
    'https://api-desarrollo-sw-production.up.railway.app/api/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        const decodedToken: any = jwtDecode(response.accessToken);
        localStorage.setItem('userRole', decodedToken.rol.nombre);
        console.log('token: ', decodedToken);
        console.log('rol: ', decodedToken.rol.nombre);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
  }
}
