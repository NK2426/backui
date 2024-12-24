import { Department } from "./department";

export class Categories {
    cid?: number;
    uuid?: string;
    name?: string;
    description?: string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    department_id?: number;
    department?:Department;
}
export class Categoriespaginate {
    datas?:Categories[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}