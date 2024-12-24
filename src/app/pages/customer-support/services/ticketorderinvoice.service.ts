import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ORDERDETAIL } from "../models/order-detail";
import { ORDERINVOICE } from "../models/order-invoice";
import { EnvService } from "./env.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class TicketOrderInvoiceService {
  TicketOrderInvoiceAPIBaseURL: string = `${environment.CUSTOMER_SUPPORT_BASE_URL}orders`;
  returnUrl: string = `${environment.CUSTOMER_SUPPORT_BASE_URL}customer`;
  TicketOrderAPIBaseURL: string = `${environment.CUSTOMER_SUPPORT_BASE_URL}tickets`;

  constructor(private http: HttpClient, private env: EnvService) { }

  getTicketDetailOrder(
    orderitem_uuid: string | null
  ): Observable<ORDERDETAIL.OrderDetail> {
    return this.http.get<ORDERDETAIL.OrderDetail>(
      this.TicketOrderInvoiceAPIBaseURL + "/view/" + orderitem_uuid
    );
  }
  returnTicketDetailOrder(
    orderid: string | null
  ): Observable<ORDERDETAIL.OrderDetail> {
    return this.http.get<ORDERDETAIL.OrderDetail>(
      this.TicketOrderInvoiceAPIBaseURL + "/viewreturn/" + orderid
    );
  }
  acceptreturnItem(
    returnitemuuid: string | null
  ): Observable<ORDERDETAIL.OrderDetail> {
    return this.http.get<ORDERDETAIL.OrderDetail>(
      this.TicketOrderInvoiceAPIBaseURL +
      "/returnstatus/accept/" +
      returnitemuuid
    );
  }
  rejectretrunitem(
    returnitemuuid: string | null
  ): Observable<ORDERDETAIL.OrderDetail> {
    return this.http.get<ORDERDETAIL.OrderDetail>(
      this.TicketOrderInvoiceAPIBaseURL +
      "/returnstatus/reject/" +
      returnitemuuid
    );
  }

  getTicketDetailInvoice(
    orderitem_uuid: string | null
  ): Observable<ORDERINVOICE.OrderInvoice> {
    return this.http.get<ORDERINVOICE.OrderInvoice>(
      this.TicketOrderInvoiceAPIBaseURL + "/viewinvoice/" + orderitem_uuid
    );
  }

  initiateCancelOrRefund(ticketID: string, comment?: string): Observable<any> {
    return this.http.put(this.TicketOrderAPIBaseURL + "/edit/" + ticketID, {
      status: "Closed",
      comments: comment,
    });
  }

  submitComnt(ticketID: string, comment?: string): Observable<any> {
    return this.http.put(this.TicketOrderAPIBaseURL + "/edit/" + ticketID, {
      //status: "Closed",
      comments: comment,
    });
  }

  callsyncticket(ticketID: string): Observable<any> {
    return this.http.put(this.TicketOrderAPIBaseURL + "/sync/" + ticketID, {});
  }

  getTrackDetails(
    invoice: any
  ): Observable<any> {
    return this.http.put<any>(
      this.TicketOrderInvoiceAPIBaseURL + "/gettrackDetails/", invoice
    );
  }

  getInvoiceDetails(
    invoiceno: any
  ): Observable<ORDERINVOICE.OrderInvoice> {
    return this.http.get<ORDERINVOICE.OrderInvoice>(
      this.TicketOrderInvoiceAPIBaseURL + "/getinvoicedetails/" + invoiceno
    );
  }

  confirmRefund(
    id: any
  ): Observable<ORDERINVOICE.RefundDetails> {
    return this.http.get<ORDERINVOICE.RefundDetails>(
      this.TicketOrderInvoiceAPIBaseURL + "/confirmRefund/" + id
    );
  }
}
