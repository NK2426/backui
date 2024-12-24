import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from 'src/app/_helpers/env.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { ProfitlossService } from '../../../services/profitloss.service';
import { PaymentReport, PaymentReportDetail, Vendor } from '../../../models/vendorPaymentReport';
// import { ProfitlossService } from '../../services/profitloss.service';
// import { PaymentReport, PaymentReportDetail, Vendor } from '../../models/vendorPaymentReport';

@Component({
  selector: 'app-order-payment-status',
  templateUrl: './order-payment-status.component.html',
  styleUrls: ['./order-payment-status.component.scss']
})
export class OrderPaymentStatusComponent implements OnInit {
  constructor(private cd: ChangeDetectorRef, private calendar: NgbCalendar, private config: NgbDatepickerConfig, public formatter: NgbDateParserFormatter,
    private utils: UtilsService, private route: ActivatedRoute, private toast: ToastService, private env: EnvService, private profitService: ProfitlossService
  ) {
    this.config.maxDate = this.calendar.getToday();
    this.config.outsideDays = 'collapsed';
  }

  page: any = 0;
  size = 25;
  pagesize = 25;
  pageSizes = [25, 50, 100];
  count = 0;

  showprint: boolean = true;
  expandedIndex: number | null = null;

  vendorDetails: Vendor[] = [];
  vendorExpenses: PaymentReportDetail[] = [];
  vendorDueAmount: PaymentReport;
  vendorID: any = '';
  selectedVendor: any;

  ngOnInit(): void {
    this.vendorList();
    // console.log(this.vendorDetails.length)
    if (this.vendorDetails.length > 0) {
      this.selectedVendor = this.vendorDetails[0].uuid;
    }
    // this.list();
    // this.onDropdownChange(2)
  }

  onDropdownChange(event: any) {
    // console.log(event)
    this.vendorID = event;
    // this.vendorID = event.uid;
    // console.log(event.uid);
    this.list(this.vendorID);
  }

  vendorList() {
    this.profitService.vendorPayment().subscribe({
      next: (resp: any) => {
        this.vendorDetails = resp.vendors;
        // console.log(this.vendorDetails.length)
        if (this.vendorDetails.length > 0) {
          this.selectedVendor = this.vendorDetails[0]?.uid;
        }
        this.onDropdownChange(this.selectedVendor)
        this.cd.detectChanges();
      }
    })
  }

  list(venodrID: any) {
    const params = this.getRequestParams(this.page, this.size);
    // console.log(venodrID)
    this.profitService.purchaseOrder(venodrID, params).subscribe({
      next: (resp: any) => {
        this.vendorExpenses = resp.data;
        this.vendorDueAmount = resp?.vendorDue;
        if (resp.totalItems) {
          this.count = resp.totalItems || 0;
        }
        this.cd.detectChanges();
      }
    })
  }

  getRequestParams(page: number, size: number) {
    let params = { page: page, size: size };
    if (page) params['page'] = page - 1;
    if (size) params['size'] = size;
    return params;
  }

  toggleAccordion(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  handlePageSizeChange(event: any): void {
    this.size = event.target.value;
    this.page = 1;
    // console.log(this.size);
    this.cd.detectChanges();
    this.list(this.vendorID);
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.list(this.vendorID);
    this.cd.detectChanges();
  }

  downloadPdf() {
    this.showprint = false;
    this.profitService.downloadPaymentPdf(this.vendorID).subscribe({
      next: (resp) => {
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = resp.fileUrl;
        link.target = 'new';
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
      error: (err) => {
        this.toast.failure('Error while download file : ' + err.error.message);
      }
    });
    this.showprint = true;
  }
}
