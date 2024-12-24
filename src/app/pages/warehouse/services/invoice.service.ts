import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { INVOICE } from '../models/invoice';


@Injectable({
    providedIn: 'root'
})
export class InvoiceService {

    invoiceURL: string = `${environment.WAREHOUSE_BASE_URL}invoices`;


    constructor(private http: HttpClient, private env: EnvService) { }

    // get all generated invoice list
    getAllInvoice(params: {}): Observable<INVOICE.InvoicePaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<INVOICE.InvoicePaginate>(`${this.invoiceURL}`, option);
    }
    // get all generated invoice list
    AllInvoice(params: {}): Observable<INVOICE.InvoicePaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<INVOICE.InvoicePaginate>(`${this.invoiceURL}/all`, option);
    }

    // get all generated invoice list
    getAllShipedInvoice(params: {}): Observable<INVOICE.InvoicePaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<INVOICE.InvoicePaginate>(`${this.invoiceURL}/shipped`, option);
    }


    //get all manifest invoices with items
    getManifestInvoice(): Observable<INVOICE.InvoiceDetail[]> {
        let option = this.env.httpOptionsparams;
        return this.http.get<INVOICE.InvoiceDetail[]>(`${this.invoiceURL}/manifest`, option);
    }

    //multiple invoice order items submit action
    submitManifest(data: any): Observable<any> {
        return this.http.post<any>(this.invoiceURL + '/submitManifest', data, this.env.httpOptions)
    }

    // get specific invoice by invoice number
    getInvoiceById(invoiceNumber: string): Observable<INVOICE.InvoiceHttpResponse> {
        let option = this.env.httpOptionsparams;
        return this.http.get<INVOICE.InvoiceHttpResponse>(`${this.invoiceURL}/view/${invoiceNumber}`, option);
    }
    generateAWB(invoiceNumber: string, payload: any): Observable<any> {
        let logistics = payload.logistics == '1' ? 'ekartgenerate' : 'awbgenerate';
        return this.http.post<any>(`${this.invoiceURL}/${logistics}/${invoiceNumber}`, payload);
    }
    ndrHitting(invoiceNumber: string, payload: any): Observable<any> {
        return this.http.post<any>(`${this.invoiceURL}/ndrhitting/${invoiceNumber}`, payload);
    }
    cancelInvoice(invoiceitemuuid: string): Observable<any> {
        return this.http.post<any>(`${this.invoiceURL}/cancelinvoice/${invoiceitemuuid}`, {});
    }
    cancelAWB(invoiceNumber: string, payload: any): Observable<any> {
        return this.http.post<any>(`${this.invoiceURL}/cancelawb/${invoiceNumber}`, payload);
    }
    // removeItem(invoiceNumber: string, payload: any): Observable<any> {
    //     return this.http.post<any>(`${this.invoiceURL}/cancelitem/${invoiceNumber}`, payload);
    // }
    download(invoiceNumber: string): Observable<any> {
        return this.http.get<any>(`${this.invoiceURL}/pdf/${invoiceNumber}`, this.env.httpOptions);
    }

    downloadinvoice(invoiceNumber: string): Observable<any> {
        return this.http.get<any>(`${this.invoiceURL}/invoicepdf/${invoiceNumber}`, this.env.httpOptions);
    }

    getCancelledInvoice(params: {}): Observable<INVOICE.InvoicePaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<INVOICE.InvoicePaginate>(`${this.invoiceURL}/cancelinvoicereport`, option);
    }

    downloadInvoiceReport(type: string, params: {}): Observable<INVOICE.ReportsResponse> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        let url = '';
        if (type === 'all') {
            url = 'xlinvoicereport';
        } else {
            url = type;
        }
        return this.http.get<INVOICE.ReportsResponse>(`${this.invoiceURL}/${url}`, option);
    }


    xldownloadmanifest(): Observable<any> {
        return this.http.get<any>(`${this.invoiceURL}/xlmanifest`, this.env.httpOptions);
    }

}
