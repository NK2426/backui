import { Bundle } from "./inventory";
import { Inwarditem, Product, Vendormapping } from "./product";
import { Productvariants, Productvariantsvalues } from "./productvariants";

export class Purchaseorder {
    id?: number;
    uuid?: string;
    vendor_id?: string;
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
    paymentterm_id?: number;
    potype?: string;
    ship_status?: string;
    createdAt?: string;
    updatedAt?: string;
    department_id?: string;
    subtotal?: string;
    taxtotal?: string;
    discounttotal?: string;
    grandtotal?: number;
    bundles?: Bundle[];
    vendor?: Vendor;
    transporterid?: string;
    gstdetail?: number;
    invoice?: number;
    expiredoc?: number;
    handoverslip?: number;
    invoiceno?: String;
    remarks?: string;
}

export class Document {
    id?: number;
    vendor_id?: number;
    name?: string;
    path?: string;
}

export class Purchasebill {
    id?: number;
    po_id?: number;
    paymentdate?: string;
    notes?: string;
    amount?: string;

}

export class User {
    uuid?: string;
    uid?: string;
    name?: string;
    firstname?: string;
    userID?: string;
    email?: string;
    mobile?: string;
    addresses?: Address[]
    vendordetail?: Vendordetail;
}
export class Address {
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    phone?: string;
    zipcode?: string;
}

export class Purchaseitem {
    id?: number;
    uuid?: string;
    purchaseorder_id?: number;
    quantity?: string;
    price?: string;
    ifigst?: string;
    cgst?: string;
    sgst?: string;
    igst?: string;
    subtotal?: string;
    discounttype?: string;
    discount?: string;
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
    productvariant?: Productvariants;
    vendormapping?: Vendormapping;
    inwarditems?: Inwarditem[];
    expdate?: string;
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

export class Vendor {
    id?: number;
    uuid?: string;
    name?: string;
}

export class Vendordetail {
    website?: string;
    gstin?: number;
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