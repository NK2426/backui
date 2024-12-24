export class Root {
    message?: string
    data?: FinanceCat[]
}

export class FinanceCat {
    id?: number
    uuid?: string
    name?: string
    type?: string
    description?: string
    status?: number
    createdBy?: number
    createdAt?: string
    modifiedBy?: number
    updateAt?: string
}

export interface Root {
    message?: string
    datas?: FinanceList[]
    totalItems?: number
    totalPages?: number
    currentPage?: number
}

// export class FinanceList {
//     financecategoryData?: FinancecategoryData
// }

export class FinanceList {
    id?: number
    uuid?: string
    name?: string
    type?: string
    description?: string
    status?: number
    createdBy?: number
    createdAt?: string
    modifiedBy?: number
    updateAt?: string
    transaction: Transaction[]
}

export class Transaction {
    id: number
    uuid: string
    transactionid: string
    grnid: string
    paymentcycle_id: number
    financecategory: number
    po_uuid: string
    expensedate: string
    bankaccount_id: number
    amount: number
    description: string
    createdAt: string
}
