import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Item } from '../models/item';
import { Supersale } from '../models/supersale';
import { Supersalespaginate } from '../models/supersales';

@Injectable({
    providedIn: 'root'
})
export class OfferService {

    OffersaleApiUrl: string = `${environment.CATALOG_BASE_URL}/offer`;

    constructor(private http: HttpClient, private env: EnvService) { }

    viewItems(id: any): Observable<any> {
        let option = this.env.httpOptions;
        return this.http.get<any>(this.OffersaleApiUrl + '/item/' + id, option)
            .pipe(map(res => res.data))
    }


    saveData(formdata: Supersale): Observable<Supersale> {
        return this.http.post<any>(this.OffersaleApiUrl + '/savefiledata', formdata)
            .pipe(map(res => res.data))
    }

    download(type: any, id: any, groups: any[]): Observable<any> {
        return this.http.get<any>(this.OffersaleApiUrl + '/download/' + type + '/' + id + '/' + groups, this.env.httpOptions);
    }

    getAllsupersales(params: {}): Observable<Supersalespaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<Supersalespaginate>(this.OffersaleApiUrl, option);
    }


    deleteItem(data: Item): Observable<Item> {
        return this.http.delete<Item>(this.OffersaleApiUrl + '/item/' + data.id);
    }

    import(formdata: any): Observable<any> {
        return this.http.post<any>(this.OffersaleApiUrl + '/import', formdata)
            .pipe(map(res => res))
    }

    excelToJson(formdata: any): Observable<any> {
        return this.http.post<any>(this.OffersaleApiUrl + '/getexceldata', formdata);
    }

    saveUpdatedDump(itemData: any): Observable<any> {
        return this.http.post<any>(this.OffersaleApiUrl + '/exceldatasave', itemData);
    }

}


