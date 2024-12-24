import { ADDRESS } from "./address";
import { ORDERDETAIL } from "./order-detail";
import { Product } from './product';
import { USER } from "./user";

export namespace ORDER {
    export interface Order {
        id: number;
        uuid: string;
        user_id: number;
        orderID: string;
        crateID: string;
        deliverycharge: number;
        codcharge: number;
        discount: number;
        amount: number;
        status: string;
        ship_status: string;
        address_uuid: string;
        paymentStatus?: string;
        paymentmethod?: string;
        modeofpayment?: string;
        createdAt: string;
        deliverydate: string;
        billcounterID: string;
        user: USER.Customer;
        address: ADDRESS.Address;
        supercoins: number;
        specialcoins: number;
        orderitems?: ORDERDETAIL.Orderitem[];
        juspayUniqueID?: string;
    }

    export interface SkulevelCustomerOrder {
        createdAt: string;
        Uname: string;
        orderID: string;
        mobile: number;
        status: string;
        designid: string;
        skuid: string;
        Dname: string;
        Cname: string;
        SCname: string;
        Gname?: string;
        title?: string;
        poid?: string;
        mrp: number;
        costprice: number;
        price: number;
        discount: number;
        qty: number;
        stockqty: number;
        usedcoins: number;
        usedspecialcoins: number;
        taxamount: number;
        taxableamt: number;
        ctaxval: number;
        staxval: number;
        itaxval: number;
        amount: number;
    }

    export interface CustomerOrder {
        id: number;
        uuid: string;
        user_id: number;
        orderID: string;
        crateID: string;
        deliverycharge: number;
        codcharge: number;
        discount: number;
        amount: number;
        status: string;
        ship_status: string;
        address_uuid: string;
        paymentStatus?: string;
        paymentmethod?: string;
        modeofpayment?: string;
        createdAt: string;
        deliverydate: string;
        billcounterID: string;
        user: USER.Customer;
        address: Address;
        supercoins: number;
        specialcoins: number;
        orderitems?: Orderitem[];
        juspayUniqueID?: string;
    }

    export interface Orderitem {
        uuid: string;
        user_id: number;
        order_uuid: string;
        product_id: number;
        item_uuid: string;
        itemslist_uuid: string;
        qty: number;
        mrp: number;
        price: number;
        subtotal: number;
        discount: number;
        taxpercentage: number;
        taxtotal: number;
        amount: number;
        item: ItemDetail;
        itemslist: ItemList;
        status: string;
        department: Department;
        category: Category;
        subcategory: Subcategory;
        group: Group;
        earncoins: number;
        usedcoins: number;
        usedspecialcoins: number;
        deliverydate: string;
        packeddate: string;
        shippeddate: string;
        order: CustomerOrder;
        product: Product;
        reason: Reason;
        storehouse: Warehouse;
    }

    export interface Warehouse {
        name: string;
    }

    export interface Orderitemgrp {
        uuid: string;
        user_id: number;
        order_uuid: string;
        product_id: number;
        item_uuid: string;
        itemslist_uuid: string;
        qty: number;
        mrp: number;
        price: number;
        subtotal: number;
        discount: number;
        taxpercentage: number;
        taxtotal: number;
        amount: number;
        item: ItemDetail;
        itemslist: ItemList;
        status: string;
        department: Department;
        category: Category;
        subcategory: Subcategory;
        group: Group;
        earncoins: number;
        order: CustomerOrder;
        product: Product;
        orderitem: Orderitem;
    }

    /*export interface CancelOrderitem {
        uuid: string;
        order_uuid: string;
        qty: number;
        subtotal: number;
        item: ItemDetail;
        department: Department;
        category: Category;
        subcategory: Subcategory;
        group: Group;
        deliverydate: string;
        order: CustomerOrder;
        product: Product;
        reason: Reason;
    }*/

    export interface Refund {
        id: number;
        refundID: string;
        modifiedBy: number;
        orderID: string;
        orderitem_uuid: string;
        amount: number;
        status: string;
        juspayOrderID: string;
        juspaystatus: string;
        paymentStatus?: string;
        jsontext?: string;
        type?: string;
        createdAt: string;
        user: USER.Customer;

    }


    export interface RefundsPaginate {
        datas?: Refund[];
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
    }

    export interface OrdersPaginate {
        datas?: Order[];
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
    }

    export interface OrderItemsPaginate {
        datas?: Orderitem[];
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
    }

    export interface ItemDetail {
        name: string;
        path: string;
        product: Product;
        category: Category;
        department: Department;
        subcategory: Subcategory;
        group: Group;
    }
    export interface ItemList {
        id: number;
        sku: string;
        skuid: string;
        uuid: string;
        name: string;
        description: string;
        product_id: number;
        brand_id: number;
        group_id: number;
        mrp: number;
        price: number;
        quantity: number;
        discount: number;
        status: number;
    }
    export class Address {
        name?: string;
        address?: string;
        address2?: string;
        city?: string;
        state?: string;
        phone?: string;
        zipcode?: string;
        mobile?: string;
    }

    export interface Department {
        name: string;
    }

    export interface Category {
        name: string;
    }

    export interface Subcategory {
        name: string;
    }

    export interface Group {
        name: string;
    }

    export interface Reason {
        reason: string;
    }

}