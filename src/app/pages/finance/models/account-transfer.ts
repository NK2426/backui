export class Root {
    message?: string
    data?: Bankaccount[]
}

export class Bankaccount {
    id?: number
    accountnumber?: string
    uuid?: string
    accountname?: string
    ifsc?: string
    bankname?: string
    description?: string
    type?: string
    status?: number
    createdBy?: number
    updatedBy?: number
    createdAt?: string
    updatedAt?: string;
    
}

export interface Root {
    message?: string
    datas?: Data[]
}

export class Data {
    bankAccountTransactions?: BankAccountTransactions
}

export class BankAccountTransactions {
    id?: number
    accountnumber?: string
    uuid?: string
    accountname?: string
    ifsc?: string
    bankname?: string
    description?: string
    type?: string
    status?: number
    createdBy?: number
    updatedBy?: number
    createdAt?: string
    updatedAt?: string
    transactions?: Transaction[]
}

export class Transaction {
    id?: number
    uuid?: string
    transactionid?: string
    grnid?: string
    paymentcycle_id?: number
    financecategory?: number
    po_uuid?: string
    expensedate?: string
    bankaccount_id?: number
    amount?: number
    description?: string
    createdAt?: string
}
