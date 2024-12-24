import { Injectable } from '@angular/core';


const AUTH_TOKEN = 'auth_token';
const AUTH_USER = 'auth_user';
const FUEL_DIV = 'fuel_device';
const CLIENT_ID = '0';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  logOut(): void {
    sessionStorage.clear();
  }

  logOff(): void {
    sessionStorage.clear();
  }

  public saveToken(token: string): void {
    sessionStorage.removeItem(AUTH_TOKEN);
    sessionStorage.setItem(AUTH_TOKEN, token);
  }

  public saveUser(user: object): void {
    sessionStorage.removeItem(AUTH_USER);
    sessionStorage.setItem(AUTH_USER, JSON.stringify(user));
  }

  public getToken(): any {
    return sessionStorage.getItem(AUTH_TOKEN);
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(AUTH_USER) || '{}');
  }

  public saveFueldata(fuel: object) {
    sessionStorage.removeItem(FUEL_DIV);
    sessionStorage.setItem(FUEL_DIV, JSON.stringify(fuel));
  }

  /*
    // 08.12.2020 client id
    public setClientId(id: string): void{
      window.sessionStorage.removeItem(CLIENT_ID);
      sessionStorage.setItem(CLIENT_ID, id);
    }
  
    /* public getClientId(): any{
      return JSON.parse(sessionStorage.getItem(CLIENT_ID));
    } */

}
