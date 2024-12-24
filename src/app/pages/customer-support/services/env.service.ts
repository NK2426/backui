import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})

export class EnvService {


  BASE_URL = environment.apiUrl;
  SITE_URL = environment.siteUrl;
  CATALOG_URL = environment.CATALOG_URL;
  CUSTOMER_URL = environment.CUSTOMER_SUPPORT_BASE_URL


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  httpOptionsparams = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    params: {}
  }

  uploadhttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/octet-stream' })
  }

  uploadhttpOptionscors = {
    headers: new HttpHeaders(
      {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/octet-stream'
      }
    )

  }


  constructor(private tokenStrorage: TokenStorageService) {
  }
}
