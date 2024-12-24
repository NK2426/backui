
import { Department } from "./inventory";
export class Banner {
    id?: number;
    galleryimgid?: number;
    link?: string;
    title?: string;
    department_id?:number;
    createdBy?:number;
    modifiedBy?:number;
    createdAt?:string;
    updatedAt?:string;
    status?:number;
    department?:Department;
    type?:string;
    path?:string;
}


