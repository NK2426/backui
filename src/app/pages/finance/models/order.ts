import { CRATEMANAGEMENT } from "./crate";
import { Address, User } from "./purchaseorder";

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
        paymentStatus?: string;
        paymentmethod?: string;
        modeofpayment?: string;
        createdAt: string;
        billcounterID: string;
        user: User;
        address: Address;
        orderitems?: Orderitem[];
    }


    export interface OrdersPaginate {
        datas?: CustomerOrder[];
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
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
        taxpercentage: number;
        taxtotal: number;
        amount: number;
        item: ItemDetail;
        status: string;
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

    export interface ItemDetail {
        name: string;
        path: string;
    }

    export interface GenericHttpResponse {
        message: string;
        status: string;
        code: string | number;
        data: any;
    }

}



