import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';

import { PAYMENT } from '../models/payment';

const PARAMS = new HttpParams({
    fromObject: {}
});

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    Payment_API_URL: string = `${environment.FINANCE_BASE_URL}/paymentterms`;

    constructor(private http: HttpClient, private env: EnvService) { }

    getPaymentList(params: {}): Observable<PAYMENT.PaymentPaginated> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<PAYMENT.PaymentPaginated>(this.Payment_API_URL, option);
    }

    // dont have to pass payment - id props while creating
    createPaymentTerm(data: Partial<PAYMENT.Payment>): Observable<PAYMENT.Payment> {
        return this.http.post<PAYMENT.Payment>(this.Payment_API_URL, data, this.env.httpOptions);
    }

    // need to pass payment - id props while updating
    updatePaymentTerm(paymentTermId: number, data: Partial<PAYMENT.Payment>): Observable<PAYMENT.Payment> {
        return this.http.put<PAYMENT.Payment>(this.Payment_API_URL + '/' + paymentTermId, data, this.env.httpOptions);
    }

    // id refers to payment term id
    deletePaymentTerm(data: Partial<PAYMENT.Payment>): Observable<PAYMENT.Payment> {
        return this.http.delete<PAYMENT.Payment>(this.Payment_API_URL + '/' + data.id);
    }


    // no need to pass payment cycle - id as body props while creating ( PUT verbose only - dont change)
    createPaymentCycle(paymentTermId: number, data: Partial<PAYMENT.Paymentcycle>): Observable<PAYMENT.PaymentCycleHttpResponse> {
        return this.http.put<PAYMENT.PaymentCycleHttpResponse>(this.Payment_API_URL + '/' + paymentTermId + '/paymentcycle', data, this.env.httpOptions);
    }

    //  need to pass payment cycle - id as body props while creating 
    updatePaymentCycle(paymentTermId: number, data: Partial<PAYMENT.Paymentcycle>): Observable<any> {
        return this.http.put<any>(this.Payment_API_URL + '/' + paymentTermId + '/paymentcycle', data, this.env.httpOptions);
    }

    deletePaymentCycle(paymentCycleId: number): Observable<PAYMENT.PaymentCycleHttpResponse> {
        return this.http.delete<PAYMENT.PaymentCycleHttpResponse>(this.Payment_API_URL + '/paymentcycle/' + paymentCycleId);
    }



}
