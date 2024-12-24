import { Productselectimages } from "./purchaseorder";
import { Vendor } from "./vendor";
export namespace VENDOR_VARIANT {

    export interface vendorVariant {
        id: number;
        uuid: string;
        department_id: number;
        brand_id: number;
        category_id: number;
        subcategory_id: number;
        group_id: number;
        product_id: number;
        vendor_id: number;
        productID: string;
        productselectimage_id: number;
        vendorproId: string;
        mrp: number;
        price: number;
        sku: string;
        skuid: string;
        name: number;
        description: string;
        width: string;
        height: string;
        weight: string;
        length: string;
        percentage: number;
        hsncode: string;
        modifiedBy: number;
        status: number;
        path:string;
        item: number;
        user: Vendor;
        productselectimage?: Productselectimages;
    }

    export interface VendorVariantHttpResponse {
        status: number;
        message: string;
        data: vendorVariant[];
    }

}

