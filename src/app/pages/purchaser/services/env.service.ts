import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class EnvService {
  // BASE_URL = environment.BASE_URL;

  // SITE_URL = environment.SITE_URL;

  // Vendor_URL= environment.Vendor_URL;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  httpOptionsparams = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    params: {}
  };

  httpOptionswithParams = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    params: {}
  }

  uploadhttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/octet-stream' })
  };
  Vendor_URL: string;
}
