import { DEBIT_NOTES } from "./debit-notes";
import { Bundle, Group } from "./inventory";
import { Brands, Categories, Department, Purchaseorder, Subcategories, User } from "./purchaseorder";
export class Product {
    pid?: number;
    uuid?: string;
    name?: string;
    sku?: string;
    department_id?: string;
    category_id?: string;
    subcategory_id?: string;
    brand_id?: string;
    unit?: string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    description?: string;
    department?: Department;
    category?: Categories;
    subcategory?: Subcategories;
    brand?: Brands;
    dimensions?: string;
    weight?: string;
    cost_price?: string;
    selling_price?: string;
    variants?: any;
    productsmaps?: Productmap[];
    productmapparams?: Productmapparam[];
    productselectimages?: Productselectimage[];
    user?: User;
    vendormappings?: Vendormapping[];
}
export class Productpaginate {
    datas?: Product[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}
export class Productmap {
    product_id?: string;
    productvariant_id?: string;
}
export class Productmapparam {
    id?: string;
    value_id?: any;
    productparameter?: Productparmeter;
    productparametervalue?: Productparmetervalue
}
export class Productparmeter {
    id?: string;
    name?: string;
}
export class Productparmetervalue {
    id?: string;
    value?: string;
}
export class Productselectimage {
    id?: number;
    product_id?: number;
    image_id?: number;
    path?: string;
    select?: boolean;
}

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
    inventory?: DEBIT_NOTES.Inventory;
    shelfing?: Shelfing;
}


export class Shelfing {
    id?: number;
    rackvalue?: string;
    rackvalue2?: string;
    shelfID?: string;
    rowvalue?: string;
    rowvalue2?: string;
    columnvalue?: string;
    columnvalue2?: string;
    binvalue?: string;
    binvalue2?: string;
    group_id?: number;
    department_id?: number;
    category_id?: number;
    subcategory_id?: number;
    createdBy?: number;
    modifiedBy?: number;
    createdAt?: string;
    updatedAt?: string;
    status?: number;
    group?: Group;
    category?: Categories;
    subcategory?: Subcategories;
    maxcount?: number;
    itemcount?: number;
    available?: number;
    products?: number;
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

export class Productimage {
    id?: number;
    product_id?: number;
    path?: string;
    select?: boolean;
}
