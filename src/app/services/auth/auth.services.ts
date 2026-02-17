import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backend = 'http://localhost:3000'; // API em desenvolvimento

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.backend}/auth/login`, { email, password }, {
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.backend}/auth/logout`, {}, {
      withCredentials: true
    });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.backend}/auth/profile`, {
      withCredentials: true
    });
  }

  refresh() {
    return this.http.post(`${this.backend}/auth/refresh`, {}, {
      withCredentials: true
    });
  }
}
