export class vendoragent {
    uuid?:string
    id?: number;
    name?: string;
    email?: string;
    mobile?: number;
    address?:string;
    state_id?:number;
    status?: string;
}
export class agentpaginate {
    datas?: vendoragent[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}