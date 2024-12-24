import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

import { Financecategories, Financecategoriespaginate } from '../models/financecategories';

@Injectable({
  providedIn: 'root'
})
export class FinancecategoriesService {

  ExpensetypesApiUrl: string = `${environment.FINANCE_BASE_URL}/financecategories`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Financecategoriespaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Financecategoriespaginate>(this.ExpensetypesApiUrl, option);
  }

  create(data: Financecategories): Observable<Financecategories> {
    // console.log(JSON.stringify(data));
    return this.http.post<Financecategories>(this.ExpensetypesApiUrl, data, this.env.httpOptions);
  }
  update(data: Financecategories): Observable<Financecategories> {
    return this.http.put<Financecategories>(this.ExpensetypesApiUrl + '/' + data.id, data, this.env.httpOptions);
  }
  delete(data: Financecategories): Observable<Financecategories> {
    return this.http.delete<Financecategories>(this.ExpensetypesApiUrl + '/' + data.id);
  }

  getParams(): Observable<Financecategories> {
    // console.log(this.http.get<Financecategories>(this.ExpensetypesApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Financecategories>(this.ExpensetypesApiUrl + '/list', this.env.httpOptions);
  }

  getParambyids(data: any): Observable<Financecategories> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Financecategories>(this.ExpensetypesApiUrl + '/paramids', option);
  }

  findList(): Observable<any> {
    return this.http.get<any>(this.ExpensetypesApiUrl + '/list', this.env.httpOptions)
      .pipe(map(res => res.data));
  }
}
