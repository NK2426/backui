import { Department } from "./department";
import { Categories } from "./categories";

export class Subcategories {
    id?: number;
    uuid?: string;
    name?: string;
    description?: string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    department_id?: number;
    category_id?: number;
    department?:Department;
    category?:Categories;
}
export class Subcategoriespaginate {
    datas?:Subcategories[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}