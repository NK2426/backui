import { Inwarditem, Productimage } from "./product";

export class Bundle {
    id?: number;
    uuid?: string;
    purchaseorder_id?:number;
    bundleID?: string;
    itemscount?: number;
    inwardcount?: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    passed?: boolean;
    inwarditems?:Inwarditem[];
    disputebundles?:Disputebundles[];
}

export class Bundlepaginate {
    datas?:Bundle[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}
export class Stockimage {
    id?: number;
    item_id?: string;
    productimage?: Image;
}
export class Image {
    path?: string;
}

export class Disputebundles {
    bundle_id?:number;
    path?: string;
    reason?:string;
    type?:string;
}

export class Group {
    id?: string;
    name?: string;
    groupname?: string;
    tags?: string;
    description?: string;
    itemscount?: string;
    department?:Department;
    category?:Categories;
    subcategory?:Subcategories;
    status?:number;
    createdAt?:string;
    department_id?:number;
    category_id?:number;
    subcategory_id?:number;
}

export class Grouppaginate {
    datas?:Group[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}

export class Department {
    did?: string;
    name?: string;
    uuid?: string;
    description?: string;
}

export class Qcgroups {
    id?: number;
    name?: string;
    purchaseorder_id?: number;
    product_id?: number;
}
export class Categories {
    id?: number;
    uuid?: string;
    name?: string;
    description?: string;
}
export class Subcategories {
    id?: number;
    uuid?: string;
    name?: string;
    description?: string;
}
