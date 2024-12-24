export namespace POPAYMENTS {

    export interface Paymentcycle {
        id: number;
        type: string;
        paymentterm_id: number;
        days: number;
        percentage: number;
        date: string;
    }

    export interface Paymentterm {
        id: number;
        name: string;
        description: string;
        status: number;
        paymentcycles: Paymentcycle[];
    }

    export interface PO_Payment {
        id: number;
        uuid: string;
        vendor_id: number;
        department_id: number;
        date: string;
        deliverydate: string;
        subtotal: number;
        discounttotal: number;
        total: number;
        taxtotal: number;
        grandtotal: number;
        notes: string;
        haltdate: string;
        createdBy: number;
        modifiedBy: number;
        vendordocuments: string;
        documents: string;
        status: string;
        shipper_id: number;
        ship_status: string;
        paymentterm_id: number;
        potype: string;
        gstdetail: string;
        invoice: string;
        handoverslip: string;
        expiredoc: string;
        transporterid: string;
        remarks: string;
        invoiceno: string;
        receiveddate?: Date;
        createdAt: Date;
        updatedAt: Date;
        paymentterm: Paymentterm;
    }

}

