import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Ordering } from '../../../models/order';
import { OrderingService } from '../../../services/ordering.service';

export class SalesOrderFilter {
  displayName?: string;
  value?: string;
}
@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerOrdersComponent implements OnInit {
  customerOrder?: Ordering.CustomerOrder[];
  packagepaginate?: Ordering.OrdersPaginate = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  orderStatus = '';
  title = 'Orders';
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 20;
  pageSizes = [ 20, 30, 50, 100];

  salesOrderFilter!: SalesOrderFilter[];

  /*Ngb Date Picker Range*/
  hoveredDate!: NgbDate | null;
  ngbFromDate!: NgbDate | null;
  formattedNgbFrom!: string;
  ngbToDate!: NgbDate | null;
  formattedNgbTo!: string;

  baseurl!: string;

  constructor(
    private orderingservice: OrderingService,
    private cd: ChangeDetectorRef,
    private calendar: NgbCalendar,
    private config: NgbDatepickerConfig,
    public formatter: NgbDateParserFormatter,
    private utils: UtilsService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private utlis: UtilsService,
    private env: EnvService
  ) {
    this.config.maxDate = this.calendar.getToday();
    this.config.outsideDays = 'collapsed';
  }

  ngOnInit(): void {
    this.orderStatus = this.route.snapshot.paramMap.get('orderstatus') || '';
    this.salesOrderFilter = [
      { displayName: 'All Order', value: '' },
      { displayName: 'Confirmed', value: 'confirmed' },
      { displayName: 'Cancelled', value: 'cancelled' },
      { displayName: 'Shipped', value: 'shipped' },
      { displayName: 'Packed', value: 'packed' },
      { displayName: 'Delivered', value: 'delivered' },
      { displayName: 'Returned', value: 'returned' }
    ];
    this.orderStatus = this.salesOrderFilter[0].value as string;
    this.title = `${this.orderStatus}  ${this.title}`;
    this.ngbFromDate = this.calendar.getToday();
    this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
    this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
    this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
    this.list();
    this.baseurl = this.env.SITE_URL;
  }
  getRequestParams(search: string, page: number, pageSize: number,status:string): any {
    let params = { 'search': '', 'page': page, 'size': pageSize,'status':'' };
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

  list(): void {
    const params = this.getRequestParams(this.search, this.page, this.pageSize,this.orderStatus);
    const additionalParams = this.getAdditionalRequestParams(this.formattedNgbFrom, this.formattedNgbTo);
    this.orderingservice.getCustomerOrdersForPicking({ ...params, ...additionalParams }, this.orderStatus).subscribe({
      next: (customerOrders) => {
        this.customerOrder = customerOrders.datas;
        if (customerOrders.totalItems) this.count = customerOrders.totalItems || 0;
        this.cd.detectChanges();
      },
      error: (error) => {
        this.toast.failure('Error getting the orders.. Please Try again!!');
      }
    });
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  onDropdownChange(event: any) {
    this.orderStatus = event.value as string;
    this.list();
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }

  onDateSelection(date: NgbDate) {
    if (!this.ngbFromDate && !this.ngbToDate) {
      this.ngbFromDate = date;
    } else if (this.ngbFromDate && !this.ngbToDate && date.after(this.ngbFromDate)) {
      this.ngbToDate = date;
      this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
      this.list();
    } else {
      this.ngbToDate = null;
      this.ngbFromDate = date;
      this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
      this.formattedNgbTo= null;
      this.list();
    }
  }

  getCancelledItemsCount(order: Ordering.Orderitem[]) {
    return order.reduce(function (n: number, val: Ordering.Orderitem) {
      return n + +(val.status === 'Cancel'); // changed with respective Status
    }, 0);
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

  getAdditionalRequestParams(fromdate: string, todate: string): any {
    let params = {} as any;
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;

    return params;
  }

  numberFormat(num: any) {
    return this.utils.numberFormat(num);
  }

  download() {
    const params = this.utlis.getRequestParams(this.search, 0, 0);
    const additionalParams = this.getAdditionalRequestParams(this.formattedNgbFrom, this.formattedNgbTo);
    this.orderingservice.download({ ...params, ...additionalParams }, this.orderStatus).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = this.baseurl + '/orders.xlsx';
          link.target = 'new';
          //link.download = path;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        this.toast.failure('Error while download file ');
      }
    });
  }
}
