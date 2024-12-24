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
    invoiceitemcount?: number;
    receivedqty?: number;
    imgpath?: string;
    purchaseorderitems?: Purchaseitem[];
    purchaseitems?: Purchaseitem[];
    productselectimages?: Productselectimages[];
    // tax?: number;
    // taxpercentage?: any;
    user?: User;
    fromstatus?: string;
    tostatus?: string;
    shipper_id?: number;
    ship_status?: string;
    createdAt?: string;
    updatedAt?: string;
    department_id?: string;
    subtotal?: string;
    taxtotal?: string;
    discounttotal?: string;
    grandtotal?: string;
    bundles?: Bundle[];
    vendor?: Vendor;
    transporterid?: string;
    transportcost?: number;
    overalldiscount?: number;
    gstdetail?: number;
    invoice?: number;
    invoicevalue?: number;
    invoicedate?: string;
    lrno?: string;
    expiredoc?: number;
    handoverslip?: number;
    invoiceno?: String;
    remarks?: string;
    warehouse_id?: string;
    inwarditems?: Inwarditem[];
    warehouse?: Warehouse;
    billing?:Billing
    batch?: Batch;
}
export class Purchaseorderpaginate {
    datas?: Purchaseorder[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
}
export class User {
    uuid?: string;
    name?: string;
    email?: string;
    mobile?: string;
    addresses?: Address[]
    vendordetail?: Vendordetails;
}

export class Vendordetails {
    firstname?: string;
    lastname?: string;
    mobile?: string;
    gstin?: string;
    tin?: string;
    acceptedAt?: string;
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
    mrp?: string;
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
    vendorvariantmapping?: Vendorvariantmapping;
    inwarditems?: Inwarditem[];
    expdate?: string;
    receivedqty?: number;
    invoiceqty?: number;
}

export class Vendorvariantmapping {
    id?: number;
    uuid?: string;
    department_id?: number;
    brand_id?: number;
    category_id?: number;
    subcategory_id?: number;
    group_id?: number;
    product_id?: number;
    vendor_id?: number;
    productID?: string;
    productselectimage_id?: number;
    vendorproId?: string;
    mrp?: number;
    price?: number;
    sku?: string;
    skuid?: string;
    name?: number;
    description?: string;
    width?: string;
    height?: string;
    weight?: string;
    length?: string;
    percentage?: number;
    hsncode?: string;
    modifiedBy?: number;
    status?: number;
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
export class Department {
    did?: number;
    uuid?: string;
    name?: string;
    beauty?: number;
}

export class Vendor {
    id?: number;
    uuid?: string;
    uid?: string;
    name?: string;
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
export class Bundle {
    id?: number;
    bundleID?: string;
    itemscount?: string;
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
export class Billing {
    billingaddress?: string;
}

export class Qcitem {
    id?: number;
    purchaseorder_id?: number;
    purchaseorderitem_id?: number;
    psidinc?:number;
    batch_id?: number;
    product_id?: number;
}

export class Batch {
    id?: number;
    po_id?: number;
    invoiceno?: number;
    remarks?:string;
    invoiceitemcount?:number;
    createdAt?: string;
    status?: number;
    qcitems?: Qcitem[];
}