
import { Categories, Group, Subcategories } from "./inventory";
import { Packagetypes } from "./packagetypes";
import { Department } from "./purchaseorder";
export class Packages {
    id?: number;
    uuid?: string;
    name?: string;
    type_id?: number;
    length?: number;
    width?: number;
    height?: number;
    group_id?: number;
    department_id?: number;
    category_id?: number;
    subcategory_id?: number;
    description?: string;
    createdBy?: number;
    modifiedBy?: number;
    createdAt?: string;
    updatedAt?: string;
    status?: number;
    packagetype?: Packagetypes;
    group?: Group;
    department?: Department;
    category?: Categories;
    subcategory?: Subcategories;
}
export class Packagepaginate {
    datas?: Packages[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}
