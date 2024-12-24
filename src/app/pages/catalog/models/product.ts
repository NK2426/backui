import { Brands } from "./brands";
import { Categories } from "./categories";
import { Department } from "./department";
import { Group } from "./groups";
import { Subcategories } from "./subcategories";

export class Product {
    pid?: number;
    uuid?: string;
    name?: string;
    department?: Department;
    category?: Categories;
    subcategory?: Subcategories;
    brand?: Brands;
    cost_price?: string;
    productselectimages?: Productselectimages[];
    group?: Group;
    status?: string;
    cod?: number;
    returnable?: number;
    returntime?: number;
    terms?: number;
    freeship?: number;
    supercoins?: number;
    description?: string;
    type?: string;
    keywords?: string;
    updatedAt?: string;
    vendordescription?: string;
}
export class Productimage {
    id?: number;
    product_id?: number;
    path?: string;
    select?: boolean;
    variantvalue_id?: number;
    name?: string;
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
export class Productpaginate {
    datas?: Product[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}

export class Vendormapping {
    id?: number;
    product_id?: number;
    vendor_id?: number;
    //user?: Vendor;
    status?: any;
    price?: number;
    vendorproId?: string;
}

export class Vendorvariantmapping {
    id?: number;
    uuid?: string;
    department_id?: number;
    brand_id?: number;
    category_id?: number;
    subcategory_id?: number;
    group_id?: number;
    product_id?: number;
    vendor_id?: number;
    productID?: string;
    vendorproId?: string;
    mrp?: number;
    price?: number;
    sku?: string;
    skuid?: string;
    name?: number;
    description?: string;
    width?: string;
    height?: string;
    weight?: string;
    length?: string;
    percentage?: number;
    hsncode?: string;
    modifiedBy?: number;
    status?: number;
}

