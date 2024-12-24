import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { video, videoPaginate } from '../models/videoModel';



const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  StoreApiUrl: string = `${environment.CATALOG_BASE_URL}/video/`;
  videoApiUrl: string = `${environment.CATALOG_BASE_URL}/video/`;
  constructor(private http: HttpClient, private env: EnvService) {}

  getAll(params: {}): Observable<videoPaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<videoPaginate>(this.StoreApiUrl, option);
  }
  getslots(): Observable<any> {
    let option = this.env.httpOptionsparams;
  
    return this.http.get<videoPaginate>(this.videoApiUrl+'slots',);
  }
  update(FormData: FormData,value:any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(this.StoreApiUrl+'edit/' +value, FormData, { headers });
  }
  
}
