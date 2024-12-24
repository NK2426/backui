import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { DEBIT_NOTES } from '../models/debit-notes';
import { DEBIT_NOTES_PO_LIST_UUID, DEBIT_NOTES_SCAN, DEBIT_NOTES_TABLE_LIST } from './debit-notes.mock';


const PARAMS = new HttpParams({
    fromObject: {}
});

@Injectable()
export class DebitNotesService {
    getDebitNote(uuid: string) {
      throw new Error('Method not implemented.');
    }
    approval(formData: {}) {
      throw new Error('Method not implemented.');
    }
    download(uuid: string) {
      throw new Error('Method not implemented.');
    }

    DebitNotesApiUrl: string = `${environment.WAREHOUSE_BASE_URL}debitnotes`;
  baseurl: string;

    constructor(private http: HttpClient, private env: EnvService) { }

    getPOIDList(params: {}, vendoruid: string): Observable<DEBIT_NOTES.POIDHttpResponse> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return of(DEBIT_NOTES_PO_LIST_UUID)
        //return this.http.get<DEBIT_NOTES.POIDHttpResponse>(this.DebitNotesApiUrl + `/poslist/${vendoruid}`, option);
    }

    getDebitNotes(params: {}): Observable<DEBIT_NOTES.DebitNotesPaginated> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return of(DEBIT_NOTES_TABLE_LIST)
        //return this.http.get<DEBIT_NOTES.DebitNotesPaginated>(this.DebitNotesApiUrl, option);
    }

    getDebitNotesPSIDList(params: {}, poid: number): Observable<DEBIT_NOTES.ReturnToVendorHttpResponse> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return of(DEBIT_NOTES_SCAN)
        //return this.http.get<DEBIT_NOTES.ReturnToVendorHttpResponse>(this.DebitNotesApiUrl + `/psidlist/${poid}`, option);
    }

    saveDebitNote(data: any): Observable<any> {
        //console.log(JSON.stringify(data));
        return this.http.post<any>(this.DebitNotesApiUrl, data, this.env.httpOptions);
    }

    updateDebitNote(data: any): Observable<any> {
        return this.http.put<any>(this.DebitNotesApiUrl + '/' + data.uuid, data, this.env.httpOptions);
    }

    deleteDebitNote(uuid: string): Observable<any> {
        return this.http.delete<any>(this.DebitNotesApiUrl + '/' + uuid);
    }



}
