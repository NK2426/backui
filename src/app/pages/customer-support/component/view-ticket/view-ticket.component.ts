import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { TICKET } from '../../model/ticket';
import { TicketsService } from '../../services/tickets.service';


@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
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
