import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { EnvService } from './env.service';
import { User, Userpaginate, Role } from '../pages/purchaser/models/user';
import { environment } from 'src/environments/environment';
import { Warehouse } from '../pages/purchaser/models/purchaseorder';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  UserApiUrl: string = environment.apiUrl + '/users';
  RoleApiUrl: string = environment.apiUrl + 'roles';

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}, type: any = ''): Observable<Userpaginate> {
    let option = this.env.httpOptionswithParams;
    option['params'] = params;
    return this.http.get<Userpaginate>(this.UserApiUrl + '/' + type, option);
  }

  create(data: User): Observable<any> {
    return this.http.post<User>(this.UserApiUrl, data, this.env.httpOptions);
  }
  update(data: User): Observable<any> {
    return this.http.put<User>(this.UserApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }
  delete(data: User): Observable<User> {
    return this.http.delete<User>(this.UserApiUrl + '/' + data.uuid);
  }

  getParams(): Observable<User> {
    return this.http.get<User>(this.UserApiUrl + '/list', this.env.httpOptions);
  }

  find(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.UserApiUrl + '/' + uuid, option)
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

  getWarehouses(): Observable<Role[]> {
    return this.http.get<Warehouse[]>(this.RoleApiUrl + '/warehouses', this.env.httpOptions);
  }
}
