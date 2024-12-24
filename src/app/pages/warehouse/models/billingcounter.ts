export namespace BILLING_COUTNER {
    export interface BillingCounter {
        name: string;
        description?: string,
        id?: number;
        uuid?: string;
        status?: number;
    }


    export class Billingpaginate {
        datas?: BillingCounter[];
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
    }
}