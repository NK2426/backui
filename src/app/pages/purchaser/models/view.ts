import { Product, Vendormapping, Vendorvariantmapping } from "./product";
import { Productvariants, Productvariantsvalues } from "./productvariants";

export class Purchaseorder {
    id?: number;
    uuid?: string;
    vendor_id?: string;
    warehouse_id?: string;
    product_id?: string;
    autopo?: number;
    documents?: string;
    vendordocuments?: string;
    date?: string;
    deliverydate?: string;
    discountype?: number;
    discount?: string;
    total?: string;
    notes?: string;
    status?: string;
    product?: Product;
    purchaseorderitems?: Purchaseitem[];
    productselectimages?: Productselectimages[];
    // tax?: number;
    // taxpercentage?: any;
    user?: User;
    fromstatus?: string;
    tostatus?: string;
    shipper_id?: number;
    ship_status?: string;
    paymentterm_id?: number;
    potype?: string;
    createdAt?: string;
    updatedAt?: string;
    department_id?: string;
    subtotal?: string;
    taxtotal?: string;
    discounttotal?: string;
    grandtotal?: string;
    department?: Department;
    paymentterm?: Paymentterm;
    warehouse?: Warehouse;
}
export class User {
    uuid?: string;
    name?: string;
    email?: string;
    mobile?: string;
    addresses?: Address[]
    vendordetail?: Vendordetails;

}
export class Address {
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    phone?: string;
    zipcode?: string;
}
export class Vendordetails {
    firstname?: string;
    lastname?: string;
    mobile?: string;
    gstin?: string;
    tin?: string;
}
export class Purchaseitem {
    id?: number;
    uuid?: string;
    skuid?: string;
    venvariantmap_id?: number;
    purchaseorder_id?: number;
    quantity?: string;
    price?: string;
    mrp?: string;
    ifigst?: string;
    cgst?: string;
    sgst?: string;
    igst?: string;
    subtotal?: string;
    discounttype?: string;
    discount?: string;
    discountoption?: number;
    discounttotal?: string;
    amount?: string;
    total?: string;
    purchaseitemdetails?: Purchaseitemdetails[];
    product_id?: string;
    product?: Product;
    productselectimage_id?: number;
    ctax?: string;
    ctaxval?: string;
    stax?: string;
    staxval?: string;
    itax?: string;
    itaxval?: string;
    grandtotal?: string;
    productselectimage?: Productselectimages;
    vendormapping?: Vendormapping;
    vendorvariantmapping?: Vendorvariantmapping;
}
export class Purchaseitemdetails {
    id?: number;
    purchaseorder_id?: string;
    item_id?: number;
    variant_id?: string;
    value_id?: string;
    productvariant?: Productvariants;
    productvariantvalue?: Productvariantsvalues;
}

export class Purchaseorderpaginate {
    datas?: Purchaseorder[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}
export class Department {
    did?: number;
    uuid?: string;
    name?: string;
}
export class Departmentpaginate {
    datas?: Department[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}

export class Vendor {
    id?: number;
    uid?: number;
    uuid?: string;
    name?: string;
    deliveryscore?: number;
    price?: number;
    qualityscore?: number;
    pendingstock?: number;
    noactivepo?: string;
    notransitstock?: string;
    taxfilling?: string;
    user?: User;
    vendor_id?: number;
    taxtype?: number;
}


export class Brands {
    bid?: number;
    uuid?: string;
    name?: string;
    createdBy?: string;
}
export class Categories {
    id?: number;
    uuid?: string;
    name?: string;
    description?: string;
}
export class Subcategories {
    id?: number;
    uuid?: string;
    name?: string;
    description?: string;
}

export class Poproess {
    id?: number;
    user?: User;
    fromstatus?: string;
    tostatus?: string;
    createdAt?: string;
    comments?: string;
    data?: Poproess
}

export class Productselectimages {
    id?: number;
    product_id?: number;
    image_id?: number;
    path?: string;
}
export class Tax {
    id?: number;
    name?: string;
    percentage?: any;
}

export class Shipper {
    id?: number;
    name?: string;
    location?: string;
}

export class Paymentterm {
    id?: number;
    name?: string;
    description?: string;
    status?: number | string;
}

export class Warehouse {
    id?: number;
    name?: string;
    billingaddress?: string;
    address?: string;
    address1?: string;
    address2?: string;
    pincode?: string;
    mobile?: string;
}