import { Categories } from "./categories";
import { Department } from "./department";
import { TAGS } from "./tag";

export class Subcategories {
    id?: number;
    uuid?: string;
    name?: string;
    name_ta?: string;
    description?: string;
    tags?: TAGS.Tag[];
    topleveltags?: TAGS.Tag[];
    position?: number;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    department_id?: number;
    category_id?: number;
    department?: Department;
    category?: Categories;
    image?: string;
    slug?: string;
}
export class Subcategoriespaginate {
    datas?: Subcategories[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}