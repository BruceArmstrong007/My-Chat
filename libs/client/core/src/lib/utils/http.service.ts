import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { injectConfig } from '../core.di';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
    private readonly client = inject(HttpClient);
    private readonly url = injectConfig();
    headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    get(url: string): Observable<any>{
        return this.client.get<any>(this.url.API_URL+url, {
            headers: this.headers,
            withCredentials: true
          })
    }

    post(url: string,data : any): Observable<any>{
        return this.client.post<any>(this.url.API_URL+url,data, {
            headers: this.headers,
            withCredentials: true
          })
    }

}

