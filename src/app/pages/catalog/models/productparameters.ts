
export class Productparameters {
    id?: number;
    uuid?: string;
    name?: string;
    name_ta?: string;
    value?: string;
    parameter?: string;
    group_id?: number;
    department_id?: number;
    category_id?: number;
    subcategory_id?: number;
    type?: number;
    description?: string;
    status?: number;
    createdBy?: number;
    modifiedBy?: number;
    createdAt?: any;
    updatedAt?: any;
    showinfilter?: number;
    productparametervalues?: Productparametersvalues[];
}
export class Productparametersvalues {
    id?: string | number;
    ordering?: number;
    parameter_id?: number;
    value?: string;
    value_ta?: string;
    status?: string | number;

}
export class Productmapparam {
    id?: string;
    productparameter?: Productparameters;
    productparametervalue?: Productparametersvalues
}