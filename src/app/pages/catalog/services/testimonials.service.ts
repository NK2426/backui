import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { TestimonialsPaginate,Testimonials } from '../models/testimonials';




const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {
  TestimonialsApiUrl: string = `${environment.CATALOG_BASE_URL}/testimonials`;

  constructor(private http: HttpClient, private env: EnvService) {}

  getAll(params: {}): Observable<TestimonialsPaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<TestimonialsPaginate>(this.TestimonialsApiUrl, option);
  }
  create(FormData: FormData): Observable<Testimonials> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Testimonials>(this.TestimonialsApiUrl +'/', FormData, { headers });
  }
  update(data: FormData,id:any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Testimonials>(this.TestimonialsApiUrl + '/' + id, data,{ headers });
  }
  view(data:string):Observable<Testimonials>{
    let option = this.env.httpOptions;
    return this.http.get<any>(this.TestimonialsApiUrl + '/' + data, option)
      .pipe(map(res => res.data))
  }
  
  delete(data: Testimonials): Observable<any> {
    return this.http.delete<Testimonials>(this.TestimonialsApiUrl + '/' + data.id);
  }
  
}
