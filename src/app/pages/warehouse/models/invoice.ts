import { Ordering } from "./order";
import { User } from "./purchaseorder";

export namespace INVOICE {

    export interface Item {
        name: string;
        path: string;
    }
    export  interface Warehouse{
        billingaddress:string,
        mobile:number
    }

    export interface Invoiceorderitem {
        id: number;
        uuid: string;
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
        invoiceno: string;
        checked: Boolean;
        awbnumber: string;
        orderitem: Ordering.Orderitem;
        user: Partial<User>;
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

    export interface InvoiceDetail {
        id: number;
        uuid: string;
        user_id: number;
        invoiceno: string;
        orderID: string;
        orderdatetime: Date;
        invoicedate: Date;
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
        status: string;
        createdAt: Date;
        updatedAt: Date;
        invoiceorderitems: Invoiceorderitem[];
        address: Address;
        awbnumber: string;
        shipstatus: string;
        shipment: string;
        order: Ordering.CustomerOrder,
        deliverycharge: number;
        dimentions: string;
        weight: number;
        warehouse:Warehouse;
        user:User
     
    }

    export interface User {
        name:string
    }
    export interface InvoicePaginate {
        datas: InvoiceDetail[]
        totalItems: number,
        totalPages: number,
        currentPage: number
        status: string | number;
        message: string;
    }


    export interface InvoiceHttpResponse extends GenericInvoiceHttpResponse {
        data: InvoiceDetail;
    }

    export interface GenericInvoiceHttpResponse {
        status: string | number;
        code: string;
        message: string;
        data: any;
    }

    export interface ReportsResponse extends GenericInvoiceHttpResponse {
        data: { filename: string };
    }

    

}

