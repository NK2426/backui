import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';


// import { EnvService } from './env.service';
import { EnvService } from 'src/app/_helpers/env.service';
import { User, Userpaginate, Role, Warehouse } from '../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  UserApiUrl: string = `${environment.HR_HEAD_BASE_URL}users`;
  RoleApiUrl: string = `${environment.HR_HEAD_BASE_URL}roles`;
  VendorApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}vendors`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}, type: any = ''): Observable<Userpaginate> {
    let option = this.env.httpOptionswithParams;
    option['params'] = params;
    return this.http.get<Userpaginate>(this.UserApiUrl + '/' + type, option);
  }

  create(data: User): Observable<any> {
    //console.log(JSON.stringify(data));
    return this.http.post<User>(this.UserApiUrl, data, this.env.httpOptions);
  }
  update(data: User): Observable<any> {
    return this.http.put<User>(this.UserApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }
  delete(data: User): Observable<User> {
    return this.http.delete<User>(this.UserApiUrl + '/' + data.uuid);
  }

  getParams(): Observable<User> {
    //console.log(this.http.get<User>(this.UserApiUrl + '/list', this.env.httpOptions));
    return this.http.get<User>(this.UserApiUrl + '/list', this.env.httpOptions);
  }

  find(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.UserApiUrl + '/user/' + uuid, option)
      .pipe(map(res => res.data))
  }

  editProfile(data: User): Observable<User> {
    return this.http.put<User>(this.UserApiUrl + '/profile/', data, this.env.httpOptions);
  }

  changepwd(data: User): Observable<any> {
    return this.http.put<User>(this.UserApiUrl + '/changepwd/', data, this.env.httpOptions);
  }

  getUsers(client: string): Observable<User[]> {
    let option = this.env.httpOptionswithParams;
    option['params'] = client;
    return this.http.get<User[]>(this.UserApiUrl + '/client/' + client, option);
  }
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.RoleApiUrl, this.env.httpOptions);
  }
  checkid(role:any): Observable<any> {
    return this.http.get<any[]>(this.UserApiUrl + '/emp/checkid/'+role, this.env.httpOptions);
  }
  getPurchaserid(): Observable<any> {
    return this.http.get<any[]>(this.UserApiUrl + '/purchaser/getPurchaserid', this.env.httpOptions);
  }
  getWarehouses(): Observable<Role[]> {
    return this.http.get<Warehouse[]>(this.RoleApiUrl + '/warehouses', this.env.httpOptions);
  }
  getStates(): Observable<any> {
    return this.http.get<any>(this.VendorApiUrl + '/getStates', this.env.httpOptions);
  }
}
