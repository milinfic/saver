import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private backend = environment; // API em desenvolvimento

  constructor(private http: HttpClient) { }

  read(params: String): Observable<any> {
    return this.http.get(
    `${this.backend}/dashboard`,
    { withCredentials: true });
  }
}
