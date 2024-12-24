import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from "src/app/_helpers/toast.service";
import { UtilsService } from "src/app/_helpers/utils.service";
import { ORDERDETAIL } from "../../models/order-detail";
import { ORDERINVOICE } from "../../models/order-invoice";
import { TICKET } from "../../models/ticket";
import { TicketOrderInvoiceService } from "../../services/ticketorderinvoice.service";
import { TicketsService } from "../../services/tickets.service";
@Component({
  selector: "app-return-related",
  templateUrl: "./return-related.component.html",
  styleUrls: ["./return-related.component.scss"],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class ReturnRelatedComponent implements OnInit {
  ticketDetail!: TICKET.TicketDetail;
  ticketOrder!: ORDERDETAIL.OrderDetails;
  ticketInvoice!: ORDERINVOICE.OrderInvoiceDetails;
  currentOrderID!: string;
  currentTicketID!: string;
  selectedInvoice!: string;
  comment = "";
  page = 1;
  pageSize = 10;
  invoices!: ORDERINVOICE.OrderInvoiceDetails[];
  trackdetails!: ORDERINVOICE.TrackDetails;
  constructor(
    private ticketOrderInvoicService: TicketOrderInvoiceService,
    private ticketService: TicketsService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private utlis: UtilsService
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
        this.cdr.detectChanges();

      },
      error: (error) => {
        this.toast.failure("Error, Try Again.!");
      },
    });
  }

  getTicketOrder(orderID: string) {
    this.ticketOrderInvoicService.returnTicketDetailOrder(orderID).subscribe({
      next: (ticketOrder) => {
        //console.log(ticketOrder.data.returnitems);
        this.ticketOrder = ticketOrder.data;
        this.invoices = ticketOrder.data?.invoices;
        if (this.invoices.length) {
          this.ticketInvoice = this.invoices[0];
          this.selectedInvoice = this.ticketInvoice.awbnumber;
          this.cdr.detectChanges();
          this.changeInvoice(this.ticketInvoice);
          // this.getTrackDetails();
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

  getTrackDetails() {
    this.ticketOrderInvoicService
      .getTrackDetails(this.ticketInvoice)
      .subscribe({
        next: (trackdetails) => {
          this.trackdetails = trackdetails.data;
          this.cdr.detectChanges();
          ////console.log(trackdetails)
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
          this.ticketInvoice = invdetails.data;
          this.cdr.detectChanges();
        },
        error: (error) => {
          //this.toast.failure("Error, Try Again.!");
        },
      });
  }


}
