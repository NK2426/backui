import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';

import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class EnvService {

  BASE_URL = environment.HR_HEAD_SITE_URL;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }
  httpOptionswithParams = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    params: {}
  }

  uploadhttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/octet-stream' })
  }

  constructor(private tokenStrorage: TokenStorageService) {
  }
}
