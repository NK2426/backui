import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "src/app/_helpers/toast.service";
import { UtilsService } from "src/app/_helpers/utils.service";
import { TICKET } from "../../../models/ticket";
import { ORDERDETAIL } from "../../../models/order-detail";
import { ORDERINVOICE } from "../../../models/order-invoice";
import { USER } from "../../../models/user";
import { TicketOrderInvoiceService } from "../../../services/ticketorderinvoice.service";
import { TicketsService } from "../../../services/tickets.service";


@Component({
  selector: "app-ticket-type-detail",
  templateUrl: "./ticket-type-detail.component.html",
  styleUrls: ["./ticket-type-detail.component.scss"],
})
export class TicketTypeDetailComponent implements OnInit {
  ticketDetail!: TICKET.TicketDetail;
  ticketOrder!: ORDERDETAIL.OrderDetails;
  ticketInvoice!: ORDERINVOICE.OrderInvoiceDetails;
  invoices!: ORDERINVOICE.OrderInvoiceDetails[];
  currentOrderItemUUID!: string;
  currentTicketID!: string;
  comment = "";
  page = 1;
  pageSize = 10;
  currentImagePath = '';
  selectedInvoice!: string;
  trackdetails!: ORDERINVOICE.TrackDetails;
  tktcomments!: TICKET.Comments[];
  csteam!: Partial<USER.UserDetail[]>
  constructor(
    private ticketOrderInvoicService: TicketOrderInvoiceService,
    private ticketService: TicketsService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private utlis: UtilsService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.currentTicketID = this.route.snapshot.paramMap.get(
      "ticketID"
    ) as string;
    this.currentOrderItemUUID = this.route.snapshot.paramMap.get(
      "orderitem_uuid"
    ) as string;
    if (this.currentTicketID) {
      this.getTicketDetail(this.currentTicketID);
    }
    if (this.currentOrderItemUUID) {
      this.getTicketOrder(this.currentOrderItemUUID);
      this.getTicketInvoice(this.currentOrderItemUUID);
    }
  }

  getTicketDetail(ticketID: string) {
    this.ticketService.getTicketDetailById(ticketID).subscribe({
      next: (ticketDetail) => {
        this.ticketDetail = ticketDetail.data;
        this.tktcomments = ticketDetail.data.ticketcomments;
        if (this.ticketDetail) this.viewReturnOrder(this.ticketDetail.orderID)
      },
      error: (error) => {
        this.toast.failure("Error, Try Again.!");
      },
    });
    this.ticketService.getcsteam().subscribe({
      next: (resp) => {
        this.csteam = resp;
      },
      error: (error) => {
        //this.toast.failure("Error, Try Again.!");
      },
    });
  }

  mapName(idToFind: number) {
    const element = this.csteam.find((item: any) => item.uid === idToFind);
    if (element) {
      return element.name;
    } else {
      return '--';
    }
  }

  viewReturnOrder(orderID: string) {
    this.ticketOrderInvoicService.returnTicketDetailOrder(orderID).subscribe({
      next: (ticketOrder) => {
        this.invoices = ticketOrder.data?.invoices;
        if (this.invoices.length) {
          this.ticketInvoice = this.invoices[0];
          this.selectedInvoice = this.ticketInvoice.awbnumber;
          this.changeInvoice(this.ticketInvoice);
        }
      },
      error: (error) => {
        this.toast.failure("Error, Try Again.!");
      },
    });
  }

  getTicketOrder(orderItemUUID: string) {
    this.ticketOrderInvoicService
      .getTicketDetailOrder(orderItemUUID)
      .subscribe({
        next: (ticketOrder) => {
          this.ticketOrder = ticketOrder.data;
        },
        error: (error) => {
          this.toast.failure("Error, Try Again.!");
        },
      });
  }
  changeInvoice(invoice: ORDERINVOICE.OrderInvoiceDetails) {
    this.ticketInvoice = invoice;
    this.getTrackDetails();
  }

  getTrackDetails() {
    this.ticketOrderInvoicService
      .getTrackDetails(this.ticketInvoice)
      .subscribe({
        next: (trackdetails) => {
          this.trackdetails = trackdetails.data
        },
        error: (error) => {
          this.toast.failure("Error, Try Again.!");
        },
      });

    this.ticketOrderInvoicService
      .getInvoiceDetails(this.ticketInvoice.invoiceno)
      .subscribe({
        next: (invdetails) => {
          this.ticketInvoice = invdetails.data
        },
        error: (error) => {
          //this.toast.failure("Error, Try Again.!");
        },
      });
  }

  getTicketInvoice(orderItemUUID: string) {
    this.ticketOrderInvoicService
      .getTicketDetailInvoice(orderItemUUID)
      .subscribe({
        next: (ticketInvoice) => {
          this.ticketInvoice = ticketInvoice.data;
        },
        error: (error) => {
          this.toast.failure("Error, Try Again.!");
        },
      });
  }

  submitcmnt() {
    this.ticketOrderInvoicService
      .submitComnt(this.currentTicketID, this.comment)
      .subscribe({
        next: (ticketComments) => {
          //this.router.navigate(["/app/ticket-type/returntickets"]);
          this.tktcomments = ticketComments.data
          this.comment = "";
          this.toast.success("Comments Added.");
        },
        error: (error) => {
          this.comment = "";
          this.toast.failure("Error, Try Again.!");
        },
      });
  }

  cancelOrRefundOrderTickets() {
    if (confirm("Are you sure you want to close this ticket?")) {
      this.ticketOrderInvoicService
        .initiateCancelOrRefund(this.currentTicketID, this.comment)
        .subscribe({
          next: (ticketInvoice) => {
            this.router.navigate(["/app/ticket-type/ordertickets"]);
            this.toast.success("Ticket Closed Successfully.");
          },
          error: (error) => {
            this.comment = "";
            this.toast.failure("Error, Try Again.!");
          },
        });
    }
  }

  callsync() {
    this.ticketOrderInvoicService
      .callsyncticket(this.currentTicketID)
      .subscribe({
        next: (ticketInvoice) => {
        },
        error: (error) => {
          this.toast.failure("Error, Try Again.!");
        },
      });
  }

  openImage(content: any, imagePath: string) {
    this.modalService.open(content, { size: "lg" });
    this.currentImagePath = imagePath;
  }

  downloadUrl(url: string, fileName = new Date().toISOString()) {
    const a: any = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  };
}
