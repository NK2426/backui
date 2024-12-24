import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { INVOICE } from '../../../models/invoice';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  selector: 'app-sales-invoice-management',
  templateUrl: './sales-invoice-management.component.html',
  styleUrls: ['./sales-invoice-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class SalesInvoiceManagementComponent implements OnInit {


  invoiceDetails!: INVOICE.InvoiceDetail[];
  invoicePaginate!: INVOICE.InvoicePaginate;
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  title = 'Sales Invoice'
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 20;
  pageSizes = [ 20, 40, 60, 80,100];

  constructor(private invoiceService: InvoiceService, private toast: ToastService, private utlis: UtilsService,private cd:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.invoiceList();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.invoiceList();
  }

  invoiceList(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.invoiceService.getAllInvoice(params)
      .subscribe({
        next: invoices => {
          this.invoiceDetails = invoices.datas;
          this.count = invoices.totalItems || 0;
          if (invoices.totalItems)
            this.count = invoices.totalItems;
            this.cd.detectChanges()
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

  numberFormat(num: any) {
    return this.utlis.numberFormat(num);
  }

}
