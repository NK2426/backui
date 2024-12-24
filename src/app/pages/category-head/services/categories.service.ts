import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Categories, Categoriespaginate } from '../models/categories';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  CategoriesApiUrl: string = `${environment.CATEGORY_HEAD_BASE_URL}categories`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Categoriespaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Categoriespaginate>(this.CategoriesApiUrl, option);
  }

  create(data: Categories): Observable<Categories> {
    //console.log(JSON.stringify(data));
    return this.http.post<Categories>(this.CategoriesApiUrl, data, this.env.httpOptions);
  }
  update(data: Categories): Observable<Categories> {
    return this.http.put<Categories>(this.CategoriesApiUrl + '/' + data.uuid, data, this.env.httpOptions);
  }
  delete(data: Categories): Observable<any> {
    return this.http.delete<Categories>(this.CategoriesApiUrl + '/' + data.uuid);
  }

  getParams(): Observable<Categories> {
    //console.log(this.http.get<Categories>(this.CategoriesApiUrl + '/list', this.env.httpOptions));
    return this.http.get<Categories>(this.CategoriesApiUrl + '/list', this.env.httpOptions);
  }

  getParambyids(data: any): Observable<Categories> {
    let option = this.env.httpOptionsparams;
    option['params'] = data;
    return this.http.get<Categories>(this.CategoriesApiUrl + '/paramids', option);
  }

  findcatassoc(id: any): Observable<any> {
    return this.http.get<Categories>(this.CategoriesApiUrl + '/findCat/' + id, this.env.httpOptions);
  }
}
