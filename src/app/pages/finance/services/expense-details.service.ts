import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseDetailsService {
  financeReportURL:string = `${environment.FINANCE_BASE_URL}/reports`

  constructor(private http: HttpClient, private env: EnvService) { }

  getAllExpensesData(): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/expenseTypes');
  }

  getAllExpenseDetail(datas: any): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/expenseType?fromDate=' + datas.fromdate + '&toDate=' + datas.todate + '&expenseType_id=' + datas.expID + '&page=' + datas.page + '&size=' + datas.size);
  }

  downloadXL(data: any): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/expenseType/xlsx?expenseType_id=' + data.expID + '&fromDate=' + data.fromdate + '&toDate=' + data.todate)
  }
}
