export namespace REASONS {

    export interface Department {
        did: number;
        uuid: string;
        name: string;
        name_ta: string;
        description: string;
        image: string;
        position: number;
        status: number;
    }

    export interface Reason {
        id: number;
        uuid: string;
        reason: string;
        department_id: number;
        createdBy: number;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        department: Department;
    }

    export interface ReasonsPaginated extends Partial<GenericHTTPResponse> {
        datas: Reason[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }

    export interface Reasons extends Partial<GenericHTTPResponse> {
        data: Reason;
    }
    export interface GenericHTTPResponse {
        status: number;
        message: string;
        code: number;
        datas: any;
        data: any;
    }
}