import { Department } from "./department";
import { Group } from "./inventory";
import { Product } from "./product";

export namespace INVENTORY_CONTROL {

    export interface Stock {
        id: number;
        sku: string;
        skuid: string;
        uuid: string;
        department_id: number;
        category_id: number;
        subcategory_id: number;
        group_id: number;
        brand_id: number;
        product_id: number;
        name: string;
        description: string;
        receivedqty: number;
        stockqty: number;
        quantity: number;
        shippedqty: number;
        returnqty: number;
        damageqty: number;
        department: Partial<Department>;
        group: Partial<Group>;
        product: Partial<Product>;
    }

    export interface StocksHttpResponse extends GenericHttpResponse, Pagination {
        datas: Stock[];
    }

    export interface GenericHttpResponse {
        message: string;
        status: string | number;
        datas: any;
        code?: number;
    }

    export interface Pagination {
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }

}

