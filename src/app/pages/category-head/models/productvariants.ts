import { Categories } from "./categories";
import { Department } from "./department";
import { Group } from "./groups";
import { Subcategories } from "./subcategories";

export class Productvariants {
    id?: number;
    uuid?: string;
    name?: string;
    displayname?: string;
    showtype?:string;
    refimg?:string;
    reflabel?:string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    description?:string;
    group_id?: number;
    department_id?: number;
    category_id?: number;
    subcategory_id?: number;
    department?:Department;
    group?:Group;
    category?:Categories;
    subcategory?:Subcategories;
    type?: number;
    addValue?:boolean;
    productvariantvalues?: Productvariantsvalues[]
}
export class Productvariantspaginate {
    datas?:Productvariants[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}

export class Productvariantsvalues {
    id?: string;
    variant_id?: number;
    value?: string;
    ordering?: string;
    status?: string;
    imgicon?: string;
}


export interface variant{
    id: number;
    productVariantValue: string;
    productVariant: string;
    size: number;
    mrp: number;
    price: number;
    designId: number;
    length: number;
    width: number;
    breath: number;
    height: number;
}

export interface VariantHttpResponse {
    status: number;
    message: string;
    datas: variant[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
}