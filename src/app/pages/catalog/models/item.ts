import { Brands } from "./brands";
import { Categories } from "./categories";
import { Department } from "./department";
import { Group } from "./groups";
import { Productimage } from "./product";
import { Subcategories } from "./subcategories";
import { USER } from "./user";
export class Itempaginate {
    datas?: Item[];
    users?: USER.UserDetail[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}
export class Item {
    id?: string;
    uuid?: string;
    name?: string;
    description?: string;
    name_ta?: string;
    description_ta?: string;
    keywords?: string;
    department_id?: string;
    category_id?: string;
    subcategory_id?: string;
    brand_id?: string;
    product_id?: string;
    group_id?: string;
    itemslist_uuid?: string;
    image_id?: number;
    path?: string;
    department?: Department;
    category?: Categories;
    subcategory?: Subcategories;
    itemsimages?: Itemimage[];
    brand?: Brands;
    status?: string;
    group?: Group;
    quantity?: number;
    variantgroup_id?: number;
    mrp?: number;
    price?: number;
    offer?: number;
    createdAt?: string;
    updatedAt?: string;
    updatedBy?: number;
    offername?: string;
    supername?: string;
    expirydate?: string;
    time?: string;
    percent?: number;
    editFieldName?: string;
    highlightError?: boolean;
    itemslist?: Itemlist;
    vpath?:string;
    store_id?:number;
    slug?:string;
    show_type?:string
}


export class Itemimage {
    id?: number;
    item_id?: number;
    image_id?: number;
    path?: string;
    status?: number;
    variantvalue_id?: number;
    productimage?: Productimage;
    itemslist_uuid?: string;
    select?: boolean;
}

export class Itemlist {
    id?: number;
    sku?: string;
    uuid?: string;
    item_id?: number;
    name?: string;
    mrp?: number;
    price?: number;
    offer?: number;
    rprice?: any;
    quantity?: number;
    variantvalue?: any;
    path?: string;
    item?: Item;
    itemimages?: Itemimage[]
    variantlist?: any;
    skulist?: any[];
    checked?: Boolean;
    skuid?: string;
    description?: string;
    orderquantity?: string;
    stockqty?: string;
}

export class Itemmoredetails {
    id?: number;
    item_id?: number;
    title?: string;
    description?: string;
    status?: number;
}
    