import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Tax, Taxpaginate } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class TaxService {

  TaxApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}tax`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Taxpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Taxpaginate>(this.TaxApiUrl, option);
  }

  create(data: Tax): Observable<Tax> {
    //console.log(JSON.stringify(data));
    return this.http.post<Tax>(this.TaxApiUrl, data, this.env.httpOptions);
  }
  update(data: Tax): Observable<Tax> {
    return this.http.put<Tax>(this.TaxApiUrl + '/' + data.id, data, this.env.httpOptions);
  }
  delete(data: Tax): Observable<any> {
    return this.http.delete<Tax>(this.TaxApiUrl + '/' + data.id);
  }

  find(id: any): Observable<any> {
    return this.http.get<Tax>(this.TaxApiUrl + '/' + id, this.env.httpOptions);
  }

  getParams(): Observable<Tax> {
    //console.log(this.http.get<Tax>(this.TaxApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Tax>(this.TaxApiUrl + '/list', this.env.httpOptions);
  }

  getParambyids(data: any): Observable<Tax> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Tax>(this.TaxApiUrl + '/paramids', option);
  }

}
