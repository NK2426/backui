import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { DatePicker } from 'src/app/pages/customer-support/models/datepicker';
import { INVOICE } from 'src/app/pages/warehouse/models/invoice';
import { InvoiceService } from 'src/app/pages/warehouse/services/invoice.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class InvoiceComponent implements OnInit {


  invoiceDetails!: INVOICE.InvoiceDetail[];
  invoicePaginate!: INVOICE.InvoicePaginate;
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  title = 'Invoice'
  /// Paginate ////
  search = '';
   status= ''
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  reportUrl = environment.PDF_BASE_URL;
  reportName = '';
  selectedstatus = ''
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

  selectedColumn = ''; selectedDirection = '';

  constructor(private invoiceService: InvoiceService, private toast: ToastService, private cdr: ChangeDetectorRef, private calendar: NgbCalendar,
    private utils: UtilsService,
    private config: NgbDatepickerConfig,
    public formatter: NgbDateParserFormatter) {this.config.maxDate = this.calendar.getToday();
      this.config.outsideDays = 'collapsed'; }

  ngOnInit(): void {

    this.quickDatePickerInput = [
      { displayName: 'New Invoices', value: 'Create' },
      { displayName: 'Cancel Invoices', value: 'Cancel' },
      { displayName: 'Shipped Invoices', value: 'Shipped' },
      { displayName: 'All Invoices', value: '' },
      
    ];
    this.selectedstatus = this.quickDatePickerInput[0]?.value;
    this.chartFromDate = this.utils.getAPIDateFormat(new Date());
    this.chartToDate = this.utils.getAPIDateFormat(new Date());
    this.selectedDate = this.quickDatePickerInput[0].value as string;
    this.ngbFromDate = this.calendar.getToday();
    this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
    this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
    this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
    this.invoiceList();
  }
  getsortRequestParams(search: string, column: string, direction: string, page: number, pageSize: number,status:string): any {
    let params = { 'search': '', 'page': page, 'size': pageSize, orderby: '', order: '','status':'' };
    if (search)
      params['search'] = search;
    if (page)
      params['page'] = page - 1;
    if (pageSize)
      params['size'] = pageSize;
    if (status)
      params['status'] = status;

    return params;
  }
  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.invoiceList();
  }
  getCalendarParams(fromdate: string, todate: string): any {
    let params = {} as any;
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;

    return params;
  }
  invoiceList(): void {
    const genericParams = this.getsortRequestParams(this.search, this.selectedColumn, this.selectedDirection, this.page, this.pageSize,this.selectedstatus);
    const calendarParams = this.getCalendarParams(this.formattedNgbFrom, this.formattedNgbTo);
    const params = { ...genericParams, ...calendarParams };
    this.invoiceService.AllInvoice(params)
      .subscribe({
        next: invoices => {
          this.invoiceDetails = invoices.datas;
          if (invoices.totalItems)
            this.count = invoices.totalItems;
          this.cdr.detectChanges();
        }, error: error => {
          this.toast.failure("Error getting the invoice.. Please Try again!!");
        }
      })
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

  numberFormat(num: any) {
    if (num) {
      var ans = num.toLocaleString('en-IN', { currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return ans;
    } else return 0;
  }

  changeQuickStatus(e: any) {

    this.selectedstatus = e.value;
  

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
}