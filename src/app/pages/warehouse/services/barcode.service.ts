import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Auditpaginate, BarCode, BarCodepaginate } from '../models/barcode';

const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class BarCodeService {
  WarehouseApiUrl: string = `${environment.WAREHOUSE_BASE_URL}barcode`;
  AuditApiUrl: string = `${environment.WAREHOUSE_BASE_URL}barcodeweb`;
  constructor(private http: HttpClient, private env: EnvService) {}

  getAll(params: {}): Observable<BarCodepaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<BarCodepaginate>(this.WarehouseApiUrl, option);
  }
  getAllaudit(params: {}): Observable<Auditpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Auditpaginate>(this.AuditApiUrl+'/psid', option);
  }
  getAllTrash(params: {}): Observable<BarCodepaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<BarCodepaginate>(this.WarehouseApiUrl + '/trash', option);
  }
  savesizechart(id: any, formdata: any): Observable<BarCode> {
    return this.http.put<any>(this.WarehouseApiUrl + '/image/' + id, formdata).pipe(map((res) => res.data));
  }
  saveimage(id: any, formdata: any): Observable<BarCode> {
    return this.http.post<any>(this.WarehouseApiUrl + '/image-new', formdata).pipe(map((res) => res.data));
  }
  newBarcode(data: any): Observable<BarCode> {
    return this.http.post<any>(this.WarehouseApiUrl + '/new', data, this.env.httpOptions).pipe(map((res) => res.data));
  }
  create(data: BarCode, id: any): Observable<BarCode> {
    return this.http.put<any>(this.WarehouseApiUrl + '/add/' + id, data);
  }
  changeTrashStatus(id: any, data: any): Observable<any> {
    return this.http.put<any>(this.WarehouseApiUrl + '/change/' + id, data);
  }
  update(data: BarCode): Observable<any> {
    return this.http.put<BarCode>(this.WarehouseApiUrl + '/' + data.id, data, this.env.httpOptions);
  }
  view(data: string): Observable<BarCode> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.WarehouseApiUrl + '/' + data, option).pipe(map((res) => res.data));
  }
  delete(data: BarCode): Observable<any> {
    return this.http.delete<BarCode>(this.WarehouseApiUrl + '/' + data.barcode);
  }
  allvendor(id: any): Observable<any[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.WarehouseApiUrl + '/allvendors/' + id, option).pipe(map((res) => res.data));
  }
}
