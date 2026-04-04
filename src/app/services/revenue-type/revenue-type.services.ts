import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class RevenueTypeService {

  private backend = environment; // API em desenvolvimento

  constructor(private http: HttpClient, private utils: UtilsService) { }

  read(): Observable<any> {
    return this.http.post(
    `${this.backend}/revenue-type/read`,
    {},
    { withCredentials: true }).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }

  readById(id: String): Observable<any> {
    return this.http.get(
    `${this.backend}/revenue-type/read/${id}`,
    { withCredentials: true }).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }

  create(data: Object): Observable<any> {
    return this.http.post(
    `${this.backend}/revenue-type/create`,
    data,
    {withCredentials: true}).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }

  update(id: String, data: Object): Observable<any> {
    return this.http.put(
    `${this.backend}/revenue-type/update/${id}`,
    data,
    {withCredentials: true}).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }

  delete(params: String): Observable<any> {
    return this.http.delete(
    `${this.backend}/revenue-type/delete/` + params,
    {withCredentials: true}).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }
}
