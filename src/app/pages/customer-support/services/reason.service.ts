import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { REASONS } from '../models/reason';
import { EnvService } from './env.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReasonService {

    ReasonsApiUrl: string = `${environment.CUSTOMER_SUPPORT_BASE_URL}reason`;
    siteurl: string = `${environment.siteUrl}`;


    constructor(private http: HttpClient, private env: EnvService) { }

    getAllDepartment(): Observable<any> {
        return this.http.get<any>(this.ReasonsApiUrl + '/departments')
            .pipe(map(res => res));
    }
    getReasonList(params: {}): Observable<REASONS.ReasonsPaginated> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<REASONS.ReasonsPaginated>(this.ReasonsApiUrl + '/', option)
            .pipe(map(res => res));
    }

    getReasonByID(reasonID: any): Observable<REASONS.Reasons> {
        return this.http.get<REASONS.Reasons>(this.ReasonsApiUrl + '/' + reasonID, this.env.httpOptions)
            .pipe(map(res => res));
    }

    updateReason(reasonID: string, data: Partial<REASONS.Reason>): Observable<REASONS.Reason> {
        return this.http.put<REASONS.Reason>(this.ReasonsApiUrl + '/' + reasonID, data, this.env.httpOptions);
    }


    createReason(data: Partial<REASONS.Reason>): Observable<REASONS.Reasons> {
        return this.http.post<any>(this.ReasonsApiUrl + '/', data)
            .pipe(map(res => res))
    }

}
