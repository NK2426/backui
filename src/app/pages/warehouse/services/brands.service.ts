import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Brands, Brandspaginate } from '../models/brands';



@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  BrandsApiUrl: string = `${environment.WAREHOUSE_BASE_URL}brands`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Brandspaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Brandspaginate>(this.BrandsApiUrl, option);
  }

  findbrandassoc(id: any): Observable<any> {
    return this.http.get<Brands>(this.BrandsApiUrl + '/findBrand/' + id, this.env.httpOptions);
  }

  getParams(): Observable<Brands> {
    //console.log(this.http.get<Brands>(this.BrandsApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Brands>(this.BrandsApiUrl + '/list', this.env.httpOptions);
  }

  getParambyids(data: any): Observable<Brands> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Brands>(this.BrandsApiUrl + '/paramids', option);
  }

  find(uuid: any): Observable<any> {
    return this.http.get<any>(this.BrandsApiUrl + '/' + uuid, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  updateimg(formdata: Brands): Observable<Brands> {
    return this.http.post<any>(this.BrandsApiUrl + '/saveimgdata', formdata)
      .pipe(map(res => res.data))
  }

}
