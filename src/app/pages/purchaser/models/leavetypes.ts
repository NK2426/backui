export class LeavesType {
    id?: number;
    uuid?: string;
    name?: string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}
export class Leavespaginate {
    datas?: LeavesType[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}