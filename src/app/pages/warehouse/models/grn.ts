import { Disputeitem, Product, Vendormapping } from "./product";
import { Productvariants } from "./productvariants";
import { Billing, Productselectimages, Purchaseitem, Purchaseorder, User, Vendor, Vendorvariantmapping } from "./purchaseorder";

export class Grn {
    id?: number;
    grnid?: string;
    purchaseorder_id?: number;
    vendor_id?: number;
    totalbundles?: number;
    receivedbundles?: number;
    invoiceno?: string;
    invoice?: string;
    invoicedate?: string;
    lrno?: string;
    //remarks?: string;
    totalitems?: number;
    receiveditems?: number;
    buyingprice?: number;
    grnvalue?: number;
    receiveddate?: string;
    closeddate?: string;
    purchaseorder?: Purchaseorder;
    createdAt?: string;
    status?: string;
    user?: User;
    bundlereceivedqty?: number;
    grandtotal?: number;
    batch_id?: number;
    vendor?: Vendor;
    disputeitems?:number;
    grnitems?: Grnitem[];
    billing?:Billing;
    warehouse?: Warehouse;
    transporterid?:string;
    transportcost?:number;
    overalldiscount?:number;
}

export class Grnitem {
    id?: number;
    uuid?: string;
    grn_id?: number;
    purchaseorder_id?: number;
    purchaseitem_id?: number;
    tatkalpo_id?: number;
    quantity?: number;
    receivedqty?: number;
    excessqty?: number;
    inwarditemcount?: number;
    disputeqty?: number;
    mrp?: string;
    price?: string;
    sellingmrp?: string;
    sellingprice?: string;
    ifigst?: number;
    cgst?: string;
    sgst?: string;
    igst?: string;
    subtotal?: string;
    discounttype?: string;
    discount?: string;
    discounttotal?: string;
    amount?: string;
    total?: string;
    //purchaseitemdetails?: Purchaseitemdetails[];
    product_id?: string;
    product?: Product;
    productselectimage_id?: number;
    ctax?: number;
    ctaxval?: number;
    stax?: number;
    staxval?: number;
    itax?: number;
    itaxval?: number;
    grandtotal?: number;
    productselectimage?: Productselectimages;
    productvariant?: Productvariants;
    vendormapping?: Vendormapping;
    vendorvariantmapping?: Vendorvariantmapping;
    //inwarditems?: Inwarditem[];
    expdate?: string;
    genpdf?: number;
    purchaseorderitem?: Purchaseitem;

}

export class Grnpaginate {
    datas?: Grn[];
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
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
    gstin?:string
}