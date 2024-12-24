import { TAGS } from "./tag";

export class Department {
    did?: number;
    uuid?: string;
    name?: string;
    name_ta?: string;
    contact?: string;
    email?: string;
    description?: string;
    tags?: TAGS.Tag[];
    topleveltags?: TAGS.Tag[];
    position?: number;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    imgpath?: string;
    image?: string;
}
export class Departmentpaginate {
    datas?: Department[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}