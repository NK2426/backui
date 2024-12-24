//import { Brands, Department, Categories, Subcategories, User } from "./purchaseorder";

export class Bankaccount {
    id?: number;
    uuid?: string;
    accountname?: string;
    accountnumber?:number;
    bankname?: string;
    ifsc?: string;
    type?:string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    description?: string;
}

export class Bankaccountpaginate {
    datas?:Bankaccount[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}
