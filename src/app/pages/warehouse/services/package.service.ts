import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Packagepaginate, Packages } from '../models/packages';
import { Packagetypes } from '../models/packagetypes';

const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  ShelfingApiUrl: string = `${environment.WAREHOUSE_BASE_URL}packages`;
  //GroupApiUrl:string = `${environment.WAREHOUSE_BASE_URL}groups`;


  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Packagepaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Packagepaginate>(this.ShelfingApiUrl, option);
  }

  create(data: Packages): Observable<any> {
    //console.log(JSON.stringify(data));
    return this.http.post<Packages>(this.ShelfingApiUrl, data, this.env.httpOptions);
  }
  update(data: Packages): Observable<any> {
    return this.http.put<Packages>(this.ShelfingApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }
  delete(data: Packages): Observable<Packages> {
    return this.http.delete<Packages>(this.ShelfingApiUrl + '/' + data.uuid);
  }

  getPackagetypes(): Observable<any> {
    return this.http.get<any>(this.ShelfingApiUrl + '/packagetypes', this.env.httpOptions);
  }

  getParambyids(data: any): Observable<Packages> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Packages>(this.ShelfingApiUrl + '/paramids', option);
  }

  search(term: string): Observable<any> {
    if (term === '') {
      return of([]);
    }
    return this.http.get<any>(this.ShelfingApiUrl + '/search', { params: PARAMS.set('search', term) })
      .pipe(map(res => res['data']))
  }

  savetype(data: Packagetypes): Observable<any> {
    return this.http.post<any>(this.ShelfingApiUrl + '/savetype', data, this.env.httpOptions).pipe(map(res => res.data));
  }


}
