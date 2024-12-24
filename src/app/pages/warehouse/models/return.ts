import { Ordering } from "./order";
import { User } from "./purchaseorder";

export namespace RETURN {
    export interface Item {
        name: string;
        path: string;
    }

    export interface Address {
        id: number;
        uuid: string;
        user_id: number;
        name: string;
        mobile: string;
        mobile2: string;
        address: string;
        email: string;
        type: string;
        address2: string;
        city: string;
        state: string;
        zipcode: string;
        landmark: string;
        houseno: string;
        isdefault: number;
        status: number;
    }

    export interface Return {
        id: number;
        uuid: string;
        user_id: number;
        orderID: string;
        invoiceno: string;
        order_uuid: string;
        orderitem_uuid: string;
        psid: string;
        address_uuid: string;
        comments: string;
        images: string;
        ship_status: string;
        status: string;
        orderitem: Partial<Ordering.Orderitem>;
        returnitems: Returnitem[];
        address: Address;
        user: User;
    }

    export interface Returninvoice {
        id: number;
        uuid: string;
        return_uuid: string;
        user_id: number;
        orderID: string;
        invoiceno: string;
        orderdatetime: string;
        orderitem_uuid: string;
        returndate: string;
        shppingAddress: string;
        billingAddress: string;
        setting_id: number;
        subtotalamount: number;
        ifigst: number;
        ctax: number;
        ctaxval: number;
        stax: number;
        staxval: number;
        itax: number;
        itaxval: number;
        taxamount: number;
        totalamount: number;
        shipctax: number;
        shipctaxval: number;
        shipstax: number;
        shipstaxval: number;
        shipitax: number;
        shipitaxval: number;
        shiptaxamount: number;
        grandtotal: number;
        createdAt: Date;
        updatedAt: Date;
        returninvoiceitems: Returninvoiceitem[];
        awbnumber: string;
        shipstatus: string;
        shipment: string;
        //order: Ordering.CustomerOrder,
        deliverycharge: number;
        comments: string;
        images: string;
        ship_status: string;
        status: string;
        //orderitem: Partial<Ordering.Orderitem>;
        //returnitems: Returnitem[];
        address: Address;
        user: User;
        invoicedate: string;
    }

    export interface Returninvoiceitem {
        id: number;
        uuid: string;
        return_uuid: string;
        invoice_id: number;
        invoice_uuid: string;
        user_id: number;
        product_id: number;
        orderitem_uuid: string;
        hsncode: string;
        skuid: string;
        item_uuid: string;
        itemslist_uuid: string;
        psid: string;
        quantity: number;
        mrp: number;
        price: number;
        subtotal: number;
        discount: number;
        discounttotal: number;
        total: number;
        ifigst: number;
        ctax: number;
        ctaxval: number;
        stax: number;
        staxval: number;
        itax: number;
        itaxval: number;
        taxamount: number;
        taxpercentage: number;
        shiptax: number;
        shippingamount: number;
        grandtotal: number;
        status: string;
        item: Item;
        itemslist: ItemlistDetail;
        invoiceno: string;
        checked: Boolean;
        ship_status: string;
        returnitem: Returnitem;
    }

    export interface Returnitem {
        uuid: string;
        user_id: number;
        order_uuid: string;
        product_id: number;
        orderitem_uuid: string;
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
        orderitem: Partial<Ordering.Orderitem>;
        checked: Boolean;
        type: string;
        reason: Reason;
        ship_status:string
    }

    export interface Reason {
        reason: string;
    }

    export interface ItemDetail {
        name: string;
        path: string;
    }

    export interface ItemlistDetail {
        description: string;
        skuid: string;
    }

    export interface Name {
        name: String;
    }

    export interface ReturnHttpResponse extends GenericHttpResponse {
        data: Return;
    }

    export interface ReturnPaginate {
        datas?: Partial<Return>[];
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
    }

    export interface ReturninvoiceHttpResponse extends GenericHttpResponse {
        data: Returninvoice;
    }

    export interface ReturninvoicePaginate {
        datas?: Partial<Returninvoice>[];
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
    }

    export interface GenericHttpResponse {
        message: string;
        status: string;
        code?: string | number;
        data: any;
    }

}

