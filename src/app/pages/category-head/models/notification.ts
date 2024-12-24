export class Notifications {
    id?: number;
    title?:string;
    description?:string;
    fromdate?:string;
    fromuser?:number;
    viewid?:string;
    touser?:number;
    status?:number;
}


export class Notificationspaginate {
    datas?:Notifications[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}
