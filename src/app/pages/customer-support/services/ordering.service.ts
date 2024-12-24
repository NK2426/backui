import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ORDER } from '../models/order';
import { EnvService } from './env.service';
import { environment } from 'src/environments/environment';

const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class OrderingService {
  customerOrderURL: string = `${environment.CUSTOMER_SUPPORT_BASE_URL}orders`;
  invoiceURL: string = `${environment.CUSTOMER_SUPPORT_BASE_URL}invoices`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getCustomerOrdersForPicking(params: {}): Observable<ORDER.OrdersPaginate> {
    //, orderStatus: string
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    // if (orderStatus) {
    //   customerOrderURL = this.customerOrderURL + `/${orderStatus}`;
    // }
    return this.http.get<ORDER.OrdersPaginate>(`${this.customerOrderURL}/cancellist`, option);
  }

  getCustomerCancelOrders(params: {}): Observable<ORDER.OrderItemsPaginate> {
    //, orderStatus: string
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    // if (orderStatus) {
    //   customerOrderURL = this.customerOrderURL + `/${orderStatus}`;
    // }
    return this.http.get<ORDER.OrderItemsPaginate>(`${this.invoiceURL}/cancelorders`, option);
  }

  getRefunds(params: {}): Observable<ORDER.RefundsPaginate> {
    //, orderStatus: string
    let option = this.env.httpOptionsparams;
    option['params'] = params;

    return this.http.get<ORDER.RefundsPaginate>(`${this.customerOrderURL}/refunds`, option);
  }


  // get orders list for packing
  getCustomerOrdersForPacking(params: {}): Observable<ORDER.OrdersPaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<ORDER.OrdersPaginate>(`${this.customerOrderURL}/bills`, option);
  }

  // get excel cancel orders
  xlcancelorders(params: {}): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(`${this.invoiceURL}/xlcancelorders`, option);
  }

  // getAllSalesReport(params: {}): Observable<Ordering.CustomerOrder[]> {
  //   let option = this.env.httpOptionsparams;
  //   option['params'] = params;
  //   return this.http.get<Ordering.CustomerOrder[]>(`${this.customerOrderURL}/salesreport`, option);
  // }


}
