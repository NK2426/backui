import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Purchaseorderpaginate } from '../models/product';
import { Vendor } from "../models/purchaseorder";
import { Shipper } from '../models/shipper';
import { Warehouse } from '../models/warehouse';
import { Grn, Grnpaginate } from '../models/grn';

@Injectable({
  providedIn: 'root'
})
export class PurchaseorderService {

  PurchaseApiUrl: string = `${environment.WAREHOUSE_BASE_URL}orders`;
  PurchaseApiUrl2: string = `${environment.WAREHOUSE_BASE_URL}direct`;

  baseurl: string = `${environment.WAREHOUSE_BASE_URL}`;
  siteurl: string = `${environment.WAREHOUSE_SITE_URL}`;
  ProductApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}products`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}, type: any = ''): Observable<Purchaseorderpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Purchaseorderpaginate>(this.PurchaseApiUrl + '/' + [type], option)
  }

  getAllgrns(params: {}): Observable<Grnpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Grnpaginate>(this.PurchaseApiUrl + '/getAllgrns', option)
  }

  fulldetail(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/fulldetail/' + uuid, option)
      .pipe(map(res => res.data))
  }

  poGrnsdetail(poid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/pogrns/' + poid, option)
  }

  inwardgrnDetail(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/inwardgrnDetail/' + uuid, option)
      .pipe(map(res => res.data))
  }

  grnitemUpdate(data: any, uuid: any): Observable<any> {
    return this.http.put<any>(this.PurchaseApiUrl + '/grnitemUpdate/' + uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  Approveinwardoc(data: any): Observable<Shipper> {
    return this.http.put<any>(this.PurchaseApiUrl + '/approveInwardoc', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  grnitemdetail(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/grnitemdetail/' + uuid, option)
      .pipe(map(res => res.data))
  }

  grnSync(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/grnsync/' + uuid, option)
      .pipe(map(res => res.data))
  }

  grndetail(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/grndetail/' + uuid, option)
      .pipe(map(res => res.data))
  }
  getlistall(did: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/' + did + '/listall', option)
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

  vendorlist(): Observable<Vendor[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/vendor/list', option)
      .pipe(map(res => res.data))
  }

  html(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/html/' + uuid, option)
      .pipe(map(res => res.data))
  }

  updateRemarks(data: any): Observable<Shipper> {
    return this.http.put<any>(this.PurchaseApiUrl + '/updateremarks', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  // updateRemarks(data: any): Observable<Shipper> {
  //   return this.http.put<any>(this.PurchaseApiUrl2 + '/move', data, this.env.httpOptions)
  //     .pipe(map(res => res.data));
  // }
  updateprice(data: any): Observable<any> {
    return this.http.put<any>(this.PurchaseApiUrl + '/setprice', data, this.env.httpOptions);
  }

  getdisputeitems(psids: any): Observable<any> {
    return this.http.put<any>(this.PurchaseApiUrl + '/disputeitems', psids, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  generateqrcode(uuid: string, format: number, mrp: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/qrcode/' + uuid + '/' + format , option)
      .pipe(map(res => res))
  }
  generatebarcode(uuid: string, format: number, mrp: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/barcode/' + uuid + '/' + format , option)
      .pipe(map(res => res))
  }

  download(id: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/pdf/' + id, this.env.httpOptions);
  }

  grndownload(grnid: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/pogrnpdf/' + grnid, this.env.httpOptions);
  }

  grnpdfdownload(grnid: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/grnpdf/' + grnid, this.env.httpOptions);
  }

  downloadsinglepsid(psid: any, format: number): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/singlepsidpdf/' + psid + '/' + format, this.env.httpOptions);
  }

  findsetting(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/findsetting', option)
      .pipe(map(res => res))
  }
  Warehouse(data:string): Observable<Warehouse>{
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/warehouse/' + data, option)
      .pipe(map(res => res.data))
  }

  grnclosegrn(uuid: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/grnclosegrn/' + uuid, option)
      .pipe(map(res => res))
  }

  closegrn(uuid: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/closegrn/' + uuid, option)
      .pipe(map(res => res))
  }

  getvariantlist(gid: any): Observable<any[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ProductApiUrl + '/' + gid + '/getvariantlist', option)
      .pipe(map(res => res.data))
  }

  downloadgrninward(id: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/inwardgrnDetailpdf/' + id, this.env.httpOptions);
  }

  generateBatchqrcode(uuid: string, format: number, batch_id: number): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/batchqrcode/' + uuid + '/' + format + '/' + batch_id, option)
      .pipe(map(res => res))
  }

  saveInwarditem(data:any): Observable<any> {
    return this.http.put<any>(this.PurchaseApiUrl + '/saveInwarditem', data, this.env.httpOptions);
  }
 
  saveinvoice(formdata: any): Observable<any>{
    return this.http.put<any>(this.PurchaseApiUrl+'/saveinvoicedata', formdata)
                    .pipe(map(res => res.data))
  }

}
