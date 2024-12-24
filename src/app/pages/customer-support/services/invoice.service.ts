import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INVOICE } from '../models/invoice';
import { EnvService } from './env.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  invoiceURL: string;

  constructor(private http: HttpClient, private env: EnvService) {
    this.invoiceURL = `${environment.CUSTOMER_SUPPORT_BASE_URL}invoices`;
  }
  

  // get all or return invoice
  getAllInvoice(params: {}, invoiceType: string): Observable<INVOICE.InvoicePaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    let url = '';
    if (invoiceType === 'all') {
      url = this.invoiceURL;
    } else {
      url = this.invoiceURL + '/' + invoiceType;
    }
    return this.http.get<INVOICE.InvoicePaginate>(`${url}`, option);
  }

  // response structure of cancel invoice includes order item as well hence separate method is written
  getCancelledInvoice(params: {}): Observable<INVOICE.InvoicePaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.InvoicePaginate>(`${this.invoiceURL}/cancelinvoicereport`, option);
  }

  // get specific invoice by invoice number
  getInvoiceById(invoiceNumber: string): Observable<INVOICE.InvoiceHttpResponse> {
    let option = this.env.httpOptionsparams;
    return this.http.get<INVOICE.InvoiceHttpResponse>(`${this.invoiceURL}/view/${invoiceNumber}`, option);
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

  // get cash on delivery table data
  getCODList(params: {}): Observable<INVOICE.InvoicePaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.InvoicePaginate>(`${this.invoiceURL}/codreport/`, option);
  }

  // get excel report cash on delivery
  downloadCODList(params: {}): Observable<INVOICE.ReportsResponse> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.ReportsResponse>(`${this.invoiceURL}/xlcodreport`, option);
  }

  // get prepaid table data
  getPPDList(params: {}): Observable<INVOICE.InvoicePaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.InvoicePaginate>(`${this.invoiceURL}/codreport/`, option);
  }

  // get excel report prepaid
  downloadPPDList(params: {}): Observable<INVOICE.ReportsResponse> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.ReportsResponse>(`${this.invoiceURL}/xlcodreport`, option);
  }

  //get excel returninvoices
  xlreturninvoices(): Observable<INVOICE.ReportsResponse> {
    return this.http.get<INVOICE.ReportsResponse>(`${this.invoiceURL}/xlreturninvoices`, this.env.httpOptions);
  }

  // get excel skulevel order
  getSkulevelOrders(params: {}): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(`${this.invoiceURL}/skuordergroupdata`, option);
  }

  // get excel skulevel order
  downloadSkulevelOrders(params: {}): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(`${this.invoiceURL}/xlskuordergroupdata`, option);
  }

  // get excel skulevel order with po
  getSkulevelOrderspo(params: {}): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(`${this.invoiceURL}/skuorderlevelsaledata`, option);
  }

  // get excel skulevel order with po
  downloadSkulevelOrderspo(params: {}): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(`${this.invoiceURL}/xlskuorderlevelsaledata`, option);
  }

  // get gst billing table data
  getGSTList(params: {}): Observable<INVOICE.InvoicePaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.InvoicePaginate>(`${this.invoiceURL}/gstbilling/`, option);
  }

  // get xl gst billing
  downloadGSTList(params: {}): Observable<INVOICE.ReportsResponse> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.ReportsResponse>(`${this.invoiceURL}/xlgstbilling`, option);
  }

  // get item based gst billing table data
  getGSTitemList(params: {}): Observable<INVOICE.InvoiceitemPaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.InvoiceitemPaginate>(`${this.invoiceURL}/itemgstbilling/`, option);
  }

  // get item based xl gst billing
  downloadGSTitemList(params: {}): Observable<INVOICE.ReportsResponse> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.ReportsResponse>(`${this.invoiceURL}/xlitemgstbilling`, option);
  }

  // get returns table data
  getReturnList(params: {}): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(`${this.invoiceURL}/returnrefund/`, option);
  }

  // get xl returns
  downloadReturnList(params: {}): Observable<INVOICE.ReportsResponse> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.ReportsResponse>(`${this.invoiceURL}/xlreturnrefund`, option);
  }

  // get AWB Details
  getAWBDetails(params: {}): Observable<INVOICE.AWBPaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.AWBPaginate>(`${this.invoiceURL}/awbdetailedreport`, option);
  }

  // get AWB Details
  getxlAWBDetails(params: {}): Observable<INVOICE.ReportsResponse> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<INVOICE.ReportsResponse>(`${this.invoiceURL}/xlawbdetailedreport`, option);
  }
}
