
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
    productparameter?: Productparameters;
    productparametervalue?: Productparametersvalues
}