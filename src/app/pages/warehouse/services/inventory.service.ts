import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Bundle, Department, Group } from '../models/inventory';
import { Itempaginate } from '../models/item';
import { Inwarditem } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  InventoryApiUrl: string = `${environment.WAREHOUSE_BASE_URL}inventory`;


  constructor(private http: HttpClient, private env: EnvService) { }


  creategroup(data: any, id: any): Observable<Group> {
    return this.http.post<any>(this.InventoryApiUrl + '/creategroup/' + id, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  createwebgroup(data: any, id: any): Observable<Group> {
    return this.http.post<any>(this.InventoryApiUrl + '/createitemgroup/' + id, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  createqcstock(data: any): Observable<Group> {
    return this.http.post<any>(this.InventoryApiUrl + '/qcstock/', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  movetoshelf(data: any): Observable<any> {
    return this.http.post<any>(this.InventoryApiUrl + '/movetoshelf/', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  returnsmovetoshelf(data: any): Observable<any> {
    return this.http.post<any>(this.InventoryApiUrl + '/returnsmovetoshelf', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  createstock(data: any, id: any): Observable<Group> {
    return this.http.post<any>(this.InventoryApiUrl + '/stock/' + id, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  createwebstock(data: any, id: any): Observable<Group> {
    return this.http.post<any>(this.InventoryApiUrl + '/webstock/' + id, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  getStocks(params: {}): Observable<Itempaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Itempaginate>(this.InventoryApiUrl + '/stocksall', option)
  }
  stockfind(uuid: string, poid: any, shelfvariant: any,count:any): Observable<any> {
    let option = this.env.httpOptions;
    let shelf = { shelf: shelfvariant ,count:count}
    return this.http.post<any>(this.InventoryApiUrl + '/inward/' + uuid + '/' + poid, shelf,option)
  }

  grnstockfind(uuid: string, poid: any, shelfvariant: any): Observable<any> {
    let option = this.env.httpOptions;
    let shelf = { shelf: shelfvariant }
    return this.http.post<any>(this.InventoryApiUrl + '/grninward/' + uuid + '/' + poid, shelf, option)
  }

  stockfindcheck(data: any): Observable<any> {
    return this.http.post<any>(this.InventoryApiUrl + '/checkinward/', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  stockfindsingle(uuid: string, shelfvariant: any): Observable<any> {
    let option = this.env.httpOptions;
    let shelf = { shelf: shelfvariant }
    return this.http.post<any>(this.InventoryApiUrl + '/returninward/' + uuid, shelf, option)

  }

  qcgroupfind(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/qcgroup/' + uuid, option)
      .pipe(map(res => res.data))
  }
  departments(): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/departments', option)
      .pipe(map(res => res.data))
  }
  saveGallery(uuid: any, formdata: any): Observable<Bundle> {
    return this.http.put<any>(this.InventoryApiUrl + '/gallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }
  bulkstockmovedispute(uuid: any, formdata: any): Observable<Inwarditem> {
    return this.http.put<any>(this.InventoryApiUrl + '/bulkstockmovedispute/' + uuid, formdata)
      .pipe(map(res => res.data))
  }
  saveDisupteItem(formdata: any): Observable<any> {
    return this.http.put<any>(this.InventoryApiUrl + '/disputeitem/', formdata)
      .pipe(map(res => res.data))
  }

  savegrnDisupteItem(formdata: any): Observable<any> {
    return this.http.put<any>(this.InventoryApiUrl + '/grndisputeitem', formdata)
      .pipe(map(res => res.data))
  }

  syncinventory(poid: string): Observable<any> {
    let data = { poid: poid };
    return this.http.post<any>(this.InventoryApiUrl + '/syncinventory/' + poid, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }

  grnmovetoshelf(data: any): Observable<any> {
    return this.http.post<any>(this.InventoryApiUrl + '/grnmovetoshelf/', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  grnsyncinventory(grnid: string): Observable<any> {
    let data = { grnid: grnid };
    return this.http.post<any>(this.InventoryApiUrl + '/grnsyncinventory/' + grnid, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }

}
