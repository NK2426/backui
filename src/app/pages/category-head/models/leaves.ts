export class Leaves {
    id?: number;
    uuid?: string;
    description?: string;
    name?:string;
    leavetype_id?:number;
    leavedate?:string;
    user?:any;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    leavetype?:LeavesType;
}
export class Leavespaginate {
    datas?:Leaves[];
    totalItems?:number;
    totalPages?:number;
    currentPage?:number;
}

export class LeavesType {
    id?: number;
    uuid?: string;
    name?: string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}