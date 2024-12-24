import { Bankaccount } from "./bankaccounts";
import { Expensetypes } from "./expensetypes";
import { User } from "./purchaseorder";

export class Expense {
    id?: number;
    uuid?: string;
    expensetype_id?: number;
    bankaccount_id?: number;
    amount?: number;
    warehouse_id?: number;
    description?: string;
    createdBy?: string;
    updatedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    file?: string;
    expensedate?: String;
    bankaccount?: Bankaccount;
    expensetype?: Expensetypes;
    user?: User;
    warehouse?: Warehouse
}
export class Expensepaginate {
    datas?: Expense[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}

export class Warehouse {
    id?: number
    name?: string
    mobile?: string
    billingaddress?: string
    address?: string
    address1?: string
    address2?: string
    pincode?: string
    gstin?: string
    createdBy?: number
}
