import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

// import { EnvService } from './env.service';
import { EnvService } from 'src/app/_helpers/env.service';
import { Leaves, Leavespaginate } from '../models/leaves';
import { LeavesType } from '../models/leavetypes';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  RolesApiUrl: string = `${environment.HR_HEAD_BASE_URL}leaves`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Leavespaginate> {
    let option = this.env.httpOptionswithParams;
    option['params'] = params;
    return this.http.get<Leavespaginate>(this.RolesApiUrl, option);
  }

  create(data: Leaves): Observable<Leaves> {
    //console.log(JSON.stringify(data));
    return this.http.post<Leaves>(this.RolesApiUrl, data, this.env.httpOptions);
  }
  update(data: Leaves): Observable<Leaves> {
    return this.http.put<Leaves>(this.RolesApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }
  delete(data: Leaves): Observable<Leaves> {
    return this.http.delete<Leaves>(this.RolesApiUrl + '/' + data.uuid);
  }

  getParams(): Observable<any> {
    return this.http.get<LeavesType>(this.RolesApiUrl + '/list', this.env.httpOptions);
  }

  find(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.RolesApiUrl + '/' + uuid, option)
      .pipe(map(res => res.data))
  }

  approve(data: Leaves): Observable<any> {
    return this.http.put<Leaves>(this.RolesApiUrl + '/approve/' + data.uuid, data, this.env.httpOptions).pipe(map(res => res));;
  }
}
