import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

import { Shelfing, Shelfingpaginate } from '../models/shelfing';


@Injectable({
  providedIn: 'root'
})
export class ShelfingService {

  ShelfingApiUrl: string = `${environment.CATALOG_BASE_URL}/shelves`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Shelfingpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Shelfingpaginate>(this.ShelfingApiUrl, option);
  }

  create(data: Shelfing): Observable<any> {
    //console.log(JSON.stringify(data));
    return this.http.post<Shelfing>(this.ShelfingApiUrl, data, this.env.httpOptions);
  }
  update(data: Shelfing): Observable<any> {
    return this.http.put<Shelfing>(this.ShelfingApiUrl + '/' + data.id, data, this.env.httpOptions);
  }
  delete(data: Shelfing): Observable<Shelfing> {
    return this.http.delete<Shelfing>(this.ShelfingApiUrl + '/' + data.id);
  }

  getClass(): Observable<any> {
    return this.http.get<any>(this.ShelfingApiUrl + '/catlist', this.env.httpOptions);
  }

  getSubclass(): Observable<any> {
    return this.http.get<any>(this.ShelfingApiUrl + '/subcatlist', this.env.httpOptions);
  }

  getParambyids(data: any): Observable<Shelfing> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Shelfing>(this.ShelfingApiUrl + '/paramids', option);
  }


}
