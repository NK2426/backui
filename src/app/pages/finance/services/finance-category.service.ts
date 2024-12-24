import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceCategoryService {
  financeReportURL:string = `${environment.FINANCE_BASE_URL}/reports`

  constructor(private http: HttpClient, private env: EnvService) { }

  getAllFinanceCategories(): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/FinanceCategory');
  }

  getFinanceCatList(datas: any): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/financeCategory/Account?fromDate=' + datas.fromdate + '&toDate=' + datas.todate + '&financecategory=' + datas.financeCatName + '&page=' + datas.page + '&size=' + datas.size);
  }

  downloadXL(data: any): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/financeCategory/Account/xlsx?financecategory=' + data.financeCatName + '&fromDate=' + data.fromdate + '&toDate=' + data.todate)
  }
}
