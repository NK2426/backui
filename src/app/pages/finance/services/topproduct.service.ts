import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Data } from '../models/topProduct';

@Injectable({
  providedIn: 'root'
})
export class TopproductService {
  financeReportURL: string = `${environment.FINANCE_BASE_URL}/reports`

  constructor(private http: HttpClient, private env: EnvService) { }

  getAllSalesOrder(): Observable<Data> {
    return this.http.get<Data>(this.financeReportURL + '/topSales');
  }
}
