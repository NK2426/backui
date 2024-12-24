
export class Warehouse {
    id?: number;
    name?: string;
    address?: string;
    address1?: string;
    address2?: string;
    billingaddress?: string;
    mobile?: number;
    pincode?: number;
    gstin?:string;
    status?: string;
}
export class Warehousepaginate {
    datas?:Warehouse[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}