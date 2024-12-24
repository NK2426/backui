import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SCAN_MANIFEST_ORDER } from '../models/scan-mbo';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ScanManifestService {

    scanmanifestURL: string = `${environment.WAREHOUSE_BASE_URL}invoices`;

    constructor(private http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    
      httpOptionsparams = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: {}
      }
    
      uploadhttpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/octet-stream' })
      }

    getAllMBO(params: {}): Observable<SCAN_MANIFEST_ORDER.MBO> {
        let option = this.httpOptionsparams;
        option['params'] = params;
        return this.http.get<SCAN_MANIFEST_ORDER.MBO>(this.scanmanifestURL + '/manifestcombined', option);
    }
    createMBO(data: SCAN_MANIFEST_ORDER.AWB_DETAIL): Observable<any> {
        return this.http.post<SCAN_MANIFEST_ORDER.AWB_DETAIL>(this.scanmanifestURL + '/scanManifest', data, this.httpOptions);
    }

}
