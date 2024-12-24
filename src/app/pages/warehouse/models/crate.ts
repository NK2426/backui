export namespace CRATEMANAGEMENT {
    export interface Crate {
        name: string;
        type: string,
        id?: number;
        uuid?: string;
        status?: number;
    }
    export class Cratepaginate {
        datas?: Crate[];
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
    }
}