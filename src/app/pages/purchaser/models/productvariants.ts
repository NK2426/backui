export class Productvariants {
  id?: number;
  uuid?: string;
  name?: string;
  show?: number;
  productvariantvalues?: Productvariantsvalues[];
}

export class Productvariantsvalues {
  id?: string;
  variant_id?: number;
  value?: string;
  status?: string;
}
