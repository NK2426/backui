import { LeavesType } from "./leavetypes";
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
    status?: number;
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