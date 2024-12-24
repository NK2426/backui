import { Department } from "./department";
import { User } from "./user";

export class Brands {
    bid?: number;
    department_id?: number;
    uuid?: string;
    name?: string;
    vendor_id?: number;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    description?: string;
    department?: Department;
    user?:User
}
export class Brandspaginate {
    datas?:Brands[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}