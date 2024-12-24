import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Notifications, Notificationspaginate } from '../models/normalnotification';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  DocumentsApiUrl: string = `${environment.CATALOG_BASE_URL}/notifications`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}, uid: any): Observable<Notificationspaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Notificationspaginate>(this.DocumentsApiUrl + '/all/' + uid, option);
  }

  create(data: Notifications): Observable<Notifications> {
    //console.log(JSON.stringify(data));
    return this.http.post<any>(this.DocumentsApiUrl, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  update(data: Notifications): Observable<Notifications> {
    return this.http.put<any>(this.DocumentsApiUrl + '/' + data.id, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  delete(id: number): Observable<Notifications> {
    return this.http.delete<Notifications>(this.DocumentsApiUrl + '/' + id);
  }

  find(id: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.DocumentsApiUrl + '/' + id, option)
      .pipe(map(res => res.data))
  }


}
