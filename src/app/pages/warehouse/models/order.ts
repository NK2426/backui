import { CRATEMANAGEMENT } from "./crate";

export namespace Ordering {

    export interface CustomerOrder {
        id: number;
        uuid: string;
        user_id: number;
        orderID: string;
        crateID: string;
        deliverycharge: number;
        discount: number;
        amount: number;
        status: string;
        ship_status: string;
        address_uuid: string;
        createdAt: string;
        billcounterID: string;
        orderitems?: Orderitem[];
        modeofpayment: string;
        paymentmethod: string;
        paymentStatus:string;
        ordertype:string;
        
    }


    export interface OrdersPaginate {
        datas?: CustomerOrder[];
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
    }

    export interface Name {
        name: String;
    }
    export interface Orderitem {
        uuid: string;
        user_id: number;
        order_uuid: string;
        product_id: number;
        item_uuid: string;
        itemslist_uuid: string;
        shelf?: string;
        psid: string;
        qty: number;
        price: number;
        subtotal: number;
        discount: number;
        taxpercentage: number;
        taxtotal: number;
        amount: number;
        item: ItemDetail;
        itemslist: ItemlistDetail;
        status: string;
        name?: Name;
        isSelected:boolean;
    }

    export interface Invoice {
        invoice: string;
        amount: number;
        discount: number
    }
    export interface OrderDetailHttpResponse extends GenericHttpResponse {
        data: CustomerOrder;
    }

    export interface OrderItemHttpResponse extends GenericHttpResponse {
        data: Orderitem;
    }

    export interface AssignCrateHttpResponse extends GenericHttpResponse {
        data: CRATEMANAGEMENT.Crate;
    }


    export interface AssignOrderBillCounterHttpResponse extends GenericHttpResponse {
        data: CRATEMANAGEMENT.Crate;
    }

    export interface GenerateInvoiceHttpResponse extends GenericHttpResponse {
        data: Invoice;
    }

    export interface ItemDetail {
        name: string;
        path: string;
    }

    export interface ItemlistDetail {
        description: string;
        skuid: string;
    }

    export interface GenericHttpResponse {
        message: string;
        status: string;
        code?: string | number;
        data: any;
    }

}



