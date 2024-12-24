export class Vendor {
    id?: number;
    uuid?: string;
    name?: string;
    description?: string;
}
export class Vendorpaginate {
    datas?: Vendor[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}
export class Address {
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    phone?: string;
}
export class Vendordetail {
    uuid?:string;
    vendorId?: string;
    firstname?: string;
    lastname?: string;
    username?: string;
    password?: string;
    email?: string;
    mobile?: string;
    website?: string;
    gstin?:string;
    tin?:string;
}
export class Vendormapping {
    id?: number;
    product_id?: number;
    vendor_id?: number;
    user?: Vendor;
    status?:any;
    price?:number;
    vendorproId?: string;
}