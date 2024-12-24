export class Financecategories {
    id?: number;
    name?: string;
    uuid?: string;
    type?: string;
    createdBy?: string;
    status?: string;
    createdAt?: string;
    description?: string;
}
export class Financecategoriespaginate {
    datas?:Financecategories[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}