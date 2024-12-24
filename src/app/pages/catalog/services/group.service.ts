import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { GenericGroupResponse, Group, Grouppaginate } from '../models/groups';

@Injectable({
  providedIn: 'root'
})
export class GroupService {


  GroupsApiUrl: string = `${environment.CATALOG_BASE_URL}/groups`;
  GroupApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}groups`;

  constructor(private http: HttpClient, private env: EnvService) { }

  find(uuid: any): Observable<Group> {
    return this.http.get<any>(this.GroupsApiUrl + '/' + uuid, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  getAll(params: {}): Observable<Grouppaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Grouppaginate>(this.GroupsApiUrl, option);
  }
  findall(): Observable<any> {
    return this.http.get<any>(this.GroupApiUrl + '/get', this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  getParams(): Observable<Group> {
    //console.log(this.http.get<Group>(this.GroupsApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Group>(this.GroupsApiUrl + '/list', this.env.httpOptions);
  }

  getParambyids(data: any): Observable<Group> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Group>(this.GroupsApiUrl + '/paramids', option);
  }

  findcatassoc(id: any): Observable<any> {
    return this.http.get<Group>(this.GroupsApiUrl + '/findCat/' + id, this.env.httpOptions);
  }
  updateimg(formdata: Group): Observable<Group> {
    return this.http.post<any>(this.GroupsApiUrl + '/saveimgdata', formdata)
      .pipe(map(res => res.data))
  }
  toggleProductParamFilter(uuid: string, toggleValue: number, name_ta?: string): Observable<Group> {
    let data = {
      "showinfilter": toggleValue,
      "name_ta": name_ta
    }
    return this.http.post<any>(this.GroupsApiUrl + `/updateparameter/${uuid}`, data)
      .pipe(map(res => res.data))
  }

  updateProductParamFilterValue(productParameterValueId: string, value_ta?: string): Observable<GenericGroupResponse> {
    let data = {
      "value_ta": value_ta
    }
    return this.http.post<any>(this.GroupsApiUrl + `/updateparametervalue/${productParameterValueId}`, data)
      .pipe(map(res => res.data))
  }
}
