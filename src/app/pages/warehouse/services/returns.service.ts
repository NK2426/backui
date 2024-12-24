import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

import { RETURN } from '../models/return';

const PARAMS = new HttpParams({
    fromObject: {}
});

@Injectable({
    providedIn: 'root'
})
export class ReturnService {

    ReturnsApiUrl: string = `${environment.WAREHOUSE_BASE_URL}returns`;
    ReturninvoicesApiUrl: string = `${environment.WAREHOUSE_BASE_URL}returninvoices`;


    constructor(private http: HttpClient, private env: EnvService) { }

    getAllReturns(params: {}): Observable<RETURN.ReturnPaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<RETURN.ReturnPaginate>(this.ReturnsApiUrl, option);
    }

    getAllReturninvoices(params: {}): Observable<RETURN.ReturninvoicePaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<RETURN.ReturninvoicePaginate>(this.ReturninvoicesApiUrl, option);
    }


    getReturnDetail(returnuuid: string): Observable<RETURN.ReturnHttpResponse> {
        return this.http.get<RETURN.ReturnHttpResponse>(this.ReturnsApiUrl + '/view/' + returnuuid, this.env.httpOptions);
    }

    getReturninvoiceDetail(returnuuid: string): Observable<RETURN.ReturninvoiceHttpResponse> {
        return this.http.get<RETURN.ReturninvoiceHttpResponse>(this.ReturninvoicesApiUrl + '/view/' + returnuuid, this.env.httpOptions);
    }

    generateAWB(invoiceNumber: string, payload: any): Observable<any> {
        return this.http.post<any>(`${this.ReturnsApiUrl}/awbgenerate/${invoiceNumber}`, payload);
    }

    generateReturn(returnUUID: string, payload: any): Observable<any> {
        return this.http.put<RETURN.ReturnHttpResponse>(`${this.ReturnsApiUrl}/generatereturn/${returnUUID}`, payload);
    }

    generateReturnAWB(returninvno: string, payload: any): Observable<any> {
        return this.http.post<RETURN.ReturnHttpResponse>(`${this.ReturninvoicesApiUrl}/revawbgenerate/${returninvno}`, payload);
    }

    returncancelAWB(revinvoiceNumber: string, payload: any): Observable<any> {
        return this.http.post<any>(`${this.ReturninvoicesApiUrl}/cancelawb/${revinvoiceNumber}`, payload);
    }
    returnReceived(revinvoiceNumber: string, payload: any): Observable<any> {
        return this.http.post<any>(`${this.ReturninvoicesApiUrl}/returnreceived/${revinvoiceNumber}`, payload);
    }
    acceptqcitem(returnorderitemuuid: string, payload: any): Observable<any> {
        return this.http.put<any>(`${this.ReturninvoicesApiUrl}/itemqc/${returnorderitemuuid}`, payload);
    }
    rejectqcitem(returnorderitemuuid: string, payload: any): Observable<any> {
        return this.http.put<any>(`${this.ReturninvoicesApiUrl}/itemqc/${returnorderitemuuid}`, payload);
    }
}
