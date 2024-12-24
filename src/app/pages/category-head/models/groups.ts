import { Categories } from "./categories";
import { Department } from "./department";
import { Subcategories } from "./subcategories";
export class Group {
    id?: string;
    name?: string;
    groupname?: string;
    tags?: string;
    description?: string;
    itemscount?: string;
    department?:Department;
    status?:number;
    createdAt?:string;
    department_id?:number;
    category_id?:number;
    subcategory_id?:number;
    category?:Categories;
    subcategory?:Subcategories;
}

export class Grouppaginate {
    datas?:Group[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}