import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Brands } from '../models/brands';
import { Categories } from '../models/categories';
import { Product, Productimage, Productpaginate } from '../models/product';
import { Productparameters } from '../models/productparameters';
import { Productvariants } from '../models/productvariants';
import { Subcategories } from '../models/subcategories';
import { Vendor, Vendormapping } from '../models/vendor';
import { VENDOR_VARIANT } from '../models/vendorvariant';


const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  ProductCatalogApiUrl1: string = `${environment.CATALOG_BASE_URL}/directcatalog`
  ProductCatalogApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}/productvariants`
  ProductApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}products`;
  GroupApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}groups`;
  catalogApiUrl: string = `${environment.CATALOG_BASE_URL}direct`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Productpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Productpaginate>(this.ProductApiUrl, option);
  }

  search(term: string): Observable<any> {
    if (term === '') {
      return of([]);
    }
    return this.http.get<any>(this.GroupApiUrl + '/search', { params: PARAMS.set('search', term) })
      .pipe(map(res => res['data']))
  }

  vsearch(term: string): Observable<any> {
    if (term === '') {
      return of([]);
    }
    return this.http.get<any>(this.ProductApiUrl + '/vsearch', { params: PARAMS.set('search', term) })
      .pipe(map(res => res['data']))
  }

  getAllreq(params: {}): Observable<Productpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Productpaginate>(this.ProductApiUrl + '/request', option);
  }


  directcreate(data: Product): Observable<Product> {
    return this.http.post<any>(this.ProductCatalogApiUrl1+'/', data)//, this.env.httpOptions
      .pipe(map(res => res.data));
  }

  create(data: Product): Observable<Product> {
    return this.http.post<any>(this.ProductApiUrl, data)//, this.env.httpOptions
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
  findp(uuid: string): Observable<any> {

    return this.http.get<any>(this.ProductApiUrl + '/' + uuid)
      .pipe(map(res => res.data))
  }
  getlistall(did: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/' + did + '/listall', option)
      .pipe(map(res => res.data))
  }
  getcatlist(did: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/' + did + '/catlist', option)
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
  getvariantlist(gid: any): Observable<Productvariants[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/' + gid + '/getvariantlist', option)
      .pipe(map(res => res.data))
  }
  vendorlist(): Observable<Vendor[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/vendor/list', option)
      .pipe(map(res => res.data))
  }
  parameterlist(gid: any): Observable<Productparameters[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/' + gid + '/parameters/list', option)
      .pipe(map(res => res.data))
  }

  mappingparams(data: any, uuid: string): Observable<Product> {
    return this.http.post<any>(this.ProductApiUrl + '/mappingparams/' + uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  mapping(data: any, uuid: string): Observable<Product> {
    return this.http.post<any>(this.ProductApiUrl + '/mapping/' + uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  saveGallery(uuid: any, formdata: any): Observable<Productimage> {
    return this.http.put<any>(this.ProductApiUrl + '/gallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }

  savesizechart(uuid: any, formdata: any): Observable<Productimage> {
    return this.http.put<any>(this.ProductApiUrl + '/sizechart/' + uuid, formdata)
      .pipe(map(res => res.data))
  }

  removesizechart(uuid: any, formdata: any): Observable<Productimage> {
    return this.http.put<any>(this.ProductApiUrl + '/removesizechart/' + uuid, formdata)
      .pipe(map(res => res.data))
  }

  savedefaultimage(uuid: any, formdata: any): Observable<any> {
    return this.http.put<any>(this.ProductApiUrl + '/singlegallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }
  saveitemimages(uuid: any, formdata: any): Observable<any> {
    return this.http.put<any>(this.ProductApiUrl + '/itemgallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }

  addprice(data: any): Observable<Vendormapping> {
    return this.http.put<any>(this.ProductApiUrl + '/price/' + data.pid, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  catlist(did: string): Observable<Categories[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/catlist/' + did, option)
      .pipe(map(res => res.data))
  }
  subcatlist(cid: string): Observable<Subcategories[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/subcatlist/' + cid, option)
      .pipe(map(res => res.data))
  }


  brandlist(did: any): Observable<Brands[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/brandlist/' + did, option)
      .pipe(map(res => res.data))
  }


  getProductVariantsList(pid: string): Observable<VENDOR_VARIANT.VendorVariantHttpResponse> {
    let option = this.env.httpOptions;
    return this.http.get<VENDOR_VARIANT.VendorVariantHttpResponse>(this.ProductApiUrl + '/mappedvariants/' + pid, option)
      .pipe(map(res => res))
  }


  postVendorVariantMap(payload: {}, uuid: string): any {
    return this.http.put(`${this.ProductApiUrl}/savevendorvariant/` + uuid, payload, this.env.httpOptions);
  }

  putVendorVariantMap(payload: any, pid: string, uuid: string): any {
    let { mrp, price } = payload;
    let finalPayload = { uuid: uuid, mrp: mrp, price: price }
    return this.http.put(`${this.ProductApiUrl}/updatevendorvariant/${pid}`, finalPayload, this.env.httpOptions);
  }

  deleteVendorVariantMap(pid: string): any {
    return this.http.delete(`${this.ProductApiUrl}/deletevendorvariant/${pid}`, this.env.httpOptions);
  }
  confirmVariantMap(pid: string): any {
    return this.http.get(`${this.ProductApiUrl}/confirmvariant/${pid}`, this.env.httpOptions);
  }


  reqapproval(data: any, uuid: string): Observable<Product> {
    return this.http.post<any>(this.ProductApiUrl + '/reqapproval/' + uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

}
