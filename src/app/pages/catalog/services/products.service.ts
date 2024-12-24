import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Brands } from '../models/brands';
import { Categories } from '../models/categories';
import { Group } from '../models/groups';
import { Product, Productimage, Productpaginate } from '../models/product';
import { Productparameters } from '../models/productparameters';
import { Productvariants } from '../models/productvariants';
import { Subcategories } from '../models/subcategories';
import { Vendor, Vendormapping } from '../models/vendor';

const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  ProductApiUrl: string = `${environment.CATALOG_BASE_URL}/products`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Productpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Productpaginate>(this.ProductApiUrl, option);
  }

  getAllreq(params: {}): Observable<Productpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Productpaginate>(this.ProductApiUrl + '/request', option);
  }

  create(data: Product): Observable<Product> {
    //console.log(JSON.stringify(data));
    return this.http.post<any>(this.ProductApiUrl, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  update(data: Product): Observable<Product> {
    return this.http.put<any>(this.ProductApiUrl + '/' + data.uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  delete(data: Product): Observable<Product> {
    return this.http.delete<Product>(this.ProductApiUrl + '/' + data.uuid);
  }
  singlevendormap(data: any, uuid: any): Observable<any> {
    return this.http.post<any>(this.ProductApiUrl + '/addvendor/' + uuid, data, this.env.httpOptions);
  }
  singlevarmap(data: any, uuid: any): Observable<any> {
    return this.http.post<any>(this.ProductApiUrl + '/addvar/' + uuid, data, this.env.httpOptions);
  }
  removeVar(id: string): Observable<any> {
    return this.http.delete<any>(this.ProductApiUrl + '/removevar/' + id);
  }
  removeVendor(id: string): Observable<any> {
    return this.http.delete<any>(this.ProductApiUrl + '/removevendor/' + id);
  }
  getParams(): Observable<Product> {
    //console.log(this.http.get<Product>(this.ProductApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Product>(this.ProductApiUrl + '/list', this.env.httpOptions);
  }

  find(uuid: string, params: {}): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(this.ProductApiUrl + '/' + uuid, option)
      .pipe(map(res => res.data))
  }
  getlistall(did: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/' + did + '/listall', option)
      .pipe(map(res => res.data))
  }
  getcatlist(did: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/' + did + '/catlist', option)
      .pipe(map(res => res.data))
  }
  getpolist(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/polist', option)
      .pipe(map(res => res.data))
  }
  taxlist(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/taxlist', option)
      .pipe(map(res => res.data))
  }
  variantlist(did: any): Observable<Productvariants[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/' + did + '/variantlist', option)
      .pipe(map(res => res.data))
  }
  vendorlist(): Observable<Vendor[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/vendor/list', option)
      .pipe(map(res => res.data))
  }
  parameterlist(did: any, cid: any, subid: any): Observable<Productparameters[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/' + did + '/' + cid + '/' + subid + '/parameters/list', option)
      .pipe(map(res => res.data))
  }
  mapping(data: any, uuid: string): Observable<Product> {
    return this.http.post<any>(this.ProductApiUrl + '/mapping/' + uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  saveGallery(uuid: any, formdata: any): Observable<Productimage> {
    return this.http.put<any>(this.ProductApiUrl + '/gallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }
  addprice(data: any): Observable<Vendormapping> {
    return this.http.put<any>(this.ProductApiUrl + '/price/' + data.id, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  catlist(did: string): Observable<Categories[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/catlist/' + did, option)
      .pipe(map(res => res.data))
  }
  subcatlist(did: any, cid: string): Observable<Subcategories[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/subcatlist/' + did + '/' + cid, option)
      .pipe(map(res => res.data))
  }
  brandlist(did: any): Observable<Brands[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/brandlist/' + did, option)
      .pipe(map(res => res.data))
  }

  grouplist(did: any, subcatid: string): Observable<Group[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/grouplist/' + did + '/' + subcatid, option)
      .pipe(map(res => res.data))
  }

  search(term: string): Observable<any> {
    if (term === '') {
      return of([]);
    }
    return this.http.get<any>(this.ProductApiUrl + '/search', { params: PARAMS.set('search', term) })
      .pipe(map(res => res['data']))
  }

  bsearch(term: string, deptid: any): Observable<any> {
    if (term === '') {
      return of([]);
    }
    return this.http.get<any>(this.ProductApiUrl + '/bsearch/' + deptid, { params: PARAMS.set('search', term) })
      .pipe(map(res => res['data']))
  }

  createBrand(data: Brands): Observable<any> {
    // console.log(JSON.stringify(data));
    return this.http.post<Brands>(this.ProductApiUrl + '/createbrand', data, this.env.httpOptions);
  }

}
