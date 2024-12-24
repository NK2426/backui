import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';


import { Cities, Citiespaginate, Postalcode, Postalcodepaginate, State, Statepaginate } from '../models/postalcodes';


@Injectable({
  providedIn: 'root'
})
export class PostalcodeService {

  CitiesApiUrl: string = `${environment.CATALOG_BASE_URL}/cities`;
  StateApiUrl: string = `${environment.CATALOG_BASE_URL}/states`;
  PostalcodesApiUrl: string = `${environment.CATALOG_BASE_URL}/postalcodes`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAllcities(params: {}): Observable<Citiespaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Citiespaginate>(this.CitiesApiUrl, option);
  }

  getCity(id: any): Observable<Cities> {
    return this.http.get<any>(this.CitiesApiUrl + '/' + id, this.env.httpOptions).pipe(map(res => res.data));
  }

  getAllstates(params: {}): Observable<Statepaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Statepaginate>(this.StateApiUrl, option);
  }

  getState(id: any): Observable<State> {
    return this.http.get<any>(this.StateApiUrl + '/' + id, this.env.httpOptions).pipe(map(res => res.data));
  }

  getAllpostcodes(params: {}): Observable<Postalcodepaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Postalcodepaginate>(this.PostalcodesApiUrl, option);
  }

  getPostcode(id: any): Observable<Postalcode> {
    return this.http.get<any>(this.PostalcodesApiUrl + '/' + id, this.env.httpOptions).pipe(map(res => res.data));
  }


}
