import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  private backend = environment; // API em desenvolvimento

  constructor(private http: HttpClient) { }

  read(): Observable<any> {
    return this.http.post(
    `${this.backend}/revenue/read`,
    { withCredentials: true });
  }

  readById(id: String): Observable<any> {
    return this.http.get(
    `${this.backend}/revenue/read/${id}`,
    { withCredentials: true });
  }

  create(data: Object): Observable<any> {
    return this.http.post(
    `${this.backend}/revenue/create`,
    data,
    {withCredentials: true});
  }

  update(id: String, data: Object): Observable<any> {
    return this.http.put(
    `${this.backend}/revenue/update/${id}`,
    data,
    {withCredentials: true});
  }

  delete(params: String): Observable<any> {
    return this.http.delete(
    `${this.backend}/revenue/delete/` + params,
    {withCredentials: true});
  }
}
