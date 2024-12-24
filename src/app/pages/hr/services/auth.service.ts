import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
// import { EnvService } from './env.service';
import { TokenStorageService } from './token-storage.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  BASE_URL = environment.HR_HEAD_SITE_URL;

  isLoggedin = false;

  constructor(private http: HttpClient, public envService: EnvService, private storage: TokenStorageService) {
    this.checkLogin();
    this.isLoggedin = !!this.storage.getToken()
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}auth`, {
      username: username,
      password: password
    }, this.envService.httpOptions);
  }
  checkLogin() {
    this.isLoggedin = !!this.storage.getToken()
  }
  logout() {
    this.isLoggedin = false;
  }


}
