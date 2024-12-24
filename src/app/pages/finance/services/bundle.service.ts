import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Grn, Grnpaginate } from '../models/grn';
import { Bundle, Bundlepaginate, Department } from '../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class BundleService {

  BundleApiUrl: string = `${environment.FINANCE_BASE_URL}/bundles`;
  siteurl: string = `${environment.FINANCE_SITE_URL}`;


  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}, type: any = ''): Observable<Bundlepaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Bundlepaginate>(this.BundleApiUrl + '/' + type, option)
  }
  getqcproducts(params: {}, type: any = ''): Observable<Bundlepaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Bundlepaginate>(this.BundleApiUrl + '/qcall' + type, option)
  }
  findall(uuid: string, poid: any): Observable<Bundle[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.BundleApiUrl + '/viewall/' + uuid + '/' + poid, option)
      .pipe(map(res => res.data))
  }
  findbundle(uuid: string): Observable<Bundle> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.BundleApiUrl + '/findbundle/' + uuid, option)
      .pipe(map(res => res.data))
  }
  find(uuid: string, poid: any): Observable<Bundle> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.BundleApiUrl + '/view/' + uuid + '/' + poid, option)
      .pipe(map(res => res.data))
  }
  departments(): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.BundleApiUrl + '/departments/', option)
      .pipe(map(res => res.data))
  }
  move(data: any): Observable<Bundle> {
    return this.http.put<any>(this.BundleApiUrl + '/move/' + data.bundleID, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  bulkmove(data: any): Observable<Bundle> {
    return this.http.post<any>(this.BundleApiUrl + '/bulkmove', data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  generatepsid(params: {}, uuid: string): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(this.BundleApiUrl + '/generatepsid/' + uuid, option)
      .pipe(map(res => res))
  }
  approval(uuid: any, formdata: any): Observable<Bundle> {
    return this.http.put<any>(this.BundleApiUrl + '/approve/' + uuid, formdata, this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  bundlemove(uuid: any, formdata: any): Observable<Bundle> {
    return this.http.put<any>(this.BundleApiUrl + '/bundlemove/' + uuid, formdata)
      .pipe(map(res => res.data))
  }
  saveDisupteBundleImage(formdata: any): Observable<any> {
    return this.http.put<any>(this.BundleApiUrl + '/disputebundlegallery/', formdata)
      .pipe(map(res => res.data))
  }

  getbundles(poid: string): Observable<Bundle[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.BundleApiUrl + '/getbundles/' + poid, option)
      .pipe(map(res => res.data))
  }

  getGrn(params: {}): Observable<Grnpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Grnpaginate>(this.BundleApiUrl + '/getGrn', option)
  }

  viewGrn(uuid: string): Observable<Grn> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.BundleApiUrl + '/findgrn/' + uuid, option)
      .pipe(map(res => res.data))
  }
}
