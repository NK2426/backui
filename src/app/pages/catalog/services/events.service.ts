import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

import { Events, EventsPaginate } from '../models/events';


const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class EventService {
  EventsApiUrl: string = `${environment.CATALOG_BASE_URL}/live-events`;

  constructor(private http: HttpClient, private env: EnvService) {}

  getAll(params: {}): Observable<EventsPaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<EventsPaginate>(this.EventsApiUrl, option);
  }
  create(FormData: FormData): Observable<Events> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Events>(this.EventsApiUrl , FormData, { headers });
  }
  update(data: FormData,id:any): Observable<any> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Events>(this.EventsApiUrl + '/' + id, data,{ headers });
  }
  view(data:string):Observable<Events>{
    let option = this.env.httpOptions;
    return this.http.get<any>(this.EventsApiUrl + '/' + data, option)
      .pipe(map(res => res.data))
  }
  
  delete(data: Events): Observable<any> {
    return this.http.delete<Events>(this.EventsApiUrl + '/' + data.id);
  }
  linkitemlist(type: any,show_type:any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.EventsApiUrl + '/linkitems/'  + type + '/'+show_type, option)
      .pipe(map(res => res.data))
  }
}
