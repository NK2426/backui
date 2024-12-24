
export class Packagetypes {
    id?: number;
    name?:string;
    status?:number;
}
export class Packagetypepaginate {
    datas?:Packagetypes[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}
