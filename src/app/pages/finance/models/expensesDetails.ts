export interface Root {
    message?: string
    data?: ExpenseType[]
}

export class Pagination {
    totalRecords?: number
    currentPage?: any
    totalPages?: number
    pageSize?: number
}

export class ExpenseType {
    id?: number
    name?: string
    description?: string
    status?: number
    createdBy?: number
    createdAt?: string
    updatedAt?: string
}

export class Root {
    message?: string
    datas?: Exp
    totalItems?: number
    totalPages?: number
    currentPage?: number
}

export class Exp {
    id?: number
    name?: string
    description?: string
    status?: number
    createdBy?: number
    createdAt?: string
    updatedAt?: string
    expenses?: Expense[]
}

export class Expense {
    id?: number
    uuid?: string
    expensetype_id?: number
    expensedate?: string
    bankaccount_id?: number
    amount?: number
    description?: string
    file?: string
    status?: number
    createdBy?: number
    updatedBy?: number
    createdAt?: string
    updatedAt?: string
}
