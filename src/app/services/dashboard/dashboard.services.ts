import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private backend = environment; // API em desenvolvimento

  constructor(private http: HttpClient, private utils: UtilsService) { }

  read(params: String): Observable<any> {
    return this.http.get(
    `${this.backend}/dashboard`,
    { withCredentials: true }).pipe(
      map(response => this.utils.handleApiResponse(response))
    );
  }
}
