export namespace TICKET {

    export interface TicketDetail {
        id: number;
        ticketID: string;
        orderitem_uuid: string;
        title: string;
        description: string;
        createdBy: number;
        modifiedBy: number;
        assignedBy: number;
        type: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        // user: User;
        mobile:string;
        orderID: string;
    }

    export interface Ticket extends Partial<GenericHTTPResponse> {
        data: TicketDetail;
    }

    export interface TicketsPaginated extends Partial<GenericHTTPResponse> {
        datas: TicketDetail[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
    }

    export interface GenericHTTPResponse {
        status: number;
        message: string;
        datas: any;
        data: any;
    }

    export interface User {
        name: string;
        mobile: string;
    }


}

