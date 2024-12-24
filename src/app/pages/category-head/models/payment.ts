export namespace PAYMENT {

    export interface Paymentcycle {
        id?: number;
        type: string;
        paymentterm_id: number;
        days: number;
        percentage: number;
    }

    export interface Payments {
        id?: number;
        name: string;
        description: string;
        status: number | string;
     
    }

    export interface Payment {
        id?: number;
        name: string;
        description: string;
        status: number | string;
        paymentcycles: Paymentcycle[];
    }

    export interface PaymentPaginated extends GenericHttpResponse {
        status: number;
        message: string;
        datas: Payment[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }

    export interface PaymentHttpResponse extends GenericHttpResponse {
        data: Payment;
    }

    export interface PaymentCycleHttpResponse extends GenericHttpResponse {
        data: Paymentcycle;
    }

    export interface GenericHttpResponse {
        status: number | string;
        message: string;
        datas?: any;
        data?: any;
    }


}

