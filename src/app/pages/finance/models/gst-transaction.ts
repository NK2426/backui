// Chart gst list ----------------
export class Root {
    message?: string
    data?: Gst[]
}

export class Gst {
    month?: string
    totalCtax?: string
    totalCtaxval?: string
    totalStax?: string
    totalStaxval?: string
    totalItax?: string
    totalItaxval?: string
}

// Datewise gst list ----------------
export interface Root {
    message?: string
    datas?: gstDate[]
    totalItems?: number
    totalPages?: number
    currentPage?: number
}

export class gstDate {
    ctax?: number
    ctaxval?: number
    stax?: number
    staxval?: number
    itax?: number
    itaxval?: number
    transactionid?: string
    invoiceItem?: InvoiceItem
}

export class InvoiceItem {
    id?: number
    invoice_id?: number
    invoice_uuid?: string
    product_id?: number
    hsncode?: string
    skuid?: string
}

