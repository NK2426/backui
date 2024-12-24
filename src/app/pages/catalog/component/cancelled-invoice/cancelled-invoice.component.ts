import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';

import {  SortableDirective,SortEvent } from 'src/app/_helpers/directives/advance-sortable.directive';
import { DatePicker } from 'src/app/pages/finance/models/datepicker';
import { environment } from 'src/environments/environment';
import { INVOICE } from 'src/app/pages/warehouse/models/invoice';
import { InvoiceService } from 'src/app/pages/warehouse/services/invoice.service';

@Component({
  selector: 'app-cancelled-invoice',
  templateUrl: './cancelled-invoice.component.html',
  styleUrls: ['./cancelled-invoice.component.scss'],
})
export class CancelledInvoiceComponent implements OnInit {
  invoiceDetails!: INVOICE.InvoiceDetail[];
  selectedInvoice!: INVOICE.InvoiceDetail;
  currentInvoiceOrderItems!: INVOICE.Invoiceorderitem[];
  invoicePaginate!: INVOICE.InvoicePaginate;
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  title = 'Cancelled Invoice';
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 20;
  pageSizes = [20, 30, 50, 100];
  reportUrl = environment.PDF_BASE_URL;
  reportName = '';
  selectedColumn = ''; selectedDirection = '';

  @ViewChildren(SortableDirective) headers!: QueryList<SortableDirective>;


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

  // advanced table

  hideme: boolean[] = [];
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
    const genericParams = this.utils.getsortRequestParams(this.search, this.selectedColumn, this.selectedDirection, this.page, this.pageSize);
    const calendarParams = this.getCalendarParams(this.formattedNgbFrom, this.formattedNgbTo);
    const params = { ...genericParams, ...calendarParams };
    this.invoiceService.getCancelledInvoice(params).subscribe({
      next: (invoices) => {
        this.invoiceDetails = invoices.datas;
        if (invoices.totalItems)   this.count = invoices.totalItems;
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

  // numberFormat(num: any) {
  //   return this.utils.numberFormat(num);
  // }

  downloadInvoice(type: string) {
    const calendarParams = this.getCalendarParams(this.formattedNgbFrom, this.formattedNgbTo);
    this.invoiceService.downloadInvoiceReport(type, calendarParams).subscribe({
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
  ///////////////////Date PICKER CHANGES END///////////////////////////////

  /// ADVANCED TABLE ///
  changeValue(i: number) {
    this.hideme[i] = !this.hideme[i];
    this.selectedInvoice = this.invoiceDetails[i];
    this.currentInvoiceOrderItems = this.selectedInvoice.invoiceorderitems as INVOICE.Invoiceorderitem[];
  }

  numberFormat(num: any) {
    if (num) {
      var ans = num.toLocaleString('en-IN', { currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return ans;
    } else return 0;
  }
  onSort({ column, direction }: SortEvent | any) {
    // // resetting other headers
    // this.headers.forEach((header) => {
    //   if (header.sortable !== column) {
    //     header.direction = '';
    //   }
    // });
    // if (this.products) {
    //   this.products = this.sortProduct(this.products, column, direction);
    // }
    this.selectedColumn = column;
    this.selectedDirection = direction;
    this.invoiceList();
  }


}
