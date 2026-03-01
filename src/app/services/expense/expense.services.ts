import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private backend = environment; // API em desenvolvimento

  constructor(private http: HttpClient) { }

  read(): Observable<any> {
    return this.http.post(
    `${this.backend}/expense/read`,
    { withCredentials: true });
  }

  readById(id: String): Observable<any> {
    return this.http.get(
    `${this.backend}/expense/read/${id}`,
    { withCredentials: true });
  }

  create(data: Object): Observable<any> {
    return this.http.post(
    `${this.backend}/expense/create`,
    data,
    {withCredentials: true});
  }

  update(id: String, data: Object): Observable<any> {
    return this.http.put(
    `${this.backend}/expense/update/${id}`,
    data,
    {withCredentials: true});
  }

  delete(params: String): Observable<any> {
    return this.http.delete(
    `${this.backend}/expense/delete/` + params,
    {withCredentials: true});
  }
}
