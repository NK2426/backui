
export class Cities {
    id?: number;
    state_id?: number;
    name?: string;
    state?: State
}
export class Citiespaginate {
    datas?: Cities[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}

export class State {
    id?: number;
    name?: string;
}

export class Statepaginate {
    datas?: State[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}

export class Postalcode {
    id?: number;
    code?: string;
    city_id?: number;
    state?: State;
    city?: Cities;
    available?: number;
}
export class Postalcodepaginate {
    datas?: Postalcode[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}