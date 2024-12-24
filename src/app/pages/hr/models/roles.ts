export class Roles {
    id?: number;
    uuid?: string;
    name?: string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}
export class Rolespaginate {
    datas?:Roles[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}