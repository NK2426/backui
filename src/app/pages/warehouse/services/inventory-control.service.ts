import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { INVENTORY_CONTROL } from '../models/inventory-control';


@Injectable({
    providedIn: 'root'
})
export class InventoryControlService {

    InventoryControlApiUrl: string = `${environment.WAREHOUSE_BASE_URL}inventory`;
    siteurl: string = `${environment.WAREHOUSE_SITE_URL}`;


    constructor(private http: HttpClient, private env: EnvService) { }


    getInventoryStocks(params: {}): Observable<INVENTORY_CONTROL.StocksHttpResponse> {
        let option = this.env.httpOptionsparams;
        option['params'] = params;
        return this.http.get<INVENTORY_CONTROL.StocksHttpResponse>(this.InventoryControlApiUrl + '/stocks', option)
    }


}
