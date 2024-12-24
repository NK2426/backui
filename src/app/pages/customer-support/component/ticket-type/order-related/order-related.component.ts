import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../../../_helpers/toast.service';
import { UtilsService } from '../../../../../_helpers/utils.service';
import { DatePicker } from '../../../models/datepicker';
import { TICKET } from '../../../models/ticket';
import { TicketsService } from '../../../services/tickets.service';

@Component({
  selector: 'app-order-related',
  templateUrl: './order-related.component.html',
  styleUrls: ['./order-related.component.scss']
})
export class OrderRelatedComponent implements OnInit {


  tickets?: TICKET.TicketDetail[];
  userPagination!: TICKET.TicketsPaginated;
  currentIndex = -1;
  ticketType = 'Order';
  // Pagination and search config
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

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
  constructor(private ticketsService: TicketsService, private toast: ToastService, private utils: UtilsService,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    public formatter: NgbDateParserFormatter) {
    this.config.maxDate = this.calendar.getToday();
    this.config.outsideDays = 'collapsed';
  }

  ngOnInit(): void {

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
    this.getTicketsListByType();

  }


  /* Get All tickets with all status */
  getTicketsListByType(): void {
    let generalParams = this.utils.getRequestParams(this.search, this.page, this.pageSize);
    let ticketsParam = this.getTicketRequestParams(this.ticketType)
    const calendarParams = this.getCalendarParams(this.formattedNgbFrom, this.formattedNgbTo);
    let params = { ...generalParams, ...ticketsParam, ...calendarParams }
    this.ticketsService.getAllTicket(params, 'open')
      .subscribe({
        next: tickets => {
          this.tickets = tickets.datas;
          if (tickets.totalItems)
            this.count = tickets.totalItems;
        }, error: error => {
          this.toast.failure("Error, Try Again.!");
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

    this.getTicketsListByType();
  }

  onDateSelection(date: NgbDate) {
    if (!this.ngbFromDate && !this.ngbToDate) {
      this.ngbFromDate = date;
    } else if (this.ngbFromDate && !this.ngbToDate && date.after(this.ngbFromDate)) {
      this.ngbToDate = date;
      this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
      this.getTicketsListByType();
    } else {
      this.ngbToDate = null;
      this.ngbFromDate = date;
      this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
      this.formattedNgbTo = this.formattedNgbFrom;
      this.getTicketsListByType();
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
}
