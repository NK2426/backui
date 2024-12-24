import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Department, Departmentpaginate } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  DepartmentApiUrl: string = `${environment.CATALOG_BASE_URL}/departments`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Departmentpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Departmentpaginate>(this.DepartmentApiUrl, option);
  }

  find(uuid: any): Observable<any> {
    return this.http.get<any>(this.DepartmentApiUrl + '/' + uuid, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  update(data: Department): Observable<Department> {
    return this.http.put<Department>(this.DepartmentApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }

  updateimg(formdata: Department): Observable<Department> {
    return this.http.post<any>(this.DepartmentApiUrl + '/saveimgdata', formdata)
      .pipe(map(res => res.data))
  }

  findList(): Observable<any> {
    return this.http.get<any>(this.DepartmentApiUrl + '/list', this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  finddepassoc(id: any): Observable<any> {
    return this.http.get<Department>(this.DepartmentApiUrl + '/findDept/' + id, this.env.httpOptions);
  }

  getParambyids(data: any): Observable<Department> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Department>(this.DepartmentApiUrl + '/paramids', option);
  }

}
