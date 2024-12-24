import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { TICKET } from '../../../models/ticket';
import { TicketsService } from '../../../services/tickets.service';


@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.scss']
})
export class ViewTicketComponent implements OnInit {


  ticket?: TICKET.TicketDetail;
  currentIndex = -1;
  ticketID!: string | null;
  // Pagination and search config
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  constructor(private ticketsService: TicketsService, private route: ActivatedRoute, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.ticketID = this.route.snapshot.paramMap.get('ticketID');
    if (this.ticketID) {
      this.getTicketByID();
    } else {
      this.toast.failure("Error getting ticket details");
    }
  }


  /* view ticket by id */
  getTicketByID(): void {
    this.ticketsService.getTicketDetailById(this.ticketID)
      .subscribe({
        next: ticket => {
          this.ticket = ticket.data;

        }, error: error => {
          this.toast.failure("Error, Try Again.!");
        }
      })
  }

  canShowTable() {
    return this.ticket && Object.keys(this.ticket).length;
  }


}
