import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Documents } from '../models/documents';
import { Product, Productpaginate } from '../models/product';
import { Department, Poproess, Purchaseorder, Purchaseorderpaginate, Shipper, Tax, Vendor } from '../models/purchaseorder';

@Injectable({
  providedIn: 'root'
})
export class PurchaseorderService {

  PurchaseApiUrl: string = `${environment.PURCHASE_BASE_URL}/orders`;
  categoryHeadUrl: string = environment.CATEGORY_HEAD_BASE_URL

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}, type: any = ''): Observable<Purchaseorderpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Purchaseorderpaginate>(this.PurchaseApiUrl + '/po/' + type, option);
  }

  create(data: Product): Observable<Product> {
    return this.http.post<any>(this.PurchaseApiUrl, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  update(data: Product): Observable<Product> {
    return this.http.put<any>(this.PurchaseApiUrl + '/' + data.uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data))

  }
  autopo(data: Product): Observable<Product> {
    return this.http.put<any>(this.PurchaseApiUrl + '/autopo/' + data.uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data))

  }
  delete(data: Product): Observable<Product> {
    return this.http.delete<Product>(this.PurchaseApiUrl + '/' + data.uuid);
  }
  deleteorderitem(id: any): Observable<any> {
    return this.http.delete<any>(this.PurchaseApiUrl + '/orderitem/' + id);
  }
  addtax(data: any): Observable<Tax> {
    return this.http.post<any>(this.PurchaseApiUrl + '/tax', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  taxlist(): Observable<Tax[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/taxes', option)
      .pipe(map(res => res.data))
  }

  addshipper(data: any): Observable<Shipper> {
    return this.http.post<any>(this.PurchaseApiUrl + '/shipper', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  addshipperID(data: any): Observable<Shipper> {
    return this.http.put<any>(this.PurchaseApiUrl + '/shipperID', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  shipperlist(): Observable<Shipper[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/shippers', option)
      .pipe(map(res => res.data))
  }

  getParams(): Observable<Product> {
    //console.log(this.http.get<Product>(this.PurchaseApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Product>(this.PurchaseApiUrl + '/list', this.env.httpOptions);
  }

  find(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/' + uuid, option)
      .pipe(map(res => res.data))
  }
  productfind(puid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/viewproduct/' + puid, option)
      .pipe(map(res => res.data))
  }
  fulldetail(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/fulldetail/' + uuid, option)
      .pipe(map(res => res.data))
  }
  getlistall(did: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/' + did + '/listall', option)
      .pipe(map(res => res.data))
  }
  departmentlist(): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/department/list', option)
      .pipe(map(res => res.data))
  }

  documentlist(): Observable<Documents[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/document/list', option)
      .pipe(map(res => res.data))
  }

  productlist(did: string): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/product/' + did, option)
      .pipe(map(res => res.data))
  }
  vendorproductlist(uid: string, did: string): Observable<Product[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/vendorproduct/' + uid + '/' + did, option)
      .pipe(map(res => res.data))
  }
  vendorlist(pid: string): Observable<Vendor[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/vendor/' + pid, option)
      .pipe(map(res => res.data))
  }
  allvendor(did: string): Observable<Vendor[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/allvendors/' + did, option)
      .pipe(map(res => res.data))
  }
  variantlist(gid: string): Observable<any[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/variant/' + gid, option)
      .pipe(map(res => res.data))
  }
  getProducts(params: {}): Observable<Productpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Productpaginate>(this.PurchaseApiUrl + '/products', option)
  }
  mapping(data: any, uuid: string): Observable<Product> {
    return this.http.post<any>(this.PurchaseApiUrl + '/mapping/' + uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  fileupload(formdata: any, uuid: string): Observable<any> {
    return this.http.post<any>(this.PurchaseApiUrl + '/uploadfile/' + uuid, formdata, this.env.uploadhttpOptions);
  }
  approve(data: Purchaseorder): Observable<Purchaseorder> {
    return this.http.put<any>(this.PurchaseApiUrl + '/approve/' + data.uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  headapproval(uuid: any, formdata: any): Observable<Purchaseorder> {
    return this.http.put<any>(this.PurchaseApiUrl + '/headapprove/' + uuid, formdata, this.env.httpOptions)
      .pipe(map(res => res.data))

  }
  purchaserorderproess(pid: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<Poproess>(this.PurchaseApiUrl + '/poprocess/' + pid, option)
      .pipe(map(res => res.data))
  }

  analytics(pid: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<Poproess>(this.PurchaseApiUrl + '/analytics/' + pid, option)
      .pipe(map(res => res.data))
  }

  poanalytics(id: any, vid: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<Poproess>(this.PurchaseApiUrl + '/poanalytics/' + id + '/' + vid, option)
      .pipe(map(res => res.data))
  }


  productsview(uuid: any, { }): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/viewproducts/' + uuid, option)
      .pipe(map(res => res.data))
  }

}
