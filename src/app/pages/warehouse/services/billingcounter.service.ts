import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvService } from 'src/app/_helpers/env.service';

import { environment } from 'src/environments/environment';
import { BILLING_COUTNER } from '../models/billingcounter';
import { Packages } from '../models/packages';
import { Packagetypes } from '../models/packagetypes';

const PARAMS = new HttpParams({
    fromObject: {}
});

@Injectable({
    providedIn: 'root'
})
export class BillingCounterService {

    Billing_API_URL: string = `${environment.WAREHOUSE_BASE_URL}billcounters`;

    constructor(private http: HttpClient, private env: EnvService) { }

    getAllBill(params: {}): Observable<BILLING_COUTNER.Billingpaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<BILLING_COUTNER.Billingpaginate>(this.Billing_API_URL, option);
    }

    create(data: Packages): Observable<any> {
        //console.log(JSON.stringify(data));
        return this.http.post<BILLING_COUTNER.BillingCounter>(this.Billing_API_URL, data, this.env.httpOptions);
    }
    update(data: Packages): Observable<any> {
        return this.http.put<BILLING_COUTNER.BillingCounter>(this.Billing_API_URL + '/' + data.uuid, data, this.env.httpOptions);
    }
    delete(data: Packages): Observable<BILLING_COUTNER.BillingCounter> {
        return this.http.delete<BILLING_COUTNER.BillingCounter>(this.Billing_API_URL + '/' + data.uuid);
    }


    search(term: string): Observable<any> {
        if (term === '') {
            return of([]);
        }
        return this.http.get<any>(this.Billing_API_URL + '/search', { params: PARAMS.set('search', term) })
            .pipe(map(res => res['data']))
    }

    savetype(data: Packagetypes): Observable<any> {
        return this.http.post<any>(this.Billing_API_URL + '/savetype', data, this.env.httpOptions).pipe(map(res => res.data));
    }


}
