import { Categories } from "./categories";
import { Department } from "./department";
import { Productparameters } from "./product";
import { Subcategories } from "./subcategories";
export class Group {
    id?: string;
    name?: string;
    name_ta?: string;
    uuid?: string;
    groupname?: string;
    tags?: string;
    description?: string;
    position?: number;
    itemscount?: string;
    department?: Department;
    status?: string;
    createdAt?: string;
    department_id?: number;
    category_id?: number;
    subcategory_id?: number;
    category?: Categories;
    subcategory?: Subcategories;
    path?: string;
    image?: string;
    slug?: string;
    supercoins?: number;
    productparameters?: Productparameters[];
}

export class Grouppaginate {
    datas?: Group[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}

export interface GenericGroupResponse {
    status: string;
    data: any[];
    message: string;
}