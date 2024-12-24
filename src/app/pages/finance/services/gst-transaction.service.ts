import { Injectable } from '@angular/core';
import { EnvService } from '../../purchaser/services/env.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gst } from '../models/gst-transaction';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GstTransactionService {
  financeReportURL: string = `${environment.FINANCE_BASE_URL}/reports`

  constructor(private http: HttpClient, private env: EnvService) { }

  getChartGst(): Observable<Gst> {
    return this.http.get<Gst>(this.financeReportURL + '/gst');
  }

  getDateWiseGst(data: any): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/gst/date?fromDate=' + data.fromdate + '&toDate=' + data.todate + '&page=' + data.page + '&size=' + data.size)
  }

  downloadXL(data: any): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/gst/xlsx?fromDate=' + data.fromdate + '&toDate=' + data.todate);
  }
}
