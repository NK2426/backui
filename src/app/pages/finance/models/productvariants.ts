
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