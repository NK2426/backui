import { ADDRESS } from "./address";
import { ORDER } from "./order";

export namespace ORDERINVOICE {

    export interface Item {
        name?: string;
        path?: string;
    }

    export interface Invoiceorderitem {
        id?: number;
        uuid?: string;
        invoice_id?: number;
        invoice_uuid?: string;
        user_id?: number;
        product_id?: number;
        orderitem_uuid?: string;
        hsncode?: string;
        skuid?: string;
        item_uuid?: string;
        itemslist_uuid?: string;
        psid?: string;
        quantity?: number;
        mrp?: number;
        price?: number;
        subtotal?: number;
        discount?: number;
        discounttotal?: number;
        total?: number;
        ifigst?: number;
        ctax?: number;
        ctaxval?: number;
        stax?: number;
        staxval?: number;
        itax?: number;
        itaxval?: number;
        taxamount?: number;
        taxpercentage?: number;
        shiptax?: number;
        shippingamount?: number;
        grandtotal?: number;
        status?: string;
        item?: Item;
    }

    export interface OrderInvoiceDetails {
        id?: number;
        uuid?: string;
        user_id?: number;
        invoiceno?: string;
        orderID?: string;
        orderdatetime?: Date;
        invoicedate?: Date;
        shppingAddress?: string;
        billingAddress?: string;
        setting_id?: number;
        subtotalamount?: number;
        ifigst?: number;
        ctax?: number;
        ctaxval?: number;
        stax?: number;
        staxval?: number;
        itax?: number;
        itaxval?: number;
        taxamount?: number;
        totalamount?: number;
        shipctax?: number;
        shipctaxval?: number;
        shipstax?: number;
        shipstaxval?: number;
        shipitax?: number;
        shipitaxval?: number;
        shiptaxamount?: number;
        grandtotal?: number;
        awbnumber?: string;
        shipment?: string;
        status?: string;
        createdAt?: Date;
        updatedAt?: Date;
        invoiceorderitems?: Invoiceorderitem[];
        address?: ADDRESS.Address;
        order?: ORDER.Order;
        shipstatus?: string;
    }

    export interface TrackDetails {
        actual_weight?: string;
        awb_number?: string;
        city?: number;
        consignee?: string;
        current_location_code?: string;
        current_location_name?: string;
        customer?: string;
        delivery_date?: string;
        delivery_pod_signature?: string;
        destination?: string;
        expected_date?: string;
        last_update_datetime?: string;
        origin?: string;
        pickupdate?: string;
        pincode?: string;
        state?: string;
        status?: string;
        system_delivery_update?: string;
        tracking_status?: string;
        rts_shipment?: string;
        ref_awb?: string;
        lat?: string;
        long?: string;
        orderid?: string;
    }


    export interface OrderInvoice extends Partial<GenericHTTPResponse> {
        data?: OrderInvoiceDetails;
    }
    export interface GenericHTTPResponse {
        status?: number;
        message?: string;
        code?: number;
        datas?: any;
        data?: any;
    }

}

