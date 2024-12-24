import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { ORDER } from '../../../models/order';
import { EnvService } from '../../../services/env.service';
import { InvoiceService } from '../../../services/invoice.service';


export class SalesOrderFilter {
  displayName?: string;
  value?: string;
  type?: string;
}
@Component({
  selector: 'app-skulevel-orders-po',
  templateUrl: './skulevel-orders-po.component.html',
  styleUrls: ['./skulevel-orders-po.component.scss']
})
export class SkulevelOrdersPoComponent implements OnInit {
  skulevelcustomerOrder?: ORDER.SkulevelCustomerOrder[] = [];
  packagepaginate?: ORDER.OrdersPaginate = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  orderStatus = '';
  title = 'SKU Level Orders With PO';
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 20;
  pageSizes = [20, 30, 50, 100];

  salesOrderFilter!: SalesOrderFilter[];

  /*Ngb Date Picker Range*/
  hoveredDate!: NgbDate | null;
  ngbFromDate!: NgbDate | null;
  formattedNgbFrom!: string;
  ngbToDate!: NgbDate | null;
  formattedNgbTo!: string;

  constructor(
    private invoiceservice: InvoiceService,
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
      { displayName: 'All Order', value: '', type: 'Status' },
      // { displayName: 'Create', value: 'Create', type: 'Status' },
      { displayName: 'Confirmed', value: 'Confirmed', type: 'Status' },
      // { displayName: 'Pending', value: 'Pending', type: 'Status' },
      { displayName: 'Cancelled', value: 'Cancel', type: 'Status' }
      // { displayName: 'Shipped', value: 'shipped', type: 'Status' },
      // { displayName: 'Packed', value: 'packed', type: 'Status' },
      // { displayName: 'Delivered', value: 'delivered', type: 'Status' },
      // { displayName: 'Returned', value: 'returned', type: 'Status' },
      // { displayName: 'Product Orders', value: 'productlevelorders', type: 'Level' },
      // { displayName: 'Current Pack Inventory', value: 'currentpackinventory', type: 'Level' }
    ];
    this.orderStatus = this.salesOrderFilter[0].value as string;
    this.title = `${this.orderStatus}  ${this.title}`;
    this.ngbFromDate = this.calendar.getToday();
    this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
    this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
    this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize);
    const additionalParams = this.getAdditionalRequestParams(this.formattedNgbFrom, this.formattedNgbTo, this.orderStatus);
    this.invoiceservice.getSkulevelOrderspo({ ...params, ...additionalParams }).subscribe({
      next: (customerOrders) => {
        this.skulevelcustomerOrder = customerOrders.datas;
        if (customerOrders.totalItems) this.count = customerOrders.totalItems;
      },
      error: (err) => {
        this.toast.failure(err?.error?.message);
      }
    });
    // console.log(this.skulevelcustomerOrder);
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
      this.formattedNgbTo = this.formattedNgbFrom;
      this.list();
    }
  }

  getCancelledItemsCount(order: ORDER.Orderitem[]) {
    return order.reduce(function (n: number, val: ORDER.Orderitem) {
      return n + +(val.status === 'Cancel'); // need to replace with respective Status
    }, 0);
  }

  getShipStatus(order: ORDER.Orderitem[]) {
    let deliverstatus = order.filter((x) => x.status == 'Delivered');
    if (deliverstatus.length > 0) return 'Delivered';
    else {
      let dispatchstatus = order.filter((x) => x.status == 'Dispatch');
      if (dispatchstatus.length > 0) return 'Dispatch';
      else {
        let invstatus = order.filter((x) => x.status == 'Invoice');
        if (invstatus.length > 0) return 'Invoice';
        else {
          let packstatus = order.filter((x) => x.status == 'Packed');
          if (packstatus.length > 0) return 'Packed';
          else {
            let scanstatus = order.filter((x) => x.status == 'Scaned');
            if (scanstatus.length > 0) return 'Scaned';
            else {
              let pickstatus = order.filter((x) => x.status == 'Picked');
              if (pickstatus.length > 0) return 'Picked';
              else return '--';
            }
          }
        }
      }
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

  getAdditionalRequestParams(fromdate: string, todate: string, status: string): any {
    let params = {} as any;
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;
    if (status) params['status'] = status;
    return params;
  }

  numberFormat(num: any) {
    return this.utils.numberFormat(num);
  }

  download() {
    const params = this.utlis.getRequestParams(this.search, 0, 0);
    const additionalParams = this.getAdditionalRequestParams(this.formattedNgbFrom, this.formattedNgbTo, this.orderStatus);

    this.invoiceservice.downloadSkulevelOrderspo({ ...params, ...additionalParams }).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = this.env.CATALOG_URL + resp.data.filename;
          link.target = '_blank';
          //link.download = path;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      },
      error: (err) => {
        this.toast.failure('Error while download file : ' + err.error.message);
      }
    });
  }
}
