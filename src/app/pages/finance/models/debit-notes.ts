import { Group } from "./inventory"
import { Inwarditem, Product } from "./product"
import { Purchaseorder, User } from "./purchaseorder"

export namespace DEBIT_NOTES {
    export interface ReturnToVendorHttpResponse extends DebitNotesHttpResponse {
        data: ReturnToVendorItem[]
    }

    export interface ReturnToVendorItem {
        psid: string
        inventory: Inventory
        shelfing: Partial<Shelfing>
        debitnote: number
        status_temp?: string
    }

    export interface Inventory {
        skuid: string
        group: Partial<Group>
        product: Product
    }

    export interface DebitNotesHttpResponse {
        status: number
        message: string
        data: {}
    }

    export interface POIDHttpResponse extends DebitNotesHttpResponse {
        data: POID[];
    }

    export interface Shelfing {
        id: number
        shelfID: string
    }


    export interface POID {
        id: number
        uuid: string
    }

    export interface DebitNotesPaginated extends DebitNotesHttpResponse {
        datas: DebitNotesItem[]
        totalItems: number
        totalPages: number
        currentPage: number
    }

    export interface DebitNotesItem {
        id: number
        uuid: string
        vendor_id: number
        po_id: number
        remarks: string
        noofitems: number
        tax: number
        totaltax: number
        dnvalue: number
        createdBy: number
        modifiedBy: number
        status: number
        createdAt: string
        updatedAt: string
        purchaseorder: Partial<Purchaseorder>
        user: Partial<User>
        inwarditems: Inwarditem[];
    }

    export interface Stock {
        id: number;
        sku: string;
        skuid: string;
        uuid: string;
        department_id: number;
        category_id: number;
        subcategory_id: number;
        group_id: number;
        brand_id: number;
        product_id: number;
        name: string;
        description: string;
        receivedqty: number;
        stockqty: number;
        quantity: number;
        shippedqty: number;
        returnqty: number;
        damageqty: number;
        disputeqty: number;
        group: Partial<Group>;
        product: Partial<Product>;
    }



}