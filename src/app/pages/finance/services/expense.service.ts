import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Expense, Expensepaginate } from '../models/expenses';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  ExpenseApiUrl: string = `${environment.FINANCE_BASE_URL}/expenses`;
  warehouse: string = `${environment.FINANCE_BASE_URL}`

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Expensepaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Expensepaginate>(this.ExpenseApiUrl, option);
  }

  create(data: Expense): Observable<Expense> {
    // console.log(JSON.stringify(data));
    return this.http.post<any>(this.ExpenseApiUrl, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  update(data: Expense): Observable<Expense> {
    return this.http.put<any>(this.ExpenseApiUrl + '/' + data.uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  delete(data: Expense): Observable<Expense> {
    return this.http.delete<Expense>(this.ExpenseApiUrl + '/' + data.uuid);
  }

  find(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ExpenseApiUrl + '/' + uuid, option)
      .pipe(map(res => res.data))
  }
  getlistall(did: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ExpenseApiUrl + '/' + did + '/listall', option)
      .pipe(map(res => res.data))
  }

  saveData(formdata: Expense): Observable<Expense> {
    return this.http.post<any>(this.ExpenseApiUrl + '/savefiledata', formdata)
      .pipe(map(res => res.data))
  }

  removeFile(uuid: any): Observable<any> {
    return this.http.get<any>(this.ExpenseApiUrl + '/removefile/' + uuid, this.env.httpOptions);
  }

  getAllWarehouse(): Observable<any> {
    return this.http.get<any>(this.warehouse + '/reports/warehouse');
  }

}
