export class Supersale {
    id?: number;
    uuid?: string;
    name?: string;
    path?:string;
    expirydate?: string;
    description?: string;
    time?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}
export class Supersalepaginate {
    datas?:Supersale[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}