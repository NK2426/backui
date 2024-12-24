import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Department, Purchaseorderpaginate, Vendor } from '../models/purchaseorder';
@Injectable({
  providedIn: 'root'
})
export class PurchaseorderService {

  PurchaseApiUrl: string = `${environment.CATALOG_BASE_URL}/orders`;

  siteurl: string = `${environment.CATALOG_SITE_URL}`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}, type: any = ''): Observable<Purchaseorderpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Purchaseorderpaginate>(this.PurchaseApiUrl, option)
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

  productlist(did: string): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/product/' + did, option)
      .pipe(map(res => res.data))
  }

  allvendor(did: string): Observable<Vendor[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/allvendors/' + did, option)
      .pipe(map(res => res.data))
  }

  findsetting(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.PurchaseApiUrl + '/findsetting', option)
      .pipe(map(res => res))
  }


  downloadpdf(id: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/pdf/' + id, this.env.httpOptions);
  }

  downloadxl(id: any): Observable<any> {
    return this.http.get<any>(this.PurchaseApiUrl + '/xlpurchaseorders/' + id, this.env.httpOptions);
  }
}
