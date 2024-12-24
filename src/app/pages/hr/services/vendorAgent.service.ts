import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { agentpaginate, vendoragent } from '../models/vendoragent';
import { Vendorpaginate } from '../../category-head/models/vendor';

@Injectable({
  providedIn: 'root'
})
export class vendorAgentService {
  RolesApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}vendors/agent`;

  constructor(private http: HttpClient, private env: EnvService) {}

  create(data: vendoragent): Observable<any> {
    return this.http.post<vendoragent>(this.RolesApiUrl + '/add', data, this.env.httpOptions);
  }
  delete(data: vendoragent): Observable<vendoragent> {
    return this.http.delete<vendoragent>(this.RolesApiUrl + '/' + data.id);
  }
  update(data: vendoragent): Observable<vendoragent> {
    return this.http.put<vendoragent>(this.RolesApiUrl + '/' + data.id, data, this.env.httpOptions);
  }
  getvendor(id: any): Observable<any> {
    return this.http.get<vendoragent>(this.RolesApiUrl + '/agentvendors/' + id, this.env.httpOptions);
  }

  getAll(params: {}): Observable<agentpaginate> {
    let option = this.env.httpOptionswithParams;
    option['params'] = params;
    return this.http.get<agentpaginate>(this.RolesApiUrl, option);
  }
  }
