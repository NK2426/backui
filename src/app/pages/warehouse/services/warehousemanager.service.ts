import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Warehouse } from '../models/warehouse';
import { Warehousepaginate } from '../models/warehouse';

const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class WarehouseManagerService {
  WarehouseApiUrl: string = `${environment.WAREHOUSE_BASE_URL}warehouses`;

  constructor(private http: HttpClient, private env: EnvService) {}

  getAll(params: {}): Observable<Warehousepaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Warehousepaginate>(this.WarehouseApiUrl, option);
  }
  create(data: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.WarehouseApiUrl +'/add', data, this.env.httpOptions);
  }
  update(data: Warehouse): Observable<any> {
    return this.http.put<Warehouse>(this.WarehouseApiUrl + '/' + data.id, data, this.env.httpOptions);
  }
  view(data:string):Observable<Warehouse>{
    let option = this.env.httpOptions;
    return this.http.get<any>(this.WarehouseApiUrl + '/' + data, option)
      .pipe(map(res => res.data))
  }
  delete(data: Warehouse): Observable<any> {
    return this.http.delete<Warehouse>(this.WarehouseApiUrl + '/' + data.id);
  }

  getStates(): Observable<any> {
    return this.http.get<any>(this.WarehouseApiUrl + '/getStates', this.env.httpOptions);
  }
}
