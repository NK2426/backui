import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Vendor, Vendorpaginate } from '../models/vendor';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  VendorApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}vendors`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Vendorpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Vendorpaginate>(this.VendorApiUrl, option);
  }

  create(data: Vendor): Observable<Vendor> {
    //console.log(JSON.stringify(data));
    return this.http.post<Vendor>(this.VendorApiUrl, data, this.env.httpOptions);
  }
  update(data: Vendor): Observable<Vendor> {
    return this.http.put<Vendor>(this.VendorApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }
  delete(data: Vendor): Observable<any> {
    return this.http.delete<Vendor>(this.VendorApiUrl + '/' + data.uuid);
  }

  findvenassoc(id: any): Observable<any> {
    return this.http.get<Vendor>(this.VendorApiUrl + '/findVen/' + id, this.env.httpOptions);
  }

  getagentid(): Observable<any> {
    return this.http.get<any>(this.VendorApiUrl + '/agent');
  }
  getAgent(): Observable<any> {
    return this.http.get<any>(this.VendorApiUrl + '/agents');
  }
  getAgentbylocation(id:any): Observable<any> {
    return this.http.get<any>(this.VendorApiUrl + '/agents/'+id);
  }
  getcategory(): Observable<any> {
    return this.http.get<any>(this.VendorApiUrl + '/categories/getall');
  }
  getParams(): Observable<Vendor> {
    //console.log(this.http.get<Vendor>(this.VendorApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Vendor>(this.VendorApiUrl + '/list', this.env.httpOptions);
  }

  find(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.VendorApiUrl + '/' + uuid, option)
      .pipe(map(res => res.data))
  }

  getStates(): Observable<any> {
    return this.http.get<any>(this.VendorApiUrl + '/getStates', this.env.httpOptions);
  }
  getStateid(id: number): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.VendorApiUrl + '/getstate/' + id, option)
      .pipe(map(res => res.data))
  }
}
