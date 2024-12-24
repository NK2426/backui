import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Leaves, Leavespaginate, LeavesType } from '../models/leaves';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  RolesApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}leaves`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Leavespaginate> {
    let option = this.env.httpOptionsparams;
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

}
