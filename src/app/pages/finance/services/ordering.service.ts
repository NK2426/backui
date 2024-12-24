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

    customerOrderURL: string = `${environment.FINANCE_BASE_URL}/customerorders`;


    constructor(private http: HttpClient, private env: EnvService) { }

    getCustomerOrdersForPicking(params: {}, orderStatus: string): Observable<Ordering.OrdersPaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        let customerOrderURL = this.customerOrderURL;
        if (orderStatus) {
            customerOrderURL = this.customerOrderURL + `/${orderStatus}`
        }
        return this.http.get<Ordering.OrdersPaginate>(customerOrderURL, option);
    }


    getCustomerOrderDetailById(orderUUID: string): Observable<Ordering.OrderDetailHttpResponse> {
        return this.http.get<Ordering.OrderDetailHttpResponse>(this.customerOrderURL + `/view/${orderUUID}`);
    }

    // assign crate to an order
    assignCrate(crateUUID: string, orderUUID: string): Observable<Ordering.AssignCrateHttpResponse> {
        let data = { crateID: crateUUID };
        return this.http.put<Ordering.AssignCrateHttpResponse>(this.customerOrderURL + `/assigncrate/${orderUUID}`, data, this.env.httpOptions);
    }

    // scan the item picked to verify the item
    pickItem(orderItemUUID: string, itemUUID: string) {
        let data = { itemID: itemUUID };
        return this.http.put<Ordering.GenericHttpResponse>(this.customerOrderURL + `/itempick/${orderItemUUID}`, data, this.env.httpOptions);
    }

    // assign bill counter for the order
    assignOrderBillCounter(orderUUID: string, billCounterUUID: string) {
        let data = { billcounterID: billCounterUUID };
        return this.http.put<Ordering.GenericHttpResponse>(this.customerOrderURL + `/assignbillcounter/${orderUUID}`, data, this.env.httpOptions);
    }

    // get orders list for packing
    getCustomerOrdersForPacking(params: {}): Observable<Ordering.OrdersPaginate> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<Ordering.OrdersPaginate>(`${this.customerOrderURL}/bills`, option);
    }

    // validate assigned crate while packing
    validateCrateOnPacking(crateUUID: string): Observable<Ordering.OrderDetailHttpResponse> {
        return this.http.get<Ordering.OrderDetailHttpResponse>(`${this.customerOrderURL}/scancrate/${crateUUID}`);
    }

    validateItemOnPacking(orderUUID: string, orderitemUUID: string): Observable<Ordering.OrderItemHttpResponse> {
        let payload = { item_uuid: orderitemUUID };
        return this.http.put<Ordering.OrderItemHttpResponse>(`${this.customerOrderURL}/checkitem/${orderUUID}`, payload);
    }


    getAllSalesReport(params: {}): Observable<Ordering.CustomerOrder[]> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<Ordering.CustomerOrder[]>(`${this.customerOrderURL}/salesreport`, option);
    }

    download(params: {}, orderStatus: string): Observable<any> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        let customerOrderURL = this.customerOrderURL;
        if (orderStatus) {
            customerOrderURL = this.customerOrderURL + `/${orderStatus}`
        }
        return this.http.get<any>(customerOrderURL + '/download', option);
    }


}
