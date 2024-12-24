import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Item } from '../models/item';
import { Supersale, Supersalepaginate } from '../models/supersale';
import { Supersales, Supersalespaginate } from '../models/supersales';

@Injectable({
  providedIn: 'root'
})
export class SupersaleService {

  SupersaleApiUrl: string = `${environment.CATALOG_BASE_URL}/supersale`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Supersalepaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Supersalepaginate>(this.SupersaleApiUrl, option);
  }

  getAllsupersales(params: {}): Observable<Supersalespaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Supersalepaginate>(this.SupersaleApiUrl, option);
  }

  create(data: Supersale): Observable<Supersale> {
    //console.log(JSON.stringify(data));
    return this.http.post<any>(this.SupersaleApiUrl, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  update(data: Supersale): Observable<Supersale> {
    return this.http.put<any>(this.SupersaleApiUrl + '/' + data.uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  delete(data: Supersale): Observable<Supersale> {
    return this.http.delete<Supersale>(this.SupersaleApiUrl + '/' + data.id);
  }

  deleteItem(data: Item): Observable<Item> {
    return this.http.delete<Item>(this.SupersaleApiUrl + '/item/' + data.id);
  }

  deletesuperItem(data: Item): Observable<Item> {
    return this.http.delete<Item>(this.SupersaleApiUrl + '/superitem/' + data.id);
  }

  find(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.SupersaleApiUrl + '/' + uuid, option)
      .pipe(map(res => res.data))
  }

  viewItems(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.SupersaleApiUrl + '/item/' + id, option)
      .pipe(map(res => res.data))
  }

  viewsupersaleItems(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.SupersaleApiUrl + '/supersaleitem/' + id, option)
      .pipe(map(res => res.data))
  }

  getlistall(did: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.SupersaleApiUrl + '/' + did + '/listall', option)
      .pipe(map(res => res.data))
  }

  saveData(formdata: Supersale): Observable<Supersale> {
    return this.http.post<any>(this.SupersaleApiUrl + '/savefiledata', formdata)
      .pipe(map(res => res.data))
  }

  supersalesaveData(formdata: Supersales): Observable<Supersales> {
    return this.http.post<any>(this.SupersaleApiUrl + '/supersalesavefiledata', formdata)
      .pipe(map(res => res.data))
  }

  import(formdata: any): Observable<any> {
    return this.http.post<any>(this.SupersaleApiUrl + '/import', formdata)
      .pipe(map(res => res))
  }

  importsupersale(formdata: any): Observable<any> {
    return this.http.post<any>(this.SupersaleApiUrl + '/importsupersale', formdata)
      .pipe(map(res => res))
  }

  removeFile(uuid: any): Observable<any> {
    return this.http.get<any>(this.SupersaleApiUrl + '/removefile/' + uuid, this.env.httpOptions);
  }

  download(type: any, id: any, groups: any[]): Observable<any> {
    return this.http.get<any>(this.SupersaleApiUrl + '/download/' + type + '/' + id + '/' + groups, this.env.httpOptions);
  }

  excelToJson(formdata: any): Observable<any> {
    return this.http.post<any>(this.SupersaleApiUrl + '/getsuperexceldata', formdata);
  }

  saveUpdatedDump(itemData: any): Observable<any> {
    return this.http.post<any>(this.SupersaleApiUrl + '/superexceldatasave', itemData);
  }

}


