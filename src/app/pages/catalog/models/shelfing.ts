
import { Categories, Subcategories } from "./inventory";
export class Shelfing {
    id?: number;
    rackvalue?: string;
    rackvalue2?: string;
    rowvalue?: string;
    rowvalue2?: string;
    columnvalue?: string;
    columnvalue2?: string;
    binvalue?: string;
    binvalue2?: string;    
    category_id?: number;
    subcategory_id?:number;
    createdBy?:number;
    modifiedBy?:number;
    createdAt?:string;
    updatedAt?:string;
    status?:number;
    category?:Categories;
    subcategory?:Subcategories;
    maxcount?:number;
}
export class Shelfingpaginate {
    datas?:Shelfing[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}
