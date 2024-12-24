import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Vendor } from '../../../models/purchaseorder';
import { PurchaseorderService } from '../../../services/purchaseorder.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { DEBIT_NOTES } from 'src/app/pages/warehouse/models/debit-notes';
import { DebitNotesService } from 'src/app/pages/warehouse/services/debit-notes.service';


@Component({
  selector: 'app-debit-notes',
  templateUrl: './debit-notes.component.html',
  styleUrls: ['./debit-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebitNotesComponent implements OnInit {

  debitNotesList!: any[];
  debitNotesPaginate!: any;
  currentIndex = -1;
  title = 'Debit Notes'
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 20;
  pageSizes = [20, 30, 50, 100];
  selectedVendor = '';
  vendors: any[] = [];
  selectedPOID!: string;
  constructor(private porderservice: PurchaseorderService, private router: Router, private debitNotesService: DebitNotesService, private toast: ToastService, private utlis: UtilsService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getDebitNotesList();
    this.getVendorList();
  }


  getVendorList() {
    this.porderservice.vendorlist().subscribe({
      next: vendors => {
        this.vendors = vendors
        // this.cd.detectChanges();
      }
    })

  }
  getDebitNotesList(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    let currentParams = { ...params, uid: this.selectedVendor }
    this.debitNotesService.getDebitNotes(currentParams)
      .subscribe({
        next: response => {
          this.debitNotesPaginate = response;
          this.debitNotesList = this.debitNotesPaginate.datas as DEBIT_NOTES.DebitNotesItem[];
          if (response.totalItems)
            this.count = response.totalItems;
          // this.cd.detectChanges();
        }, error: error => {
          this.toast.failure("Error getting debit notes list. Please Try again!!");
        }
      })
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getDebitNotesList();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getDebitNotesList();
  }


  getStatusMessage(status: number) {
    let message;
    switch (status) {
      case 0:
        message = "Pending approval";
        break;
      case 1:
        message = "Send to approval";
        break;
      case 2:
        message = "Approved";
        break;
      case 3:
        message = "Rejected";
        break;
      default:
        message = "--";
        break;
    }
    return message;
  }

  changeVendor(vendor: any) {
    if (vendor) {
      this.selectedVendor = vendor.uid;
    }
    else {
      this.selectedVendor = ''
    }
    this.getDebitNotesList();

  }

  navigateToDebitNotes() {
    this.router.navigate(['/app/debit-notes/add']);
  }
}
