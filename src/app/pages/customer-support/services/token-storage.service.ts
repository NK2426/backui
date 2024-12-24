import { Injectable } from '@angular/core';


const AUTH_TOKEN = 'auth_token';
const AUTH_USER = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  logOut(): void{
      localStorage.clear();
  }

  public saveToken(token: string): void{
      localStorage.removeItem(AUTH_TOKEN);
      localStorage.setItem(AUTH_TOKEN, token);
  }

  public saveUser(user: object): void{ 
    localStorage.removeItem(AUTH_USER);
    localStorage.setItem(AUTH_USER, JSON.stringify(user));
  }

  public getToken(): any{
    return localStorage.getItem(AUTH_TOKEN);
  }  
  
  public getUser(): any{
      return JSON.parse(localStorage.getItem(AUTH_USER) || '{}') ;
  } 

  
}
