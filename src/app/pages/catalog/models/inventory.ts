import { Department } from "./department";

export class Stockimage {
    id?: number;
    item_id?: string;
    productimage?: Image;
}
export class Image {
    path?: string;
}
export class Group {
    id?: string;
    name?: string;
    uuid?: string;
    groupname?: string;
    tags?: string;
    description?: string;
    itemscount?: string;
    department?: Department;
    status?: number;
    createdAt?: string;
    department_id?: number;
    image?: string;
}

export class Grouppaginate {
    datas?: Group[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}

export class Bundle {
    id?: number;
    uuid?: string;
    purchaseorder_id?: number;
    bundleID?: string;
    itemscount?: number;
    inwardcount?: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    passed?: boolean;
    inwarditems?: any[];
    disputebundles?: any[];
}

export class Bundlepaginate {
    datas?: Bundle[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}

export { Department };

