import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Department } from '../models/department';
import { Group, Grouppaginate } from '../models/groups';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  GroupApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}groups`;
  siteurl: string = `${environment.CATEGORY_HEAD_SITE_URL}`;

  constructor(private http: HttpClient, private env: EnvService) { }

  departments(): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.GroupApiUrl + '/departments/', option)
      .pipe(map(res => res.data))
  }

  creategroup(data: any): Observable<Group> {
    return this.http.post<any>(this.GroupApiUrl + '/creategroup', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  //   createwebstock(data:any, id:any): Observable<Group>{
  //     return this.http.post<any>(this.InventoryApiUrl+'/webstock/'+id, data, this.env.httpOptions)
  //               .pipe(map(res => res.data));
  //   }

  getAllgrp(params: {}): Observable<Grouppaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Grouppaginate>(this.GroupApiUrl, option)
  }

  delete(data: Group): Observable<Group> {
    return this.http.delete<Group>(this.GroupApiUrl + '/' + data.id);
  }

  findList(): Observable<any> {
    return this.http.get<any>(this.GroupApiUrl + '/list', this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  findall(): Observable<any> {
    return this.http.get<any>(this.GroupApiUrl + '/get', this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  update(data: Group): Observable<Group> {
    return this.http.put<any>(this.GroupApiUrl + '/' + data.id, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }

  find(id: string): Observable<any> {
    let option = this.env.httpOptionsparams;
    return this.http.get<any>(this.GroupApiUrl + '/' + id, this.env.httpOptions)
      .pipe(map(res => res.data))
  }

  allitems(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.GroupApiUrl + '/allitems', option)
      .pipe(map(res => res.data))
  }

  allgrpitems(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.GroupApiUrl + '/allgrpitems/' + id, option)
      .pipe(map(res => res.data))
  }

  allsubgrpitems(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.GroupApiUrl + '/allsubgrpitems/' + id, option)
      .pipe(map(res => res.data))
  }

}