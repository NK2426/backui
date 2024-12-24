import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { BILLING_COUTNER } from '../../models/billingcounter';
import { BillingCounterService } from '../../services/billingcounter.service';
import { UpsertbillComponent } from './upsertbill/upsertbill.component';
import { ViewbillComponent } from './viewbill/viewbill.component';
@Component({
  selector: 'app-billingcounter',
  templateUrl: './billingcounter.component.html',
  styleUrls: ['./billingcounter.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule, ViewbillComponent, UpsertbillComponent]
})
export class BillingcounterComponent implements OnInit {
  billList?: BILLING_COUTNER.BillingCounter[];
  billingPaginate?: BILLING_COUTNER.Billingpaginate = {};
  currentBill!: BILLING_COUTNER.BillingCounter;
  currentIndex = -1;
  addBill = false;
  viewBill = false;

  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  constructor(private billingCounterService: BillingCounterService, private cdr: ChangeDetectorRef, private modalService: NgbModal, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.billingCounterService.getAllBill(params)
      .subscribe({
        next: (billList: any) => {
          this.billList = billList.datas as any;
          this.cdr.detectChanges();
          if (billList.totalItems)
            this.count = billList.totalItems;
        }, error: (error: any) => {
          this.toast.failure('Error retriving the list. Try Again');
        }
      })
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

  setActiveBill(content: any, bill: BILLING_COUTNER.BillingCounter, index: number): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentBill = bill;
    this.addBill = false;
    this.viewBill = true;
  }
  refreshList(type: any): void {
    this.addBill = false;
    if (type == 'cancel') {
      this.viewBill = true;
    } else {
      this.modalService.dismissAll();
      if (type == 'refresh')
        this.list();
      this.currentIndex = -1;
    }

  }

  createBilling(content: any): void {
    this.modalService.open(content);
    this.addBill = true;
    this.viewBill = false;
    this.currentIndex = -1;
    this.currentBill = {} as any;
  }

  editBilling(bill: BILLING_COUTNER.BillingCounter): void {
    this.addBill = true;
    this.viewBill = false;
    let eBill = Object.assign({}, bill)
    this.currentBill = bill;
  }


}
