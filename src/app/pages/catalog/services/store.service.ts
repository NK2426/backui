import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Store, StorePaginate } from '../models/store';


const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class StoreManagerService {
  StoreApiUrl: string = `${environment.CATALOG_BASE_URL}/stores`;

  constructor(private http: HttpClient, private env: EnvService) {}

  getAll(params: {}): Observable<StorePaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<StorePaginate>(this.StoreApiUrl, option);
  }
  create(FormData: FormData): Observable<Store> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Store>(this.StoreApiUrl +'/add', FormData, { headers });
  }
  update(data: FormData,id:any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Store>(this.StoreApiUrl + '/' + id, data,{ headers });
  }
  view(data:string):Observable<Store>{
    let option = this.env.httpOptions;
    return this.http.get<any>(this.StoreApiUrl + '/' + data, option)
      .pipe(map(res => res.data))
  }
  state_image(data:number):Observable<any>{
    let option = this.env.httpOptions;
    return this.http.get<any>(this.StoreApiUrl + '/state_image/' + data, option)
      .pipe(map(res => res.data))
  }
  delete(data: Store): Observable<any> {
    return this.http.delete<Store>(this.StoreApiUrl + '/' + data.id);
  }
  getStates(): Observable<any> {
    return this.http.get<any>(this.StoreApiUrl + '/getStates', this.env.httpOptions);
  }
}
