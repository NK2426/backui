import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig, NgbDatepickerModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { UtilsService } from "src/app/_helpers/utils.service";
import { DatePicker } from "../../models/datepicker";
import { TICKET } from "../../models/ticket";
import { TicketsService } from "../../services/tickets.service";

@Component({
  selector: "app-ticket-status",
  templateUrl: "./ticket-status.component.html",
  styleUrls: ["./ticket-status.component.scss"],
  standalone: true,
  imports: [FormsModule,
    NgbPaginationModule,
    NgbDatepickerModule, CommonModule, RouterModule]
})
export class TicketStatusComponent implements OnInit {
  tickets?: TICKET.TicketDetail[];
  userPagination!: TICKET.TicketsPaginated;
  currentIndex = -1;
  ticketStatus!: string | null;
  // Pagination and search config
  search = "";
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  ticketStatusOption: any = [];
  currentStatus = '';
  //Calendar Filter
  quickDatePickerInput!: DatePicker.QuickDatePicker[];
  selectedDate!: string;
  previousSelection!: number;
  chartFromDate!: string;
  chartToDate!: string;
  ngbFromDate!: NgbDate | null;
  formattedNgbFrom!: string;
  ngbToDate!: NgbDate | null;
  formattedNgbTo!: string;
  hoveredDate!: NgbDate | null;

  constructor(
    private ticketsService: TicketsService,
    private router: Router,
    private route: ActivatedRoute,
    private utils: UtilsService,
    private calendar: NgbCalendar,
    private cdr: ChangeDetectorRef,
    private config: NgbDatepickerConfig,
    public formatter: NgbDateParserFormatter
  ) {
    this.config.maxDate = this.calendar.getToday();
    this.config.outsideDays = 'collapsed';
  }

  ngOnInit(): void {
    this.ticketStatus = this.route.snapshot.paramMap.get("ticket-status");
    this.quickDatePickerInput = [
      { displayName: 'Today', value: this.utils.getAPIDateFormat(this.utils.substractDays(new Date(), 0)) },
      { displayName: 'Yesterday', value: this.utils.getAPIDateFormat(this.utils.substractDays(new Date(), 1)) },
      { displayName: 'Last 7 Days', value: this.utils.getAPIDateFormat(this.utils.substractDays(new Date(), 7)) }
    ];
    this.chartFromDate = this.utils.getAPIDateFormat(new Date());
    this.chartToDate = this.utils.getAPIDateFormat(new Date());
    this.selectedDate = this.quickDatePickerInput[0].value as string;

    this.ngbFromDate = this.calendar.getToday();
    this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
    this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
    this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
    if (this.ticketStatus) {
      this.getTicketByStatus(this.ticketStatus);
      this.ticketStatusOption = [];
      this.currentStatus = '';
    } else {
      this.ticketStatusOption = [
        { displayName: 'All', value: '' },
        { displayName: 'Open', value: 'Open' },
        { displayName: 'Closed', value: 'Closed' }
      ];
      this.getTicketsList();
    }
  }

  changeTicketStatus(status: string) {
    this.getTicketsList();
  }

  /* Get All tickets with all status */
  getTicketsList(): void {
    const genericParams = this.utils.getRequestParams(
      this.search,
      this.page,
      this.pageSize
    );
    const calendarParams = this.getCalendarParams(this.formattedNgbFrom, this.formattedNgbTo);
    const params = { ...genericParams, ...calendarParams };
    this.ticketsService.getAllTicket(params, this.currentStatus).subscribe({
      next: (tickets) => {
        this.tickets = tickets.datas;
        this.cdr.detectChanges();
        if (tickets.totalItems) this.count = tickets.totalItems;
      },
      error: (error) => {
      },
    });
  }

  /*Get ticket by its status*/
  getTicketByStatus(status: string): void {
    const genericParams = this.utils.getRequestParams(
      this.search,
      this.page,
      this.pageSize
    );
    const calendarParams = this.getCalendarParams(this.formattedNgbFrom, this.formattedNgbTo);
    const params = { ...genericParams, ...calendarParams };
    this.ticketsService.getTicketByStatus(params, status).subscribe({
      next: (tickets) => {
        this.tickets = tickets.datas;
        this.cdr.detectChanges();
        if (tickets.totalItems) this.count = tickets.totalItems;
      },
      error: (error) => {
      },
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getTicketsList();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getTicketsList();
  }

  getRoute() {
    if (this.ticketStatus) {
      return "../../ticket-type/ordertickets/";
    } else {
      return "../ticket-type/ordertickets/";
    }
  }

  // date picker changes 

  changeQuickDatePicker(event: DatePicker.QuickDatePicker) {
    this.chartToDate = event.value as string;
    if (event.displayName?.indexOf('Last') !== -1) {
      this.formattedNgbFrom = this.chartToDate;
      this.formattedNgbTo = this.utils.getAPIDateFormat(new Date());
      this.ngbToDate = this.calendar.getToday();
      this.ngbFromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -7);
    } else {
      this.formattedNgbFrom = this.chartToDate;
      this.formattedNgbTo = this.chartToDate;
      if (event.displayName?.indexOf('Yesterday') !== -1) {
        this.ngbFromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -1);
        this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', -1);
      } else {
        this.ngbFromDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
        this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
      }
    }

    this.invokeAPI();
  }

  onDateSelection(date: NgbDate) {
    if (!this.ngbFromDate && !this.ngbToDate) {
      this.ngbFromDate = date;
    } else if (this.ngbFromDate && !this.ngbToDate && date.after(this.ngbFromDate)) {
      this.ngbToDate = date;
      this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
      this.invokeAPI();
    } else {
      this.ngbToDate = null;
      this.ngbFromDate = date;
      this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
      this.invokeAPI();
    }
  }

  isHovered(date: NgbDate) {
    return this.ngbFromDate && !this.ngbToDate && this.hoveredDate && date.after(this.ngbFromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.ngbToDate && date.after(this.ngbFromDate) && date.before(this.ngbToDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.ngbFromDate) || (this.ngbToDate && date.equals(this.ngbToDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  getCalendarParams(fromdate: string, todate: string): any {
    let params = {} as any;
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;

    return params;
  }
  ///////////////////Date PICKER CHANGES END///////////////////////////////

  invokeAPI() {
    if (this.ticketStatus) {
      this.getTicketByStatus(this.ticketStatus);
    } else {
      this.getTicketsList();
    }
  }
}
