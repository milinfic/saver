import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTypeService {

  private backend = environment; // API em desenvolvimento

  constructor(private http: HttpClient) { }

  read(): Observable<any> {
    return this.http.post(
    `${this.backend}/expensive-type/read`,
    { withCredentials: true });
  }

  create(data: Object): Observable<any> {
    return this.http.post(
    `${this.backend}/expensive-type/create`,
    data,
    {withCredentials: true});
  }
}
