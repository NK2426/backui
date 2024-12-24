import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Subcategories, Subcategoriespaginate } from '../models/subcategories';


@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {

  SubcategoriesApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}subcategories`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Subcategoriespaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Subcategoriespaginate>(this.SubcategoriesApiUrl, option);
  }

  create(data: Subcategories): Observable<Subcategories> {
    //console.log(JSON.stringify(data));
    return this.http.post<Subcategories>(this.SubcategoriesApiUrl, data, this.env.httpOptions);
  }
  update(data: Subcategories): Observable<Subcategories> {
    return this.http.put<Subcategories>(this.SubcategoriesApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }
  delete(data: Subcategories): Observable<any> {
    return this.http.delete<Subcategories>(this.SubcategoriesApiUrl + '/' + data.uuid);
  }

  findcatassoc(id: any): Observable<any> {
    return this.http.get<Subcategories>(this.SubcategoriesApiUrl + '/findCat/' + id, this.env.httpOptions);
  }

  getParams(): Observable<Subcategories> {
    //console.log(this.http.get<Subcategories>(this.SubcategoriesApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Subcategories>(this.SubcategoriesApiUrl + '/list', this.env.httpOptions);
  }

  getParambyids(data: any): Observable<Subcategories> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Subcategories>(this.SubcategoriesApiUrl + '/paramids', option);
  }
}
