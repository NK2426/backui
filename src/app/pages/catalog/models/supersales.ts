export class Supersales {
    id?: number;
    uuid?: string;
    name?: string;
    path?:string;
    startdate?:string
    expirydate?: string;
    description?: string;
    time?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}
export class Supersalespaginate {
    datas?:Supersales[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}