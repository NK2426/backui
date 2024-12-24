import { Grnitem } from "./grn";
import { Bundle, Group } from "./inventory";
import { Purchaseitem, Purchaseorder } from "./purchaseorder";


export class Inwarditem {
    id?: number;
    purchaseorder_id?: string;
        bundle_id?: string;
    psid?: string;
    status?: string;
    bundle?: Bundle;
    product?: Product;
    purchase?: Purchaseorder;
    disputeitem?: Disputeitem;
    name?: string;
    purchaseorderitem?: Purchaseitem;
    purchaseorderitem_id?: number;
    grnitem?: Grnitem;
    grnitem_id?: number;
}
export class Inwarditempaginate {
    datas?: Inwarditem[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}
export class Productimage {
    id?: number;
    product_id?: number;
    path?: string;
    select?: boolean;
}
export class Product {
    pid?: number;
    uuid?: string;
    name?: string;
    group?: Group;
    group_id?: number;
    department?: Department;
    category?: Categories;
    subcategory?: Subcategories;
    brand?: Brands;
    cost_price?: string;
    description?: string;
    vendormappings?: Vendormapping[];
}
export class Productselectimages {
    id?: number;
    product_id?: number;
    image_id?: number;
    path?: string;
}
export class Productvariants {
    id?: number;
    uuid?: string;
    name?: string;
    productvariantvalues?: Productvariantsvalues[]
}
export class Productvariantsvalues {
    id?: string;
    variant_id?: number;
    value?: string;
    status?: string;
}
export class Productparameters {
    id?: number;
    uuid?: string;
    name?: string;
    value?: string;
    parameter?: string;
}
export class Productparametersvalues {
    id?: string;
    parameter_id?: number;
    value?: string;
    status?: string;

}
export class Productmapparam {
    id?: string;
    value_id?: any;
    productparameter?: Productparameters;
    productparametervalue?: Productparametersvalues
}
export class Purchaseorderpaginate {
    datas?: Purchaseorder[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}
export class Department {
    did?: number;
    uuid?: string;
    name?: string;
}
export class Brands {
    bid?: number;
    uuid?: string;
    name?: string;
    createdBy?: string;
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
export class Vendormapping {
    id?: number;
    product_id?: number;
    vendor_id?: number;
    price?: number;
    status?: number;
    vendorproId?: string;
}


export class Disputeitem {
    psid?: string;
    path?: string;
    reason?: string;
    type?: string;
}

