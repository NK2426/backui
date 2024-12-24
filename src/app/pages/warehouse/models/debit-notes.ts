import { Group } from "./inventory"
import { Product } from "./product"
import { Purchaseorder, User } from "./purchaseorder"
import { Shelfing } from "./shelfing"

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
    }

    export interface POIDHttpResponse extends DebitNotesHttpResponse {
        data: POID[];
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
        createdBy: number
        modifiedBy: number
        status: number
        createdAt: string
        updatedAt: string
        purchaseorder: Partial<Purchaseorder>
        user: Partial<User>
    }


}