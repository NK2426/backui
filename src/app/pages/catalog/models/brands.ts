import { Department } from "./department";

export class Brands {
    bid?: number;
    department_id?: number;
    uuid?: string;
    name?: string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    description?: string;
    department?: Department
}
export class Brandspaginate {
    datas?:Brands[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}