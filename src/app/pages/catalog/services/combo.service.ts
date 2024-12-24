import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
//import { Categories } from '../models/categories';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { BULKORDER } from '../models/combo';

const PARAMS = new HttpParams({
  fromObject: {}
});

@Injectable({
  providedIn: 'root'
})
export class ComboService {
  ComboAPIUrl: string = `${environment.CATALOG_BASE_URL}/combo`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getComboList(params: {}): Observable<BULKORDER.ComboPaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<BULKORDER.ComboPaginate>(this.ComboAPIUrl, option);
  }

  getComboImageList(itemslist_uuid: string): Observable<BULKORDER.ComboImageHttpResponse> {
    let option = this.env.httpOptionsparams;
    return this.http.get<BULKORDER.ComboImageHttpResponse>(this.ComboAPIUrl + '/imagelist/' + itemslist_uuid, option);
  }

  getCombo(id: number): Observable<BULKORDER.ComboHttpResponse> {
    let option = this.env.httpOptionsparams;
    return this.http.get<BULKORDER.ComboHttpResponse>(this.ComboAPIUrl + '/view/' + id, option);
  }

  // Create COMBO
  createCombo(formdata: BULKORDER.Combo): Observable<BULKORDER.ComboHttpResponse> {
    return this.http.post<BULKORDER.ComboHttpResponse>(this.ComboAPIUrl + '/savecombo', formdata);
  }

  publishCombo(comboID: string | number) {
    return this.http.post<BULKORDER.ComboHttpResponse>(this.ComboAPIUrl + '/publishcombo/' + comboID, {});
  }

  // Create Combo Set for Combo
  createComboSet(formdata: BULKORDER.Combo): Observable<BULKORDER.ComboSetHttpResponse> {
    return this.http.post<BULKORDER.ComboSetHttpResponse>(this.ComboAPIUrl + '/savecomboset', formdata);
  }

  saveComboSetItem(formdata: BULKORDER.Combo): Observable<BULKORDER.ComboHttpResponse> {
    return this.http.post<BULKORDER.ComboHttpResponse>(this.ComboAPIUrl + '/savecomboitem', formdata);
  }

  publishComboSet(comboSetId: string | number) {
    return this.http.post<BULKORDER.ComboHttpResponse>(this.ComboAPIUrl + '/publishcomboset/' + comboSetId, {});
  }


  unpublishComboSet(comboSetId: string | number) {
    return this.http.post<BULKORDER.ComboHttpResponse>(this.ComboAPIUrl + '/unpublishcomboset/' + comboSetId, {});
  }


  deleteComboSetItem(itemId: number): Observable<BULKORDER.ComboHttpResponse> {
    return this.http.delete<BULKORDER.ComboHttpResponse>(this.ComboAPIUrl + '/item/' + itemId);
  }

  savetoGallery(uuid: any, formdata: any): Observable<any> {
    return this.http.put<any>(this.ComboAPIUrl + '/gallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }


  savedefaultimage(uuid: any, formdata: any): Observable<any> {
    return this.http.put<any>(this.ComboAPIUrl + '/singlegallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }

  saveitemimages(uuid: any, formdata: any): Observable<any> {
    return this.http.put<any>(this.ComboAPIUrl + '/itemgallery/' + uuid, formdata)
      .pipe(map(res => res.data))
  }

  productsearch(term: string): Observable<any> {
    if (term === '') {
      return of([]);
    }
    return this.http.get<any>(this.ComboAPIUrl + '/productsearch', { params: PARAMS.set('search', term) })
      .pipe(map(res => res['data']))
  }

  getItemlist(pid: number): Observable<any> {
    let option = this.env.httpOptions;
    return this.http.get<any>(this.ComboAPIUrl + '/itemlist/' + pid, option)
      .pipe(map(res => res.data))
  }

  // DELETE
  deleteCombo(comboID: number): Observable<any> {
    return this.http.delete<any>(this.ComboAPIUrl + '/' + comboID);
  }

}
