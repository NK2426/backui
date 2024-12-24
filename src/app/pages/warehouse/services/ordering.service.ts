import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { Ordering } from '../models/order';


const PARAMS = new HttpParams({
    fromObject: {}
});

@Injectable({
    providedIn: 'root'
})
export class OrderingService {

    customerOrderURL: string = `${environment.WAREHOUSE_BASE_URL}customerorders`;
    pickingOrderURL: string = `${environment.WAREHOUSE_BASE_URL}picking`;
    packingOrderURL: string = `${environment.WAREHOUSE_BASE_URL}packing`;

    constructor(private http: HttpClient, private env: EnvService) { }

    getCustomerOrdersForPicking(params: {}): Observable<Ordering.OrdersPaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<Ordering.OrdersPaginate>(this.pickingOrderURL, option);
    }
    getPickingOrderDetailById(orderUUID: string): Observable<Ordering.OrderDetailHttpResponse> {
        return this.http.get<Ordering.OrderDetailHttpResponse>(this.pickingOrderURL + `/view/${orderUUID}`);
    }
    // assign crate to an order
    assignCrate(crateUUID: string, orderUUID: string): Observable<Ordering.AssignCrateHttpResponse> {
        let data = { crateID: crateUUID };
        return this.http.put<Ordering.AssignCrateHttpResponse>(this.pickingOrderURL + `/assigncrate/${orderUUID}`, data, this.env.httpOptions);
    }
    // scan the item picked to verify the item
    pickItem(orderItemUUID: string, itemUUID: string) {
        let data = { itemID: itemUUID };
        return this.http.put<Ordering.GenericHttpResponse>(this.pickingOrderURL + `/itempick/${orderItemUUID}`, data, this.env.httpOptions);
    }
    // assign bill counter for the order
    assignOrderBillCounter(orderUUID: string, billCounterUUID: string) {
        let data = { billcounterID: billCounterUUID };
        return this.http.put<Ordering.GenericHttpResponse>(this.pickingOrderURL + `/assignbillcounter/${orderUUID}`, data, this.env.httpOptions);
    }
    // get orders list for packing
    getCustomerOrdersForPacking(params: {}): Observable<Ordering.OrdersPaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<Ordering.OrdersPaginate>(`${this.packingOrderURL}`, option);
    }
    getPackingOrderDetailById(orderUUID: string): Observable<Ordering.OrderDetailHttpResponse> {
        return this.http.get<Ordering.OrderDetailHttpResponse>(this.packingOrderURL + `/view/${orderUUID}`);
    }
    // validate assigned crate while packing
    validateCrateOnPacking(crateUUID: string): Observable<Ordering.OrderDetailHttpResponse> {
        return this.http.get<Ordering.OrderDetailHttpResponse>(`${this.packingOrderURL}/scancrate/${crateUUID}`);
    }

    validateItemOnPacking(orderUUID: string, orderitemUUID: string): Observable<Ordering.OrderItemHttpResponse> {
        let payload = { item_uuid: orderitemUUID };
        return this.http.put<Ordering.OrderItemHttpResponse>(`${this.packingOrderURL}/checkitem/${orderUUID}`, payload);
    }
    getCustomerOrderDetailById(orderUUID: string): Observable<Ordering.OrderDetailHttpResponse> {
        return this.http.get<Ordering.OrderDetailHttpResponse>(this.customerOrderURL + `/view/${orderUUID}`);
    }
    generateInvoice(orderUUID: string, orderitemUUID: string[]): Observable<Ordering.GenerateInvoiceHttpResponse> {
        let payload = { orderitems: orderitemUUID };
        return this.http.put<Ordering.GenerateInvoiceHttpResponse>(`${this.customerOrderURL}/generateinvoice/${orderUUID}`, payload);
    }

    directgenerateInvoice(orderUUID: string, orderitemUUID: string[]): Observable<Ordering.GenerateInvoiceHttpResponse> {
        let payload = { orderitems: orderitemUUID };
        return this.http.put<Ordering.GenerateInvoiceHttpResponse>(`${this.customerOrderURL}/directgenerateinvoice/${orderUUID}`, payload);
    }
}