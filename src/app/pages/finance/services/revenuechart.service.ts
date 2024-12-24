import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from '../../purchaser/services/env.service';
import { HttpClient } from '@angular/common/http';
import { RevenueChart } from '../models/revenueChart';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RevenuechartService {
  financeReportURL: string = `${environment.FINANCE_BASE_URL}/reports`

  constructor(private http: HttpClient, private env: EnvService) { }

  getRevenueList(): Observable<RevenueChart> {
    return this.http.get<RevenueChart>(this.financeReportURL + '/revenue');
  }

  getAllWarehouse(): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/warehouse');
  }

  todaySalesReport(): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/dashbord')
  }

  warehouseSalesReport(warehouseID: any): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/dashbord?warehouse_id=' + warehouseID)
  }

  orderCount(): Observable<any> {
    return this.http.get<any>(this.financeReportURL + '/month/salecount');
  }
}
