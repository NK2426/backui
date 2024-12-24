import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// import { EnvService } from './env.service';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Analytics } from '../models/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  AnalyticsApiUrl: string = `${environment.HR_HEAD_BASE_URL}analytics`;

  constructor(private http: HttpClient, private env: EnvService) {}

  salesvalue(): Observable<any> {
    return this.http.get<Analytics>(this.AnalyticsApiUrl + '/salesvalue', this.env.httpOptions)
  }
  inventorydetails(): Observable<any> {
    return this.http.get<Analytics>(this.AnalyticsApiUrl + '/inventorydetails', this.env.httpOptions)
  }

  inwardqty_status(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.AnalyticsApiUrl + '/inwardqty_status' , this.env.httpOptions)
  }

  pocounts(): Observable<any> {
    return this.http.get<any>(this.AnalyticsApiUrl + '/pocounts' , this.env.httpOptions).pipe(map(res => res['data']));
  }
  postatus(): Observable<any> {
    return this.http.get<Analytics>(this.AnalyticsApiUrl + '/postatus' , this.env.httpOptions)
  }
  povalue(): Observable<any> {
    return this.http.get<Analytics>(this.AnalyticsApiUrl + '/povalue', this.env.httpOptions)
  }
}
