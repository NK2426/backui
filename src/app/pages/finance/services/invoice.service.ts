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

    invoiceURL: string = `${environment.FINANCE_BASE_URL}/invoices`;


    constructor(private http: HttpClient, private env: EnvService) { }

    // get all generated invoice list
    getAllInvoice(params: {}): Observable<INVOICE.InvoicePaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<INVOICE.InvoicePaginate>(`${this.invoiceURL}`, option);
    }

    // get specific invoice by invoice number
    getInvoiceById(invoiceNumber: string): Observable<INVOICE.InvoiceHttpResponse> {
        let option = this.env.httpOptionsparams;
        return this.http.get<INVOICE.InvoiceHttpResponse>(`${this.invoiceURL}/view/${invoiceNumber}`);
    }


}
