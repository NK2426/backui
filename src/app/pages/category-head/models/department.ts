
export class Department {
    did?: number;
    uuid?: string;
    name?: string;
    contact?: string;
    email?: string;
    description?: string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    beauty?:number;
}
export class Departmentpaginate {
    datas?:Department[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}