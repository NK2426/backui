
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
export class Qcitems {
    id?: number;
    psid?: string;
    qcvariants?: Qcvariants[];
}
export class Qcvariants {
    id?: number;
    productvariant?: Productvariants;
    productvariantvalue?: Productvariantsvalues;
}