import { Bankaccount } from "./bankaccounts";
import { PAYMENT } from "./payment";
import { Purchaseorder, User } from "./purchaseorder";


export class Grn {
    id?: number;
    grnid?: string;
    purchaseorder_id?: number;
    vendor_id?: number;
    totalbundles?: number;
    receivedbundles?: number;
    invoiceno?: string;
    totalitems?: number;
    receiveditems?: number;
    buyingprice?: number;
    grnvalue?: number;
    receiveddate?: string;
    purchaseorder?: Purchaseorder;
    createdAt?: string;
    user?: User
}

export class Grnpaginate {
    datas?: Grn[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}

export class Transaction {
    id?: number;
    uuid?: string;
    transactionid?: string;
    grnid?: string;
    paymentcycle_id?: number;
    financecategory?: number;
    po_uuid?: number;
    bankaccount_id?: number;
    amount?: number;
    description?: string;
    createdBy?: string;
    status?: string;
    createdAt?: string;
    file?: string;
    expensedate?: string;
    bankaccount?: Bankaccount;
    user?: User;
    paymentcycle?: PAYMENT.Paymentcycle;
}