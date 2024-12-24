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

  DepartmentApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}departments`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Departmentpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Departmentpaginate>(this.DepartmentApiUrl, option);
  }

  create(data: Department): Observable<Department> {
    //console.log(JSON.stringify(data));
    return this.http.post<Department>(this.DepartmentApiUrl, data, this.env.httpOptions);
  }
  update(data: Department): Observable<Department> {
    return this.http.put<Department>(this.DepartmentApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }
  delete(data: Department): Observable<any> {
    return this.http.delete<Department>(this.DepartmentApiUrl + '/' + data.uuid);
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
