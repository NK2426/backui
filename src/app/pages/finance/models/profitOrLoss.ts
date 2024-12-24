export class Profit {
    message?: string
    data?: Data
}

export class Data {
    totalRevenue?: number
    totalExpense?: number
    profit?: number
    loss?: number
    expenseDetails?: ExpenseDetail[]
}

export class ExpenseDetail {
    name?: string
    totalAmount?: number
    expenses?: Expense[]
}

export class Expense {
    id?: number
    uuid?: string
    expensedate?: string
    amount?: number
    bankaccount?: Bankaccount
}

export class Bankaccount {
    accountnumber?: string
    accountname?: string
    bankname?: string
}
