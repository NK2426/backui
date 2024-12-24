export namespace PUSHNOTIFICATION {

    export interface Notification {
        id: number;
        title: string;
        description: string;
        path: string;
        link: string;
        createAt: Date;
        type: string;
        scheduleAt: any;
        send: number;
        createdBy: number;
        enableNotification: boolean;
    }


    export interface NotificationsPaginate extends GenericNotificationResponse {
        datas?: Notification[];
        totalItems?: number;
        totalPages?: number;
        currentPage?: number;
    }

    export interface NotificationHttpResponse extends GenericNotificationResponse {
        data: Notification | any
    }

    export interface GenericNotificationResponse {
        status: string | number;
        data?: any;
        datas?: any[];
        message: string;
    }

}

