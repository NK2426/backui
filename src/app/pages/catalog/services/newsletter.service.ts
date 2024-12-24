import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Newsletter, NewsletterPaginate } from '../models/newsletter';




const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  NewsletterApiUrl: string = `${environment.CATALOG_BASE_URL}/news`;

  constructor(private http: HttpClient, private env: EnvService) {}

  getAll(params: {}): Observable<NewsletterPaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<NewsletterPaginate>(this.NewsletterApiUrl, option);
  }
  getAllEmail(params: {}): Observable<NewsletterPaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<NewsletterPaginate>(this.NewsletterApiUrl+'/emails', option);
  }
  create(FormData: FormData): Observable<Newsletter> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Newsletter>(this.NewsletterApiUrl +'/', FormData, { headers });
  }
  update(data: FormData,id:any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Newsletter>(this.NewsletterApiUrl + '/' + id, data,{ headers });
  }
  view(data:string):Observable<Newsletter>{
    let option = this.env.httpOptions;
    return this.http.get<any>(this.NewsletterApiUrl + '/' + data, option)
      .pipe(map(res => res.data))
  }
  
  delete(data: Newsletter): Observable<any> {
    return this.http.delete<Newsletter>(this.NewsletterApiUrl + '/' + data.id);
  }
  
}
