import { User } from "./user"
export class Attendance {
    id?: number;
    user_id?: string;
    createdBy?: string;
    modifiedBy?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    logintime?: string;
    logouttime?: string;
    date?: string;
    user?: User;
}
export class Attendancepaginate {
    datas?: Attendance[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}