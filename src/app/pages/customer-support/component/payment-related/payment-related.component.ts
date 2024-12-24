import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { TICKET } from '../../models/ticket';
import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'app-payment-related',
  templateUrl: './payment-related.component.html',
  styleUrls: ['./payment-related.component.scss'],
  standalone: true,
  imports: [FormsModule,
    NgbPaginationModule,
    NgbDatepickerModule, CommonModule, RouterModule]
})
export class PaymentRelatedComponent implements OnInit {



  tickets?: TICKET.TicketDetail[];
  userPagination!: TICKET.TicketsPaginated;
  currentIndex = -1;
  ticketType = 'Return';
  // Pagination and search config
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  constructor(private ticketsService: TicketsService, private utlis: UtilsService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getTicketsListByType();
  }


  /* Get All tickets with all status */
  getTicketsListByType(): void {
    let generalParams = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    let ticketsParam = this.getTicketRequestParams(this.ticketType)
    let params = { ...generalParams, ...ticketsParam }
    this.ticketsService.getAllTicket(params)
      .subscribe({
        next: tickets => {
          this.tickets = tickets.datas;
          this.cdr.detectChanges();
          if (tickets.totalItems)
            this.count = tickets.totalItems;
        }, error: error => {
        }
      })
  }



  handlePageChange(event: number): void {
    this.page = event;
    this.getTicketsListByType();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getTicketsListByType();
  }

  getTicketRequestParams(type: string): any {
    let params = { 'type': '' };
    if (type)
      params['type'] = type;
    return params;
  }
}
