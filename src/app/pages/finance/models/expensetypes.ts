export class Expensetypes {
    id?: number;
    name?: string;
    createdBy?: string;
    status?: string;
    createdAt?: string;
    description?: string;
}
export class Expensetypespaginate {
    datas?:Expensetypes[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}