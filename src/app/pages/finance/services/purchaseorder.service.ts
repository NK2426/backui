import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Grn } from '../models/grn';
import { Product, Productpaginate } from '../models/product';
import { Department, Poproess, Purchaseorder, Purchaseorderpaginate, Tax } from '../models/purchaseorder';
import { Warehouse } from '../../purchaser/models/purchaseorder';

@Injectable({
  providedIn: 'root'
})
export class PurchaseorderService {

  PurchaseApiUrl: string = `${environment.FINANCE_BASE_URL}/orders`;

  siteurl: string = `${environment.FINANCE_SITE_URL}`;
  financeurl: string;


  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}, type: any = ''): Observable<Purchaseorderpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Purchaseorderpaginate>(this.PurchaseApiUrl + '/po/' + type, option);
  }


  taxlist(): Observable<Tax[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/taxes', option)
      .pipe(map(res => res.data))
  }
  getParams(): Observable<Product> {
    // console.log(this.http.get<Product>(this.PurchaseApiUrl + '/list', this.env.httpOptions));
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

  grndetail(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/grndetail/' + uuid, option)
      .pipe(map(res => res.data))
  }

  getdisputeitems(psids: any): Observable<any> {
    return this.http.put<any>(this.PurchaseApiUrl + '/disputeitems', psids, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  getTransactions(uuid: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/transactions/' + uuid, this.env.httpOptions)
      .pipe(map(res => res.data));
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
  productlist(did: string): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/product/' + did, option)
      .pipe(map(res => res.data))
  }
  vendorlist(): Observable<any[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/vendor/list', option)
      .pipe(map(res => res.data))
  }
  variantlist(pid: string): Observable<any[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/variant/' + pid, option)
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
  makepayment(uuid: any, formdata: any): Observable<any> {
    return this.http.put<any>(this.PurchaseApiUrl + '/makepayment/' + uuid, formdata, this.env.httpOptions)
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

  savebill(data: any): Observable<Tax> {
    return this.http.post<any>(this.PurchaseApiUrl + '/savebill', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  documents(data: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/documents/' + data, option)
      .pipe(map(res => res.data))
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

  getpaymentcycles(paymentterm_id: number): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/paymentcycles/' + paymentterm_id, option)
      .pipe(map(res => res))
  }

  generateqrcode(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/qrcode/' + uuid, option)
      .pipe(map(res => res))
  }

  download(id: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/pdf/' + id, this.env.httpOptions);
  }

  downloadvenvar(did: any, vid: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/varpdf/' + did + '/' + vid, this.env.httpOptions);
  }

  getThreeWayMatching(params: {}): Observable<Grn[]> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Grn[]>(this.PurchaseApiUrl + '/getpoGrnInvoice', option);
  }

  getPOPayments(params: {}): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    // return of([{ "id": 1020, "uuid": "614712_005", "vendor_id": 147, "department_id": 3, "date": "2022-12-26", "deliverydate": "2022-12-29", "subtotal": 11980, "discounttotal": 0, "total": 11980, "taxtotal": 599, "grandtotal": 12578, "notes": "", "haltdate": "", "createdBy": 22, "modifiedBy": 36, "vendordocuments": "", "documents": "", "status": "Accept", "shipper_id": 0, "ship_status": "Pick Up", "paymentterm_id": 28, "potype": "Inventory", "gstdetail": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1672056311297__0D3A5571.JPG", "invoice": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1672056329234__0D3A5556.JPG", "handoverslip": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1672056353211__DSC02328%20copy.jpg", "expiredoc": "", "transporterid": "12345", "remarks": "", "invoiceno": "", "receiveddate": null, "createdAt": "2022-12-26T06:32:01.000Z", "updatedAt": "2022-12-26T18:30:00.000Z", "paymentterm": { "id": 28, "name": "Credit-40_30_30", "description": "40% After 5 Days, 30% After 30 days, Balance 30% After 45 Days.", "status": 1, "paymentcycles": [{ "id": 87, "type": "Payment", "paymentterm_id": 28, "days": 5, "percentage": 40, "date": "2022-12-31" }, { "id": 88, "type": "Payment", "paymentterm_id": 28, "days": 30, "percentage": 30, "date": "2023-01-03" }, { "id": 89, "type": "Payment", "paymentterm_id": 28, "days": 45, "percentage": 30, "date": "2023-01-01" }] } }, { "id": 1016, "uuid": "614712_001", "vendor_id": 147, "department_id": 3, "date": "2022-12-26", "deliverydate": "2022-12-28", "subtotal": 3980, "discounttotal": 0, "total": 3980, "taxtotal": 199, "grandtotal": 4176, "notes": "ABC", "haltdate": "", "createdBy": 22, "modifiedBy": 59, "vendordocuments": "", "documents": "", "status": "GRN Closed", "shipper_id": 0, "ship_status": "Inward", "paymentterm_id": 28, "potype": "Inventory", "gstdetail": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1672052645336__vendorproducts%20%288%29.xlsx", "invoice": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1672052648506__vendorproducts%20%288%29.xlsx", "handoverslip": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1672052655286__vendorproducts%20%288%29.xlsx", "expiredoc": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1672052651638__vendorproducts%20%288%29.xlsx", "transporterid": "demo123", "remarks": "Done", "invoiceno": "234", "receiveddate": "2022-12-26T05:39:26.000Z", "createdAt": "2022-12-26T05:12:34.000Z", "updatedAt": "2022-12-26T18:30:00.000Z", "paymentterm": { "id": 28, "name": "Credit-40_30_30", "description": "40% After 5 Days, 30% After 30 days, Balance 30% After 45 Days.", "status": 1, "paymentcycles": [{ "id": 87, "type": "Payment", "paymentterm_id": 28, "days": 5, "percentage": 40, "date": "2022-12-31" }, { "id": 88, "type": "Payment", "paymentterm_id": 28, "days": 30, "percentage": 30, "date": "2023-01-05" }, { "id": 89, "type": "Payment", "paymentterm_id": 28, "days": 45, "percentage": 30, "date": "2023-01-03" }] } }, { "id": 1015, "uuid": "612012_009", "vendor_id": 120, "department_id": 3, "date": "2022-12-27", "deliverydate": "2023-01-08", "subtotal": 570, "discounttotal": 0, "total": 570, "taxtotal": 28.5, "grandtotal": 598, "notes": "", "haltdate": "", "createdBy": 22, "modifiedBy": 59, "vendordocuments": "", "documents": "", "status": "Accept", "shipper_id": 0, "ship_status": "Inward", "paymentterm_id": 18, "potype": "Inventory", "gstdetail": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1672044929052__vendorproducts%20%285%29.xlsx", "invoice": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1672044932337__vendorproducts%20%285%29.xlsx", "handoverslip": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1672044939482__vendorproducts%20%285%29.xlsx", "expiredoc": "https://ssmart-s3.s3.ap-south-1.amazonaws.com/1672044935809__vendorproducts%20%285%29.xlsx", "transporterid": "Demo manoj", "remarks": "ok", "invoiceno": "1234a", "receiveddate": "2022-12-26T03:28:58.000Z", "createdAt": "2022-12-26T03:23:40.000Z", "updatedAt": "2022-12-26T18:30:00.000Z", "paymentterm": { "id": 18, "name": "Three Payment Cycle", "description": "Three Payment Cycle", "status": 1, "paymentcycles": [{ "id": 50, "type": "Advance", "paymentterm_id": 18, "days": 5, "percentage": 50, "date": "2023-01-03" }, { "id": 51, "type": "Payment", "paymentterm_id": 18, "days": 15, "percentage": 50, "date": "2023-01-01" }] } }])
     return this.http.get<any[]>(this.PurchaseApiUrl + '/getpopayments', option);

  }
}
