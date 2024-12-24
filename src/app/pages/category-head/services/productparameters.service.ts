import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

import { Productparameters, Productparameterspaginate } from '../models/productparameters';

@Injectable({
  providedIn: 'root'
})
export class ProductparametersService {

  ProductparametersApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}productparameters`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Productparameterspaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Productparameterspaginate>(this.ProductparametersApiUrl, option);
  }

  create(data: Productparameters): Observable<Productparameters> {
    //console.log(JSON.stringify(data));
    return this.http.post<Productparameters>(this.ProductparametersApiUrl, data, this.env.httpOptions);
  }
  update(data: Productparameters): Observable<Productparameters> {
    return this.http.put<Productparameters>(this.ProductparametersApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }
  singleValue(data: any, uuid: any): Observable<any> {
    return this.http.post<any>(this.ProductparametersApiUrl + '/value/' + uuid, data, this.env.httpOptions);
  }
  values(data: any, uuid: any): Observable<any> {
    return this.http.post<any>(this.ProductparametersApiUrl + '/values/' + uuid, data, this.env.httpOptions);
  }
  delete(data: Productparameters): Observable<any> {
    return this.http.delete<Productparameters>(this.ProductparametersApiUrl + '/' + data.uuid);
  }

  findparamassoc(id: any): Observable<any> {
    return this.http.get<Productparameters>(this.ProductparametersApiUrl + '/findParam/' + id, this.env.httpOptions);
  }

  deleteValue(id: string): Observable<any> {
    return this.http.delete<any>(this.ProductparametersApiUrl + '/value/' + id);
  }
  getParams(): Observable<Productparameters> {
    //console.log(this.http.get<Productparameters>(this.ProductparametersApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Productparameters>(this.ProductparametersApiUrl + '/list', this.env.httpOptions);
  }
  findList(did: any): Observable<any> {
    return this.http.get<any>(this.ProductparametersApiUrl + '/list/' + did, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  getParambyids(data: any): Observable<Productparameters> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Productparameters>(this.ProductparametersApiUrl + '/paramids', option);
  }
}
