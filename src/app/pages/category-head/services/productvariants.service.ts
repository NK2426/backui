import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Group } from '../models/groups';
import { Subcategories } from '../models/subcategories';

import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Categories } from '../models/categories';
import { Productvariants, Productvariantspaginate } from '../models/productvariants';

@Injectable({
  providedIn: 'root'
})
export class ProductvariantsService {

  ProductvariantsApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}productvariants`;
  ProductApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}products`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Productvariantspaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Productvariantspaginate>(this.ProductvariantsApiUrl, option);
  }
  getAllVariants(params: {}): Observable<Productvariantspaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Productvariantspaginate>(this.ProductvariantsApiUrl+'/find/all', option);
  }
 
  getvariantlist(did: any): Observable<any> {
    return this.http.get<any>(this.ProductvariantsApiUrl + '/' + did+ '/getvariantlist', this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  

  create(data: Productvariants): Observable<Productvariants> {
    //console.log(JSON.stringify(data));
    return this.http.post<any>(this.ProductvariantsApiUrl, data, this.env.httpOptions).pipe(map(res=>res.data));
  }
  update(data: Productvariants): Observable<Productvariants> {
    return this.http.put<Productvariants>(this.ProductvariantsApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }
  values(data: any, uuid: any): Observable<any> {
    return this.http.post<any>(this.ProductvariantsApiUrl + '/values/' + uuid, data, this.env.httpOptions);
  }
  singleValue(data: any, uuid: any): Observable<any> {
    return this.http.post<any>(this.ProductvariantsApiUrl + '/value/' + uuid, data, this.env.httpOptions);
  }
  singleValueimg(data: any, uuid: any): Observable<any> {
    return this.http.post<any>(this.ProductvariantsApiUrl + '/valueimg/' + uuid, data).pipe(map(res => res.data));
  }
  delete(data: Productvariants): Observable<any> {
    return this.http.delete<Productvariants>(this.ProductvariantsApiUrl + '/' + data.uuid);
  }
  deleteValue(id: string): Observable<any> {
    return this.http.delete<any>(this.ProductvariantsApiUrl + '/value/' + id);
  }

  getParams(): Observable<Productvariants> {
    //console.log(this.http.get<Productvariants>(this.ProductvariantsApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Productvariants>(this.ProductvariantsApiUrl + '/list', this.env.httpOptions);
  }
  findList(did: any): Observable<any> {
    return this.http.get<any>(this.ProductvariantsApiUrl + '/list/' + did, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  getParambyids(data: any): Observable<Productvariants> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Productvariants>(this.ProductvariantsApiUrl + '/paramids', option);
  }

  findvarassoc(id: any): Observable<any> {
    return this.http.get<Productvariants>(this.ProductvariantsApiUrl + '/findVar/' + id, this.env.httpOptions);
  }

  saveData(formdata: Productvariants): Observable<Productvariants> {
    return this.http.post<any>(this.ProductvariantsApiUrl + '/savefiledata', formdata)
      .pipe(map(res => res.data))
  }

  catlist(did: string): Observable<Categories[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/catlist/' + did, option)
      .pipe(map(res => res.data))
  }

  subcatlist(did: any, cid: string): Observable<Subcategories[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductvariantsApiUrl + '/subcatlist/' + did + '/' + cid, option)
      .pipe(map(res => res.data))
  }
  grouplist(did: any, subcatid: string): Observable<Group[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductvariantsApiUrl + '/grouplist/' + did + '/' + subcatid, option)
      .pipe(map(res => res.data))
  }

}
