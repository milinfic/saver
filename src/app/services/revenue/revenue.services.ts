import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  private backend = environment; // API em desenvolvimento

  constructor(private http: HttpClient, private utils: UtilsService) { }

  read(data: Object = {}): Observable<any> {
    return this.http.post(
    `${this.backend}/revenue/read`,
    data,
    { withCredentials: true }).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }

  readById(id: String): Observable<any> {
    return this.http.get(
    `${this.backend}/revenue/read/${id}`,
    { withCredentials: true }).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }

  create(data: Object): Observable<any> {
    return this.http.post(
    `${this.backend}/revenue/create`,
    data,
    {withCredentials: true}).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }

  update(id: String, data: Object): Observable<any> {
    return this.http.put(
    `${this.backend}/revenue/update/${id}`,
    data,
    {withCredentials: true}).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }

  delete(params: String): Observable<any> {
    return this.http.delete(
    `${this.backend}/revenue/delete/` + params,
    {withCredentials: true}).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }
}
