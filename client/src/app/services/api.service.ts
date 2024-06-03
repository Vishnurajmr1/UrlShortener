import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  createUrl(url: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/url`, url);
  }
}
