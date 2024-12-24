import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

import { Shelfing, Shelfingpaginate } from '../models/shelfing';

const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class ShelfingService {

  ShelfingApiUrl: string = `${environment.WAREHOUSE_BASE_URL}shelves`;
  //GroupApiUrl:string = `${environment.WAREHOUSE_BASE_URL}groups`;

  baseurl: string = `${environment.WAREHOUSE_BASE_URL}`;



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

  search(term: string): Observable<any> {
    if (term === '') {
      return of([]);
    }
    return this.http.get<any>(this.ShelfingApiUrl + '/search', { params: PARAMS.set('search', term) })
      .pipe(map(res => res['data']))
  }

  getProducts(gid: any): Observable<any> {
    return this.http.get<any>(this.ShelfingApiUrl + '/prodlist/' + gid, this.env.httpOptions);
  }

  download(): Observable<any> {
    return this.http.get<any>(this.ShelfingApiUrl + '/pdf', this.env.httpOptions);
  }

  // getpsidList(params: {}): Observable<Deductedpsidpaginate> {
  //   let option = this.env.httpOptionsparams;
  //   option['params'] = params;
  //   return this.http.get<Deductedpsidpaginate>(this.ShelfingApiUrl + '/getpsiddeductedlist', option)
  // }

  // savecoins(data: any) {
  //   return this.http.post<any>(this.ShelfingApiUrl + '/psidqtydeduction', data, this.env.httpOptions)
  //     .pipe(map(res => res))
  // }
}
