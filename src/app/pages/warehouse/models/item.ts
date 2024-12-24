import { Group } from "./inventory";
import { Department,Categories,Subcategories,Brands, Productimage } from "./product";

export class Itempaginate {
    datas?:Item[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}
export class Item {
    id?: string;
    uuid?: string;
    name?: string;
    description?: string;
    keywords?: string;
    department_id?: string;
    category_id?: string;
    subcategory_id?: string;
    brand_id?: string;
    product_id?: string;
    group_id?: string;
    image_id?: number;
    path?: string;
    department?: Department;
    category?: Categories;
    subcategory?: Subcategories;
    itemsimages?: Itemimage[];
    brand?: Brands;
    status?: string;
    group?:Group;
    quantity?:number;
}

export class Itemimage {
    id?: number;
    item_id?: number;
    image_id?: number;
    path?: string;
    status?: number;
    variantvalue_id?: number;
    productimage?:Productimage;
}

export class Itemlist {
    id?: number;
    sku?: string;
    uuid?: string;
    item_id?: number;
    name?: string;
    mrp?: number;
    price?: number;
    quantity?: number;
    variantvalue?: any;
}

export class Itemmoredetails {
    id?: number;
    item_id?: number;
    title?: string;
    description?: string;
    status?: number;
}
