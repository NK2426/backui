import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Bankaccount, Bankaccountpaginate } from '../models/bankaccounts';


@Injectable({
  providedIn: 'root'
})
export class BankaccountsService {

  BankaccountApiUrl: string = `${environment.FINANCE_BASE_URL}/bankaccounts`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Bankaccountpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Bankaccountpaginate>(this.BankaccountApiUrl, option);
  }

  create(data: Bankaccount): Observable<Bankaccount> {
    // console.log(JSON.stringify(data));
    return this.http.post<any>(this.BankaccountApiUrl, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  update(data: Bankaccount): Observable<Bankaccount> {
    return this.http.put<any>(this.BankaccountApiUrl + '/' + data.uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  delete(data: Bankaccount): Observable<Bankaccount> {
    return this.http.delete<Bankaccount>(this.BankaccountApiUrl + '/' + data.uuid);
  }

  getParams(): Observable<Bankaccount> {
    // console.log(this.http.get<Bankaccount>(this.BankaccountApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Bankaccount>(this.BankaccountApiUrl + '/list', this.env.httpOptions);
  }

  find(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.BankaccountApiUrl + '/' + uuid, option)
      .pipe(map(res => res.data))
  }
  getlistall(did: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.BankaccountApiUrl + '/' + did + '/listall', option)
      .pipe(map(res => res.data))
  }

  findList(): Observable<any> {
    return this.http.get<any>(this.BankaccountApiUrl + '/list', this.env.httpOptions)
      .pipe(map(res => res.data));
  }

}
