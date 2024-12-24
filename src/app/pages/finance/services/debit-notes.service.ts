import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { DEBIT_NOTES } from '../models/debit-notes';


const PARAMS = new HttpParams({
    fromObject: {}
});

@Injectable()
export class DebitNotesService {

    DebitNotesApiUrl: string = `${environment.FINANCE_BASE_URL}/debitnotes`;

    constructor(private http: HttpClient, private env: EnvService) { }

    getPOIDList(params: {}, vendoruid: string): Observable<DEBIT_NOTES.POIDHttpResponse> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        //return of(DEBIT_NOTES_PO_LIST_UUID)
        return this.http.get<DEBIT_NOTES.POIDHttpResponse>(this.DebitNotesApiUrl + `/polist/${vendoruid}`, option);
    }

    getDebitNotes(params: {}): Observable<DEBIT_NOTES.DebitNotesPaginated> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        //return of(DEBIT_NOTES_TABLE_LIST)
        return this.http.get<DEBIT_NOTES.DebitNotesPaginated>(this.DebitNotesApiUrl, option);
    }

    getDebitNote(uuid: string): Observable<DEBIT_NOTES.DebitNotesHttpResponse> {
        //return of(DEBIT_NOTES_TABLE_LIST)
        return this.http.get<DEBIT_NOTES.DebitNotesHttpResponse>(this.DebitNotesApiUrl + '/' + uuid, this.env.httpOptions);
    }


    getDebitNotesPSIDList(params: {}, poid: number): Observable<DEBIT_NOTES.ReturnToVendorHttpResponse> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        //return of(DEBIT_NOTES_SCAN)
        return this.http.get<DEBIT_NOTES.ReturnToVendorHttpResponse>(this.DebitNotesApiUrl + `/psidlist/${poid}`, option);
    }

    approval(data: any): Observable<any> {
        return this.http.put<any>(this.DebitNotesApiUrl + '/approval/' + data?.uuid, data, this.env.httpOptions);
    }

    download(id: any): Observable<any> {
        return this.http.get<any>(this.DebitNotesApiUrl + '/pdf/' + id, this.env.httpOptions);
    }

}
