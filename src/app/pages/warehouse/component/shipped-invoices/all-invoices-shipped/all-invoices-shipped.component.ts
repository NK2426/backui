import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { INVOICE } from '../../../models/invoice';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  selector: 'app-all-invoices-shipped',
  templateUrl: './all-invoices-shipped.component.html',
  styleUrls: ['./all-invoices-shipped.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class AllInvoicesShippedComponent implements OnInit {

  invoiceDetails!: INVOICE.InvoiceDetail[];
  invoicePaginate!: INVOICE.InvoicePaginate;
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  title = 'Shipped Invoice'
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(private invoiceService: InvoiceService, private cdr: ChangeDetectorRef, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.invoiceList();
  }

  invoiceList(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.invoiceService.getAllShipedInvoice(params)
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

}
