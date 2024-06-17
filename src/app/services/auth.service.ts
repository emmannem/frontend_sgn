import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
