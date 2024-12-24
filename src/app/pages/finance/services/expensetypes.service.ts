import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

import { Expensetypes, Expensetypespaginate } from '../models/expensetypes';

@Injectable({
  providedIn: 'root'
})
export class ExpensetypesService {

  ExpensetypesApiUrl: string = `${environment.FINANCE_BASE_URL}/expensetypes`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Expensetypespaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Expensetypespaginate>(this.ExpensetypesApiUrl, option);
  }

  create(data: Expensetypes): Observable<Expensetypes> {
    // console.log(JSON.stringify(data));
    return this.http.post<Expensetypes>(this.ExpensetypesApiUrl, data, this.env.httpOptions);
  }
  update(data: Expensetypes): Observable<Expensetypes> {
    return this.http.put<Expensetypes>(this.ExpensetypesApiUrl + '/' + data.id, data, this.env.httpOptions);
  }
  delete(data: Expensetypes): Observable<Expensetypes> {
    return this.http.delete<Expensetypes>(this.ExpensetypesApiUrl + '/' + data.id);
  }

  getParams(): Observable<Expensetypes> {
    // console.log(this.http.get<Expensetypes>(this.ExpensetypesApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Expensetypes>(this.ExpensetypesApiUrl + '/list', this.env.httpOptions);
  }

  getParambyids(data: any): Observable<Expensetypes> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Expensetypes>(this.ExpensetypesApiUrl + '/paramids', option);
  }

  findList(): Observable<any> {
    return this.http.get<any>(this.ExpensetypesApiUrl + '/list', this.env.httpOptions)
      .pipe(map(res => res.data));
  }
}
