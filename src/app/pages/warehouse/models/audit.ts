import { INVENTORY_CONTROL } from "./inventory-control";
import { Shelfing } from "./shelfing";
export namespace AUDITING {

    export interface Location {
        numb: number,
        psid: string,
        status: string,
        count: number,
        inventory: INVENTORY_CONTROL.Stock;
        shelfing: Shelfing;
    }

    export interface Auditreport {
        id: number,
        type: string,
        skuid: string,
        stockqty: number,
        excessqty: number,
        shortageqty: number,
        createdAt: string,
        updatedAt: string
    }


    export interface Inventory {
        numb: number,
        psid: string,
        location: string,
        status: string,
        inventory: INVENTORY_CONTROL.Stock;
        shelfing: Shelfing;
        skuid: string
    }

    export interface GenerateAuditLocationtHttpResponse extends GenericHttpResponse {
        data: Location[];
    }

    export interface GenerateAuditInventoryHttpResponse extends GenericHttpResponse {
        data: Inventory[];
    }


    export interface GenericHttpResponse {
        message: string;
        status: string;
        code?: string | number;
        data: any;
    }

    export class Auditpaginate {
        datas?: Auditreport[];
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
    }


}