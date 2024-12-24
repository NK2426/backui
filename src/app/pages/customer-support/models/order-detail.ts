import { ADDRESS } from "./address";
import { ORDERINVOICE } from "./order-invoice";
import { REASONS } from "./reason";

export namespace ORDERDETAIL {
    export interface Item {
        name: string;
        path: string;
        itemslist: Itemslist;
    }

    export interface Itemslist {
        product_id: number;
        sku: string;
        description: string;
        skuid: string;
    }

    export interface Orderitem {
        uuid: string;
        user_id: number;
        order_uuid: string;
        product_id: number;
        item_uuid: string;
        itemslist_uuid: string;
        qty: number;
        price: number;
        subtotal: number;
        discount: number;
        psid: string;
        taxpercentage: number;
        taxtotal: number;
        amount: number;
        status: string;
        item: Item;
        itemslist: Itemslist;
        storehouse: Warehouse;
    }

    export interface Warehouse {
        name: string;
    }

    export interface OrderDetails {
        id: number;
        uuid: string;
        user_id: number;
        orderID: string;
        deliverycharge: number;
        discount: number;
        amount: number;
        status: string;
        crateID: string;
        billcounterID: string;
        ship_status: string;
        paymentStatus: string;
        modeofpayment: string;
        paymentmethod: string;
        createdAt: Date;
        address_uuid: string;
        orderitems: Orderitem[];
        returnitems: Returnitem[];
        invoices: ORDERINVOICE.OrderInvoiceDetails[];
        address: ADDRESS.Address;
        refunds: ORDERINVOICE.RefundDetails[];
    }
    export interface Returnitem {
        uuid: string;
        user_id: number;
        order_uuid: string;
        orderitem_uuid: string;
        product_id: number;
        item_uuid: string;
        itemslist_uuid: string;
        status: string;
        item: Item;
        itemslist: Itemslist;
        reason_id: number;
        reason: REASONS.Reason;
        comments: string;
        images: string;
        orderitem: Orderitem;
    }

    export interface OrderDetail extends Partial<GenericHTTPResponse> {
        data: OrderDetails;
    }

    export interface GenericHTTPResponse {
        status: number;
        message: string;
        code: number;
        datas: any;
        data: any;
    }
}
