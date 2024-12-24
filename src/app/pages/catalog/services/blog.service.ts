import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

import { Blog, BlogPaginate } from '../models/blog';


const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  BlogApiUrl: string = `${environment.CATALOG_BASE_URL}/blogs`;

  constructor(private http: HttpClient, private env: EnvService) {}

  getAll(params: {}): Observable<BlogPaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<BlogPaginate>(this.BlogApiUrl, option);
  }
  create(FormData: FormData): Observable<Blog> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Blog>(this.BlogApiUrl +'/', FormData, { headers });
  }
  update(data: FormData,id:any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Blog>(this.BlogApiUrl + '/' + id, data,{ headers });
  }
  view(data:string):Observable<Blog>{
    let option = this.env.httpOptions;
    return this.http.get<any>(this.BlogApiUrl + '/' + data, option)
      .pipe(map(res => res.data))
  }
  
  delete(data: Blog): Observable<any> {
    return this.http.delete<Blog>(this.BlogApiUrl + '/' + data.id);
  }
  
}
