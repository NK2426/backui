import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { CRATEMANAGEMENT } from '../models/crate';
import { Packagetypes } from '../models/packagetypes';

const PARAMS = new HttpParams({
    fromObject: {}
});

@Injectable({
    providedIn: 'root'
})
export class CrateService {

    CrateApiUrl: string = `${environment.WAREHOUSE_BASE_URL}crates`;

    constructor(private http: HttpClient, private env: EnvService) { }

    getCrate(params: {}): Observable<CRATEMANAGEMENT.Cratepaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<CRATEMANAGEMENT.Cratepaginate>(this.CrateApiUrl, option);
    }

    create(data: CRATEMANAGEMENT.Crate): Observable<any> {
        //console.log(JSON.stringify(data));
        return this.http.post<CRATEMANAGEMENT.Crate>(this.CrateApiUrl, data, this.env.httpOptions);
    }

    update(data: CRATEMANAGEMENT.Crate): Observable<any> {
        return this.http.put<CRATEMANAGEMENT.Crate>(this.CrateApiUrl + '/' + data.uuid, data, this.env.httpOptions);
    }

    delete(data: CRATEMANAGEMENT.Crate): Observable<CRATEMANAGEMENT.Crate> {
        return this.http.delete<CRATEMANAGEMENT.Crate>(this.CrateApiUrl + '/' + data.uuid);
    }


    search(term: string): Observable<any> {
        if (term === '') {
            return of([]);
        }
        return this.http.get<any>(this.CrateApiUrl + '/search', { params: PARAMS.set('search', term) })
            .pipe(map(res => res['data']))
    }

    savetype(data: Packagetypes): Observable<any> {
        return this.http.post<any>(this.CrateApiUrl + '/savetype', data, this.env.httpOptions).pipe(map(res => res.data));
    }


}
