import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';
import { Roles, Rolespaginate } from '../models/roles';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveTypesService {
  RolesApiUrl: string = environment.apiUrl + '/leavetype';

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Rolespaginate> {
    let option = this.env.httpOptionswithParams;
    option['params'] = params;
    return this.http.get<Rolespaginate>(this.RolesApiUrl, option);
  }

  create(data: Roles): Observable<Roles> {
    //console.log(JSON.stringify(data));
    return this.http.post<Roles>(this.RolesApiUrl, data, this.env.httpOptions);
  }
  update(data: Roles): Observable<Roles> {
    return this.http.put<Roles>(this.RolesApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }
  delete(data: Roles): Observable<Roles> {
    return this.http.delete<Roles>(this.RolesApiUrl + '/' + data.uuid);
  }

  getParams(): Observable<Roles> {
    //console.log(this.http.get<Roles>(this.RolesApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Roles>(this.RolesApiUrl + '/list', this.env.httpOptions);
  }

  getParambyids(data: any): Observable<Roles> {
    let option = this.env.httpOptionswithParams;
    option['params'] = data;
    return this.http.get<Roles>(this.RolesApiUrl + '/paramids', option);
  }
}
