import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { RETURN } from 'src/app/pages/warehouse/models/return';
import { ReturnService } from 'src/app/pages/warehouse/services/returns.service';


@Component({
  selector: 'app-return-invoice',
  templateUrl: './return-invoice.component.html',
  styleUrls: ['./return-invoice.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class ReturnInvoiceComponent implements OnInit {

  allReturns!: Partial<RETURN.Returninvoice>[];
  returnsPaginate!: RETURN.ReturninvoicePaginate;
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  title = 'All Return Invoices'
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(private returnsService: ReturnService, private cdr: ChangeDetectorRef, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.getAllReturnDetail();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.getAllReturnDetail();
  }

  getAllReturnDetail(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.returnsService.getAllReturninvoices(params)
      .subscribe({
        next: returns => {
          this.allReturns = returns.datas as any;
          if (returns.totalItems)
            this.count = returns.totalItems;
          this.cdr.detectChanges();
        }, error: error => {
          this.toast.failure("Error getting the return invoices.. Please Try again!!");
        }
      })
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.getAllReturnDetail();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getAllReturnDetail();
  }


}
