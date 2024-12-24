import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Shipper, Shipperpaginate } from '../models/shipper';

@Injectable({
  providedIn: 'root'
})
export class ShipperService {

  ShipperApiUrl: string = `${environment.WAREHOUSE_BASE_URL}shippers`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Shipperpaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Shipperpaginate>(this.ShipperApiUrl, option);
  }
  create(data: Shipper): Observable<Shipper> {
    return this.http.post<Shipper>(this.ShipperApiUrl, data, this.env.httpOptions);
  }
  update(data: Shipper): Observable<Shipper> {
    return this.http.put<Shipper>(this.ShipperApiUrl + '/' + data.id, data, this.env.httpOptions);
  }
  delete(data: Shipper): Observable<any> {
    return this.http.delete<Shipper>(this.ShipperApiUrl + '/' + data.id);
  }

}
