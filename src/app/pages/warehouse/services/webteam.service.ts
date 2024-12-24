import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Bundle, Categories, Department, Group, Grouppaginate, Subcategories } from '../models/inventory';
import { Itempaginate } from '../models/item';
import { Brands } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class WebteamService {

  InventoryApiUrl: string = `${environment.WAREHOUSE_BASE_URL}webteam`;

  constructor(private http: HttpClient, private env: EnvService) { }

  departments(): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/departments/', option)
      .pipe(map(res => res.data))
  }

  getAll(params: {}, type: any = ''): Observable<Itempaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Itempaginate>(this.InventoryApiUrl + '/stocks', option)
  }

  creategroup(data: any): Observable<Group> {
    return this.http.post<any>(this.InventoryApiUrl + '/creategroup', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  createwebstock(data: any, id: any): Observable<Group> {
    return this.http.post<any>(this.InventoryApiUrl + '/webstock/' + id, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  findproduct(params: {}, uuid: string): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(this.InventoryApiUrl + '/finditem/' + uuid, option)
      .pipe(map(res => res.data))
  }
  saveGallery(uuid: any, formdata: any): Observable<Bundle> {
    return this.http.put<any>(this.InventoryApiUrl + '/gallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }

  removeImage(id: any, itemid: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/removeimg/' + id + '/' + itemid, option)
      .pipe(map(res => res.data))
  }

  //Newly Added
  getAllgrp(params: {}): Observable<Grouppaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Grouppaginate>(this.InventoryApiUrl, option)
  }

  delete(data: Group): Observable<Group> {
    return this.http.delete<Group>(this.InventoryApiUrl + '/' + data.id);
  }

  findList(): Observable<any> {
    return this.http.get<any>(this.InventoryApiUrl + '/list', this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  update(data: Group): Observable<Group> {
    return this.http.put<any>(this.InventoryApiUrl + '/' + data.id, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }

  find(id: string): Observable<any> {
    let option = this.env.httpOptionsparams;
    return this.http.get<any>(this.InventoryApiUrl + '/' + id, this.env.httpOptions)
      .pipe(map(res => res.data))
  }

  catlist(did: string): Observable<Categories[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/catlist/' + did, option)
      .pipe(map(res => res.data))
  }
  subcatlist(cid: string): Observable<Subcategories[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/subcatlist/' + cid, option)
      .pipe(map(res => res.data))
  }
  brandlist(did: any): Observable<Brands[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/brandlist/' + did, option)
      .pipe(map(res => res.data))
  }

  savebanner(formdata: any, did: any): Observable<any> {
    return this.http.put<any>(this.InventoryApiUrl + '/banner/' + did, formdata)
      .pipe(map(res => res.data))
  }

  findimages(params: {}, did: any): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(this.InventoryApiUrl + '/findimages/' + did, option).pipe(map(res => res.data))
  }

  linkitemlist(type: any, did: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/linkitems/' + did + '/' + type, option)
      .pipe(map(res => res.data))
  }

  createbanner(formdata: any): Observable<any> {
    return this.http.post<any>(this.InventoryApiUrl + '/createbanner/', formdata)
      .pipe(map(res => res.data))
  }

  getBanners(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/banners', option)
      .pipe(map(res => res.data))
  }

  removeBanner(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/removebanner/' + id, option)
      .pipe(map(res => res.data))
  }

  allitems(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/allitems', option)
      .pipe(map(res => res.data))
  }

  allgrpitems(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/allgrpitems/' + id, option)
      .pipe(map(res => res.data))
  }

  allsubgrpitems(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.InventoryApiUrl + '/allsubgrpitems/' + id, option)
      .pipe(map(res => res.data))
  }

}
