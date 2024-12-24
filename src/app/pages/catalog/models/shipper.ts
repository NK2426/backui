
export class Shipper {
    id?: number;
    name?: string;
    location?: string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}
export class Shipperpaginate {
    datas?:Shipper[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}