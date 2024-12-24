import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';

import { environment } from 'src/environments/environment';
import { DatePicker } from '../../../models/datepicker';
import { INVOICE } from '../../../models/invoice';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  selector: 'app-awbdetails',
  templateUrl: './awbdetails.component.html',
  styleUrls: ['./awbdetails.component.scss']
})
export class AwbdetailsComponent implements OnInit {
  invoiceDetails!: INVOICE.AWBDetail[];
  invoicePaginate!: INVOICE.InvoicePaginate;
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  title = 'AWB Details';
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 20;
  pageSizes = [20, 30, 50, 100];
  reportUrl = environment.CATALOG_URL;
  reportName = '';

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
    private invoiceService: InvoiceService,
    private toast: ToastService,
    private calendar: NgbCalendar,
    private utils: UtilsService,
    private config: NgbDatepickerConfig,
    public formatter: NgbDateParserFormatter
  ) {
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
    this.invoiceList();
  }

  invoiceList(): void {
    const genericParams = this.utils.getRequestParams(this.search, this.page, this.pageSize);
    const calendarParams = this.getCalendarParams(this.formattedNgbFrom, this.formattedNgbTo);
    const params = { ...genericParams, ...calendarParams };
    this.invoiceService.getAWBDetails(params).subscribe({
      next: (invoices) => {
        this.invoiceDetails = invoices.datas;
        if (invoices.totalItems) this.count = invoices.totalItems;
      },
      error: (error) => {
        this.toast.failure('Error getting the invoice.. Please Try again!!');
      }
    });
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.invoiceList();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.invoiceList();
  }

  numberFormat(num: any) {
    return this.utils.numberFormat(num);
  }

  downloadInvoice() {
    const genericParams = this.utils.getRequestParams(this.search, 0, 0);
    const calendarParams = this.getCalendarParams(this.formattedNgbFrom, this.formattedNgbTo);
    //const params = { ...genericParams, ...calendarParams };
    this.invoiceService.getxlAWBDetails(calendarParams).subscribe({
      next: (invoices: INVOICE.ReportsResponse) => {
        this.reportName = invoices.data.filename;
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = this.reportUrl + this.reportName;
        link.target = '_blank';
        //link.download = path;
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
      error: (error) => {
        this.toast.failure('Error getting the invoice.. Please Try again!!');
      }
    });
  }

  ///////////////////Date PICKER CHANGES///////////////////////////////
  changeQuickDatePicker(event: DatePicker.QuickDatePicker) {
    this.chartToDate = event.value as string;
    if (event.displayName?.indexOf('Last') !== -1) {
      this.formattedNgbFrom = this.chartToDate;
      this.formattedNgbTo = this.utils.getAPIDateFormat(new Date());
      this.ngbFromDate = this.calendar.getToday();
      this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', -7);
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

    this.invoiceList();
  }

  onDateSelection(date: NgbDate) {
    if (!this.ngbFromDate && !this.ngbToDate) {
      this.ngbFromDate = date;
    } else if (this.ngbFromDate && !this.ngbToDate && date.after(this.ngbFromDate)) {
      this.ngbToDate = date;
      this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
      this.invoiceList();
    } else {
      this.ngbToDate = null;
      this.ngbFromDate = date;
      this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
      this.formattedNgbTo = this.formattedNgbFrom;
      this.invoiceList();
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

  getLength(InvoiceDetail: INVOICE.AWBDetail) {
    let dimension = InvoiceDetail.dimentions.split('*');
    return dimension[0];
  }

  getBreadth(InvoiceDetail: INVOICE.AWBDetail) {
    let dimension = InvoiceDetail.dimentions.split('*');
    return dimension[1];
  }

  getWidth(InvoiceDetail: INVOICE.AWBDetail) {
    let dimension = InvoiceDetail.dimentions.split('*');
    return dimension[2];
  }
}
