import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfitlossService {
  financeReportURL: string = `${environment.FINANCE_BASE_URL}/reports`

  constructor(private http: HttpClient, private env: EnvService) { }

  profitLoss(date: any): Observable<any> {
    // console.log(date);
    return this.http.get<any>(this.financeReportURL + '/profitOrLoss?' + 'fromDate=' + date.fromdate + '&toDate=' + date.todate);
  }

  vendorPayment(): Observable<any> {
    // const token = sessionStorage.getItem('token');
    // let headers = new HttpHeaders();
    // headers = headers.append('Authorization', `Bearer ${token}`);
    // let options = {
    //   headers: headers,
    //   params: new HttpParams({ fromObject: params }),
    // };
    return this.http.get<any>(this.financeReportURL + '/vendorPayments');
  }

  purchaseOrder(vendorID: any, params: {}): Observable<any> {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', `Bearer ${token}`);
    let options = {
      headers: headers,
      params: new HttpParams({ fromObject: params }),
    };
    return this.http.get<any>(this.financeReportURL + '/purchaseOrder/' + vendorID, options);
  }

  downloadvarpdf(data: any): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/profitOrLoss/pdf?fromDate=' + data.fromdate + '&toDate=' + data.todate);
  }

  downloadPaymentPdf(paymentId: any): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/purchaseOrder/pdf/' + paymentId)
  }
}
