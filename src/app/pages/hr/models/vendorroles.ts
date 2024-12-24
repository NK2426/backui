export class endorRole {
    uuid?: string;
    vendor?: string;
    name?: string;
    email?: string;
    phone?: number;
}
export class vendorRolePagination {
    datas?: vendorRole[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}