import { Categories } from "src/app/pages/catalog/models/purchaseorder";
import { Department } from "src/app/pages/catalog/models/purchaseorder";
import { Subcategories } from "src/app/pages/catalog/models/purchaseorder";
export class Group {
    id?: string;
    name?: string;
    groupname?: string;
    tags?: string;
    description?: string;
    itemscount?: string;
    department?: Department;
    status?: number;
    createdAt?: string;
    department_id?: number;
    category_id?: number;
    subcategory_id?: number;
    category?: Categories;
    subcategory?: Subcategories;
}

export class Grouppaginate {
    datas?: Group[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}