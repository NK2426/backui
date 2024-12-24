import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class EnvService {
     
//   BASE_URL = environment.apiUrl+'/';
   
  SITE_URL = environment.siteUrl; 

//   Vendor_URL= environment.Vendor_URL; 

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    httpOptionsparams = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: {}
    };

    uploadhttpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/octet-stream' })
    };
  
    httpOptionswithParams = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: {}
    }
 

}
