import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { AUDITING } from '../models/audit';

@Injectable({
  providedIn: 'root'
})
export class AuditingService {
  AutingApiUrl: string = `${environment.WAREHOUSE_BASE_URL}shelves`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getInventoryAuditing(params: {}): Observable<AUDITING.GenerateAuditInventoryHttpResponse> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<AUDITING.GenerateAuditInventoryHttpResponse>(
      this.AutingApiUrl + '/inventory',
      option
    );
  }

  getLocationAuditing(params: {}): Observable<AUDITING.GenerateAuditLocationtHttpResponse> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<AUDITING.GenerateAuditLocationtHttpResponse>(
      this.AutingApiUrl + '/location',
      option
    );
  }

  //get location report based on Shelf ID
  getLocationReport(params: {}): Observable<AUDITING.GenerateAuditLocationtHttpResponse> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<AUDITING.GenerateAuditLocationtHttpResponse>(
      this.AutingApiUrl + '/binwisereport',
      option
    );
  }

  //get excel location report based on Design ID
  xldesignidreport(params: {}): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(
      this.AutingApiUrl + '/xldidwisereport',
      option
    );
  }

  //get location report based on Design ID
  getDesignidReport(params: {}): Observable<AUDITING.GenerateAuditLocationtHttpResponse> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<AUDITING.GenerateAuditLocationtHttpResponse>(
      this.AutingApiUrl + '/didwisereport',
      option
    );
  }

  //get excel location report for all Shelf ID
  xlLocationreportall(): Observable<any> {
    return this.http.get<any>(
      this.AutingApiUrl + '/xlbinwisereportall',
      this.env.httpOptions
    );
  }

  //get excel location report based on Shelf ID
  xlLocationreport(params: {}): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(
      this.AutingApiUrl + '/xlbinwisereport',
      option
    );
  }
  movetoBin(shelfID: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.AutingApiUrl}/binmove/${shelfID}`, data, this.env.httpOptions)
  }
  // validate assigned crate while packing
  validateItem(psid: string): Observable<any> {
    return this.http.get<any>(`${this.AutingApiUrl}/scan/${psid}`);
  }
  getShelfdetail(shelfID: string): Observable<any> {
    return this.http.get<any>(`${this.AutingApiUrl}/view/${shelfID}`);
  }

  inventoryvalidateItem(psid: string): Observable<any> {
    return this.http.get<any>(`${this.AutingApiUrl}/inventoryscan/${psid}`);
  }

  save(data: any): Observable<AUDITING.Auditreport> {
    return this.http.post<any>(
      this.AutingApiUrl + '/saveaudit/',
      data,
      this.env.httpOptions
    );
  }


  //get audit report based on Shelf ID
  getAuditreport(params: {}): Observable<AUDITING.Auditpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<AUDITING.Auditpaginate>(
      this.AutingApiUrl + '/auditreport',
      option
    );
  }

  //get audit report excel based on Shelf ID
  downloadAuditreport(params: {}): Observable<AUDITING.GenericHttpResponse> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<AUDITING.GenericHttpResponse>(
      this.AutingApiUrl + '/xlauditreport',
      option
    );
  }

}
