
import { Categories, Group, Subcategories } from "./inventory";
import { Productvariantsvalues } from "./productvariants";
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
    productvariantvalue?: Productvariantsvalues;
}
export class Shelfingpaginate {
    datas?: Shelfing[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}

// export class Deductedpsids {
//     id?: number;
//     psids?: string;
//     createdBy?: number;
//     user?: User;
//     addValue?: boolean;
//     createdAt?: string;
// }

// export class Deductedpsidpaginate {
//     datas?: Deductedpsids[];
//     totalItems?: number;
//     totalPages?: number;
//     currentPage?: number;
// }


