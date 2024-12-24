import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Bankaccount } from '../models/bankaccounts';

@Injectable({
  providedIn: 'root'
})
export class AccountTransferService {
  account_API_URL: string = `${environment.apiUrl}finance/orders`;
  financeReportURL:string = `${environment.FINANCE_BASE_URL}/reports`

  constructor(private http: HttpClient, private env: EnvService) { }

  accountTransfer(): Observable<Bankaccount> {
    return this.http.get<Bankaccount>(this.financeReportURL + '/bankAccounts');
  }

  getAllAccountDetail(datas: any): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/bankAccounts/Account?fromDate=' + datas.fromdate + '&toDate=' + datas.todate + '&bankaccount_id=' + datas.accID + '&page=' + datas.page + '&size=' + datas.size);
  }

  downloadXL(data: any): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/bankAccounts/Account/xlsx?bankaccount_id=' + data.accID + '&fromDate=' + data.fromdate + '&toDate=' + data.todate);
  }
}
