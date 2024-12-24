import { Purchaseorder } from "./purchaseorder";

export class Documents {
    id?: number;
    vendor_id?: number;
    purchaseorder_id?:number;
    name?:string;
    path?:string;
    createdBy?:number;
    updatedBy?:number;
    createdAt?:string;
    updatedAt?:string;
    status?:number;
    purchaseorder?:Purchaseorder;
}


export class Documentspaginate {
    datas?:Documents[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}
