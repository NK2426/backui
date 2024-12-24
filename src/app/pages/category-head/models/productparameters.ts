import { Categories } from "./categories";
import { Department } from "./department";
import { Group } from "./groups";
import { Subcategories } from "./subcategories";

export class Productparameters {
    id?: number;
    uuid?: string;
    name?: string;
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
    group?:Group;
    department?:Department;
    category?:Categories;
    subcategory?:Subcategories;
    type?: number;
    addValue?:boolean;
    productparametervalues?: Productparametersvalues[]
}
export class Productparameterspaginate {
    datas?:Productparameters[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}

export class Productparametersvalues {
    id?: string;
    parameter_id?: number;
    value?: string;
    ordering?: string;
    status?: string;

}