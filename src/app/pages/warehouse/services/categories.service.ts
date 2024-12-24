import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Categories, Categoriespaginate } from '../models/categories';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  CategoriesApiUrl: string = `${environment.WAREHOUSE_BASE_URL}categories`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getAll(params: {}): Observable<Categoriespaginate> {
    let option = this.env.httpOptionsparams;
    option['params'] = params;
    return this.http.get<Categoriespaginate>(this.CategoriesApiUrl, option);
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

  find(uuid: any): Observable<any> {
    return this.http.get<any>(this.CategoriesApiUrl + '/' + uuid, this.env.httpOptions)
      .pipe(map(res => res.data));
  }

  updateimg(formdata: Categories): Observable<Categories> {
    return this.http.post<any>(this.CategoriesApiUrl + '/saveimgdata', formdata)
      .pipe(map(res => res.data))
  }

}
