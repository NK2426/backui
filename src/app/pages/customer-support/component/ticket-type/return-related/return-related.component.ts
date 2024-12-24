import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "../../../../../_helpers/toast.service";
import { UtilsService } from "../../../../../_helpers/utils.service";
import { TICKET } from "../../../models/ticket";
import { ORDERDETAIL } from "../../../models/order-detail";
import { ORDERINVOICE } from "../../../models/order-invoice";
import { USER } from "../../../models/user";
import { TicketOrderInvoiceService } from "../../../services/ticketorderinvoice.service";
import { TicketsService } from "../../../services/tickets.service";

@Component({
  selector: "app-return-related",
  templateUrl: "./return-related.component.html",
  styleUrls: ["./return-related.component.scss"],
})
export class ReturnRelatedComponent implements OnInit {
  ticketDetail!: TICKET.TicketDetail;
  ticketOrder!: ORDERDETAIL.OrderDetails;
  ticketInvoice!: ORDERINVOICE.OrderInvoiceDetails;
  currentOrderID!: string;
  currentTicketID!: string;
  selectedInvoice!: string;
  comment = "";
  currentImagePath = '';
  page = 1;
  pageSize = 10;
  invoices!: ORDERINVOICE.OrderInvoiceDetails[];
  refunds!: ORDERINVOICE.RefundDetails[];
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
    this.list();
  }
  list(): void {
    this.currentTicketID = this.route.snapshot.paramMap.get(
      "ticketID"
    ) as string;
    this.currentOrderID = this.route.snapshot.paramMap.get(
      "orderitem_uuid"
    ) as string;
    if (this.currentTicketID) {
      this.getTicketDetail(this.currentTicketID);
    }
    if (this.currentOrderID) {
      this.getTicketOrder(this.currentOrderID);
      //this.getTicketInvoice(this.currentOrderID);
    }
  }

  getTicketDetail(ticketID: string) {
    this.ticketService.getTicketDetailById(ticketID).subscribe({
      next: (ticketDetail) => {
        this.ticketDetail = ticketDetail.data;
        this.tktcomments = ticketDetail.data.ticketcomments;
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

  getTicketOrder(orderID: string) {
    this.ticketOrderInvoicService.returnTicketDetailOrder(orderID).subscribe({
      next: (ticketOrder) => {
        // console.log(ticketOrder.data.returnitems);
        this.ticketOrder = ticketOrder.data;
        this.invoices = ticketOrder.data?.invoices;
        this.refunds = ticketOrder.data?.refunds;
        if (this.invoices.length) {
          this.ticketInvoice = this.invoices[0];
          this.selectedInvoice = this.ticketInvoice.awbnumber;
          this.changeInvoice(this.ticketInvoice);
          this.getTrackDetails();
        }
      },
      error: (error) => {
        this.toast.failure("Error, Try Again.!");
      },
    });
  }

  acceptitem(returnitemuuid: string) {
    if (confirm("Are you sure you want to continue to accept this item?")) {
      this.ticketOrderInvoicService.acceptreturnItem(returnitemuuid).subscribe({
        next: (ticketOrder) => {
          this.list();
          this.toast.success("Successfully Accept this item");
        },
        error: (error) => {
          this.toast.failure("Error, Try Again.!");
        },
      });
    }
  }
  rejectitem(returnitemuuid: string) {
    if (confirm("Are you sure you want to continue to reject this item?")) {
      this.ticketOrderInvoicService.rejectretrunitem(returnitemuuid).subscribe({
        next: (ticketOrder) => {
          this.list();
          this.toast.success("Successfully Reject this item");
        },
        error: (error) => {
          this.toast.failure("Error, Try Again.!");
        },
      });
    }
  }

  getTicketInvoice(orderID: string) {
    this.ticketOrderInvoicService.getTicketDetailInvoice(orderID).subscribe({
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
            this.router.navigate(["/app/ticket-type/returntickets"]);
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
          // this.toast.success("Action successful");
        },
        error: (error) => {
          this.toast.failure("Error, Try Again.!");
        },
      });
  }

  changeInvoice(invoice: ORDERINVOICE.OrderInvoiceDetails) {
    this.ticketInvoice = invoice;
  }

  confirmRefund(id: any) {
    if (id) {
      this.ticketOrderInvoicService
        .confirmRefund(id)
        .subscribe({
          next: (resp) => {
            console.log(resp)
            this.toast.success("Refund Confirmed");
            this.ngOnInit();
          },
          error: (error) => {
            this.toast.failure("Error, Try Again.!");
          },
        });
    }

  }


  getTrackDetails() {
    this.ticketOrderInvoicService
      .getTrackDetails(this.ticketInvoice)
      .subscribe({
        next: (trackdetails) => {
          this.trackdetails = trackdetails.data
          //console.log(trackdetails)
          this.toast.success("Action successful");
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
