import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { INVOICE } from '../../../models/invoice';
import { InvoiceService } from '../../../services/invoice.service';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';

@Component({
  selector: 'app-manifest-invoice',
  templateUrl: './manifest-invoice.component.html',
  styleUrls: ['./manifest-invoice.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class ManifestInvoiceComponent implements OnInit {

  invoiceDetails!: INVOICE.InvoiceDetail[];
  invorderitems: INVOICE.Invoiceorderitem[] = [];
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  title = 'Manifest Invoice'
  checked = 0;
  isCheckAll = false;
  submit = false;
  constructor(private invoiceService: InvoiceService, private cdr: ChangeDetectorRef, private toast: ToastService, private utlis: UtilsService, private modelservice: NgbModal) { }

  ngOnInit(): void {
    this.invoiceList();
  }

  invoiceList(): void {
    this.invorderitems = [];
    this.invoiceService.getManifestInvoice()
      .subscribe({
        next: invoices => {
          this.invoiceDetails = invoices;
          this.invoiceDetails.map((element) => {
            element.invoiceorderitems.map(itm => {
              itm['invoiceno'] = element.invoiceno;
              itm['awbnumber'] = element.awbnumber;
              this.invorderitems.push(itm);
              this.cdr.detectChanges();
            })
          })
        }, error: error => {
          this.toast.failure("Error getting the invoice.. Please Try again!!");
        }
      })
  }

  submitmanifest() {
    if (confirm('Are you sure you want to submit?')) {
      let selecteditems = this.invorderitems.filter((itm) => itm.checked == true)
      let selectedids = selecteditems.map((itm) => itm.uuid)
      this.invoiceService.submitManifest({ 'invoiceitems': selectedids })
        .subscribe({
          next: invoices => {
            this.toast.success("Invoice successfully move to shipment")
            this.invoiceList()
          }, error: error => {
            this.toast.failure("Error Submitting... Please Try again!!");
          }
        })
    }
  }

  check(event: any) {
    if (event.target.checked == true)
      this.checked += 1;
    else
      this.checked -= 1;
  }


  checkAll() {
    if (!this.isCheckAll) {
      this.invorderitems.map((item) => {
        this.checked += 1;
        item.checked = true;
        this.isCheckAll = true;
      })
    }
    else {
      this.invorderitems.map((item) => {
        this.checked = 0;
        item.checked = false;
        this.isCheckAll = false;
      })
    }

  }


  cancelInvoice(invoiceitemuuid: string) {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Invoice Cancel Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Are you sure this packing separately?';
    this.submit = true;
    let data = { status: 'Cancel' }
    modalRef.result.then(() => {
      this.invoiceService.cancelInvoice(invoiceitemuuid).subscribe({
        next: resp => {
          if (resp.message === 'Success') {
            this.toast.success(`${'Successfully Cancelled. Package must be separate.'} `);
            this.invoiceList()
            this.submit = false;
          }
        }, error: err => {
          this.invoiceList()
          this.toast.failure('Invoice Not Cancelled... Try again later...');
          this.submit = false;
        }
      })
    }, err => {
      console.log(err);
    });
  } 

}
