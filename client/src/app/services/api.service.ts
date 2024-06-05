import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IApiUrl } from '../shared/models/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  private dataSource$ = new BehaviorSubject<IApiUrl | null>(null);
  urlData$ = this.dataSource$.asObservable();

  createUrl(url: string): Observable<IApiUrl> {
    return this.http.post<IApiUrl>(`${this.baseUrl}/url`, { url });
  }
  getShortUrl(shortId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/url/${shortId}`);
  }
  deleteShortUrl(shortId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/url/${shortId}`);
  }
  setData(data: IApiUrl) {
    this.dataSource$.next(data);
  }
}
