export namespace SCAN_MANIFEST_ORDER {
    export type MBO = MANIFEST_DETAIL[]

    export interface MANIFEST_DETAIL {
        uuid: string
        invoiceno: string
        orderID: string
        invoicedate: string
        awbnumber: string
        awbdate: any
        shiptype: string
        status: string
        createdAt: string
        modeofpayment: string
        orderdatetime: string
        invoiceorderitems: Invoiceorderitem[]
    }

    export interface Invoiceorderitem {
        invoice_uuid: string
        uuid: string
        orderitem_uuid: string
        skuid: string
        status: string
    }

    export interface AWB_DETAIL {
        awbnumber: number | string;
    }

}