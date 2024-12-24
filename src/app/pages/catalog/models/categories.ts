import { Department } from "./department";
import { TAGS } from "./tag";

export class Categories {
    cid?: number;
    uuid?: string;
    name?: string;
    name_ta?: string;
    description?: string;
    tags?: TAGS.Tag[];
    topleveltags?: TAGS.Tag[];
    position?: number;
    image?: string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    department_id?: number;
    department?: Department;
    imgpath?: string;
    slug?: string;
}
export class Categoriespaginate {
    datas?: Categories[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}