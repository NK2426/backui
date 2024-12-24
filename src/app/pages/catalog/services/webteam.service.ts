import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Brands } from '../models/brands';
import { Categories } from '../models/categories';
import { Department } from '../models/department';
import { Group, Grouppaginate } from '../models/inventory';
import { Itempaginate } from '../models/item';
import { Subcategories } from '../models/subcategories';
import { Store } from '../models/store';

const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class WebteamService {

  productApiUrl: string = `${environment.CATALOG_BASE_URL}/products`;
  itemApiUrl: string = `${environment.CATALOG_BASE_URL}/item`;
  TagApiUrl: string = `${environment.CATALOG_BASE_URL}/tags`;
  BlogsApiUrl: string = `${environment.CATALOG_BASE_URL}/blogs`;
  EventsApiUrl: string = `${environment.CATALOG_BASE_URL}/live-events`;
  StoreApiUrl: string = `${environment.CATALOG_BASE_URL}/directcatalog`;
  siteurl: string = `${environment.CATALOG_SITE_URL}`;

  constructor(private http: HttpClient, private env: EnvService) { }

  departments(): Observable<Department[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/departments/', option)
      .pipe(map(res => res.data))
  }

  getAll(params: {}, type: any = ''): Observable<Itempaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Itempaginate>(this.productApiUrl + '/stocks', option)
  }

  creategroup(data: any): Observable<Group> {
    return this.http.post<any>(this.productApiUrl + '/creategroup', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  updateProduct(data: any, id: any): Observable<Group> {
    return this.http.put<any>(this.itemApiUrl + '/updateproduct/' + id, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  saveitemstock(data: any, uuid: string): Observable<any> {
    return this.http.put<any>(this.itemApiUrl + '/additem/' + uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  priceupdate(data: any, uuid: string): Observable<any> {
    return this.http.put<any>(this.itemApiUrl + '/updateprice/' + uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  updateclondedata(data: any, uuid: string): Observable<any> {
    return this.http.put<any>(this.itemApiUrl + '/clonedata/' + uuid, data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  updatestatus(data: any): Observable<any> {
    return this.http.put<any>(this.itemApiUrl + '/updatestatus', data, this.env.httpOptions)
      .pipe(map(res => res.data));
  }
  checkproduct(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.itemApiUrl + '/checkproduct/' + uuid, option)
      .pipe(map(res => res.data))
  }
  findproduct(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.itemApiUrl + '/finditem/' + uuid, option)
      .pipe(map(res => res.data))
  }
  finditemlist(uuid: string): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.itemApiUrl + '/viewitemlist/' + uuid, option)
      .pipe(map(res => res.data))
  }
  savetoGallery(uuid: any, formdata: any): Observable<any> {
    return this.http.put<any>(this.itemApiUrl + '/gallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }
  savetovGallery(uuid: any, formdata: any): Observable<any> {
    return this.http.put<any>(this.itemApiUrl + '/vgallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }

  savedefaultimage(uuid: any, formdata: any): Observable<any> {
    return this.http.put<any>(this.itemApiUrl + '/singlegallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }
  savedefaultvideo(uuid: any, formdata: any): Observable<any> {
    return this.http.put<any>(this.itemApiUrl + '/singlevgallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }
  saveitemimages(uuid: any, formdata: any): Observable<any> {
    return this.http.put<any>(this.itemApiUrl + '/itemgallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }

  removeImage(imageid: any): Observable<any> {
    return this.http.put<any>(this.itemApiUrl + '/removeimg/' + imageid, {})
      .pipe(map(res => res.data))
  }

  //Newly Added
  getAllgrp(params: {}): Observable<Grouppaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Grouppaginate>(this.productApiUrl, option)
  }

  delete(data: Group): Observable<Group> {
    return this.http.delete<Group>(this.productApiUrl + '/' + data.id);
  }

  findList(): Observable<any> {
    return this.http.get<any>(this.productApiUrl + '/list', this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  update(data: Group): Observable<Group> {
    return this.http.put<any>(this.productApiUrl + '/' + data.id, data, this.env.httpOptions)
      .pipe(map(res => res.data))
  }

  find(id: string): Observable<any> {
    let option = this.env.httpOptionsparams;
    return this.http.get<any>(this.productApiUrl + '/' + id, this.env.httpOptions)
      .pipe(map(res => res.data))
  }

  findPage(type: string, uuid: string): Observable<any> {
    let option = this.env.httpOptionsparams;
    return this.http.get<any>(this.productApiUrl + '/page/' + type + '/' + uuid, this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  findWebPage(type: string, uuid: string): Observable<any> {
    let option = this.env.httpOptionsparams;
    return this.http.get<any>(this.productApiUrl + '/page/' + type + '/' + uuid, this.env.httpOptions)
  }
  findHomePage(type: string, uuid: string): Observable<any> {
    let option = this.env.httpOptionsparams;
    return this.http.get<any>(this.productApiUrl + '/page/' + type + '/' + uuid, this.env.httpOptions)
  }
  catlist(did: string): Observable<Categories[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/catlist/' + did, option)
      .pipe(map(res => res.data))
  }
  subcatlist(cid: string): Observable<Subcategories[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/subcatlist/' + cid, option)
      .pipe(map(res => res.data))
  }
  brandlist(did: any): Observable<Brands[]> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/brandlist/' + did, option)
      .pipe(map(res => res.data))
  }

  savebanner(formdata: any, did: any): Observable<any> {
    return this.http.put<any>(this.productApiUrl + '/banner/' + did, formdata)
      .pipe(map(res => res.data))
  }

  findimages(params: {}, did: any): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(this.productApiUrl + '/findimages/' + did, option).pipe(map(res => res.data))
  }

  linkitemlist(type: any, did: any, show_type: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/linkitems/' + did + '/' + type + '/' + show_type, option)
      .pipe(map(res => res.data))
  }
  linkitemlist1(type: any, did: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/linkitems/' + did + '/' + type, option)
      .pipe(map(res => res.data))
  }
  groups(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/sectiongroups', option)
      .pipe(map(res => res.data))
  }
  savehomesection(formdata: any): Observable<any> {
    return this.http.post<any>(this.productApiUrl + '/savehomesection/', formdata)
      .pipe(map(res => res.data))
  }
  savesection(formdata: any): Observable<any> {
    return this.http.post<any>(this.productApiUrl + '/savesection/', formdata)
      .pipe(map(res => res.data))
  }
  savesectionweb(formdata: any): Observable<any> {
    return this.http.post<any>(this.productApiUrl + '/savesection/web', formdata)
      .pipe(map(res => res.data))
  }
  savesectionitem(formdata: any): Observable<any> {
    return this.http.post<any>(this.productApiUrl + '/savesectionitem/', formdata)
      .pipe(map(res => res.data))
  }
  savesectionitemevent(formdata: any): Observable<any> {
    return this.http.post<any>(this.productApiUrl + '/savesectionitemevent/', formdata)
      .pipe(map(res => res.data))
  }
  savesectionitemtag(formdata: any): Observable<any> {
    return this.http.post<any>(this.productApiUrl + '/savesectionitemtag/', formdata)
      .pipe(map(res => res.data))
  }
  savesectionitemBlog(formdata: any): Observable<any> {
    return this.http.post<any>(this.productApiUrl + '/savesectionitemblog/', formdata)
      .pipe(map(res => res.data))
  }
  editsectionitem(formdata: any, selectedItemId: number): Observable<any> {
    return this.http.put<any>(this.productApiUrl + '/editsectionitem/' + selectedItemId, formdata)
      .pipe(map(res => res.data))
  }

  removeSection(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/removesection/' + id, option)
      .pipe(map(res => res.data))
  }

  getBanners(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/banners', option)
      .pipe(map(res => res.data))
  }

  removeBanner(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/removebanner/' + id, option)
      .pipe(map(res => res.data))
  }
  removeBlog(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/removeblog/' + id, option)
      .pipe(map(res => res.data))
  }

  allitems(): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/allitems', option)
      .pipe(map(res => res.data))
  }

  allgrpitems(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/allgrpitems/' + id, option)
      .pipe(map(res => res.data))
  }

  allsubgrpitems(id: any): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.productApiUrl + '/allsubgrpitems/' + id, option)
      .pipe(map(res => res.data))
  }

  search(term: string): Observable<any> {
    if (term === '') {
      return of([]);
    }
    return this.http.get<any>(this.TagApiUrl + '/search', { params: PARAMS.set('search', term) })
      .pipe(map(res => res['data']))
  }
  searchblog(term: string): Observable<any> {
    if (term === '') {
      return of([]);
    }

    return this.http.get<any>(this.BlogsApiUrl + '/search', { params: PARAMS.set('search', term) })
      .pipe(map(res => res['data']))
  }
  searchevent(term: string): Observable<any> {
    if (term === '') {
      return of([]);
    }
    return this.http.get<any>(this.EventsApiUrl + '/search', { params: PARAMS.set('search', term) })
      .pipe(map(res => res['data']))

  }
  savetags(formdata: any): Observable<any> {
    return this.http.put<any>(this.TagApiUrl + '/savetags', formdata)
      .pipe(map(res => res.data))
  }
  saveblogs(formdata: any): Observable<any> {
    return this.http.put<any>(this.TagApiUrl + '/saveblogs', formdata)
      .pipe(map(res => res.data))
  }

  getPagetags(type: string, uuid: string): Observable<any> {
    let option = this.env.httpOptionsparams;
    return this.http.get<any>(this.TagApiUrl + '/getpage/' + type + '/' + uuid, this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  getalltags(type: string, uuid: string): Observable<any> {
    let option = this.env.httpOptionsparams;
    return this.http.get<any>(this.TagApiUrl + '/list' , this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  getallTag(): Observable<any> {
    let option = this.env.httpOptionsparams;
    return this.http.get<any>(this.TagApiUrl + '/list', this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  getallEvent(): Observable<any> {
    let option = this.env.httpOptionsparams;
    return this.http.get<any>(this.EventsApiUrl + '/list', this.env.httpOptions)
      .pipe(map(res => res.data))
  }
  getBlogPage(): Observable<any> {
    let option = this.env.httpOptionsparams;
    return this.http.get<any>(this.BlogsApiUrl + '/getpage/all', this.env.httpOptions)
      .pipe(map(res => res.data))
  }

  getAllProductItem(params: {}): Observable<Itempaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Itempaginate>(this.itemApiUrl, option)
  }

  downloadreport(params: {}): Observable<any> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<any>(this.itemApiUrl + '/download', option);
  }

  getWarehouses(): Observable<Store[]> {
    return this.http.get<Store[]>(this.StoreApiUrl + '/getstores', this.env.httpOptions);
  }

}
