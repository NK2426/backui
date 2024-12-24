import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Department } from '../models/department';
import { Group } from '../models/inventory';
import { Itempaginate } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  InventoryApiUrl: string = `${environment.CATALOG_BASE_URL}/inventory`;
  siteurl: string = `${environment.CATALOG_SITE_URL}`;


  constructor(private http: HttpClient, private env: EnvService) { }


  creategroup(data: any, id: any): Observable<Group> {
    return this.http.post<any>(this.InventoryApiUrl + '/creategroup/' + id, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  createwebgroup(data: any, id: any): Observable<Group> {
    return this.http.post<any>(this.InventoryApiUrl + '/createitemgroup/' + id, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  createstock(data: any, id: any): Observable<Group> {
    return this.http.post<any>(this.InventoryApiUrl + '/stock/' + id, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  createwebstock(data: any, id: any): Observable<Group> {
    return this.http.post<any>(this.InventoryApiUrl + '/webstock/' + id, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  getStocks(params: {}): Observable<Itempaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Itempaginate>(this.InventoryApiUrl + '/stocksall', option)
  }
  departments(): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/departments', option)
      .pipe(map(res => res.data))
  }


}
