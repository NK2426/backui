import { Item } from "./item";

export namespace USER {

    export interface UserDetail {
        uid: number;
        userID: string;
        name: string;
        image: string;
        firstname: string;
        lastname: string;
        mobile: string;
        authkey: string;
        password: string;
        email: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
    }

    export interface UserProductRating {
        uuid: string;
        department_id: number;
        product_id: number;
        user_id: number;
        item_uuid: string;
        orderID: string;
        rating: number;
        reviews: string;
        image: string;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        item: Item;
        user: UserDetail;
    }

    export interface UserPagination extends GenericUserHTTPResponse {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        datas: UserDetail[]
    }

    export interface UserProductRatingPagination extends GenericUserHTTPResponse {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        datas: UserProductRating[]
    }

    export interface GenericUserHTTPResponse {
        status: number;
        message: string;
        datas: any[];
    }

}

