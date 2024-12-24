export class PaymentReport {
    message?: string
    vendorDue?: number
    data?: PaymentReportDetail[]
    totalItems?: number
    totalPages?: number
    currentPage?: number
}

export class PaymentReportDetail {
    purchaseOrderId?: string
    totalPurchaseAmount?: number
    totalPaid?: number
    isFullyPaid?: boolean
    balanceAmountDue?: number
    balanceCyclesLeft?: number
    paymentStatus?: PaymentStatu[]
}
// export class PaymentReport {
//     message??: string
//     vendorDue??: number
//     data??: PaymentReportDetail[]
// }

// export class PaymentReportDetail {
//     purchaseOrderId? string
//     totalPurchaseAmount? number
//     totalPaid?: number
//     isFullyPaid?: boolean
//     balanceAmountDue?: number
//     balanceCyclesLeft?: number
//     paymentStatus?: PaymentStatu[]
// }

export class PaymentStatu {
    cycle?: Cycle
    expectedAmount?: number
    actualAmount?: number
    isPaid?: boolean
    expected_Date?: string
    poDate: string
}

export class Cycle {
    id?: number
    type?: string
    paymentterm_id?: number
    days?: number
    percentage?: number
}

export class VendorName {
    message?: string
    overallBalanceAmountDue?: number
    vendors?: Vendor[]
}

export class Vendor {
    uid?: number
    uuid?: string
    name?: string
}

