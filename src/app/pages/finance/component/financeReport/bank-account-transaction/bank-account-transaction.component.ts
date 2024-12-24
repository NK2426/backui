import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
// import { AccountTransferService } from '../../services/account-transfer.service';
import { AccountTransferService } from '../../../services/account-transfer.service';
import { Bankaccount } from '../../../models/bankaccounts';
import { Transaction } from '../../../models/grn';
// import { Bankaccount } from '../../models/bankaccounts';
// import { BankAccountTransactions, Transaction } from '../../models/account-transfer';

@Component({
  selector: 'app-bank-account-transaction',
  templateUrl: './bank-account-transaction.component.html',
  styleUrls: ['./bank-account-transaction.component.scss']
})
export class BankAccountTransactionComponent implements OnInit {
  constructor(private cd: ChangeDetectorRef, private calendar: NgbCalendar, private config: NgbDatepickerConfig, public formatter: NgbDateParserFormatter,
    private utils: UtilsService, private route: ActivatedRoute, private toast: ToastService, private env: EnvService, private accountService: AccountTransferService
  ) {
    this.config.maxDate = this.calendar.getToday();
    this.config.outsideDays = 'collapsed';
  }

  hoveredDate!: NgbDate | null;
  ngbFromDate!: NgbDate | null;
  formattedNgbFrom!: string;
  ngbToDate!: NgbDate | null;
  formattedNgbTo!: string;

  page: any = 0;
  size = 30;
  pagesize = 30;
  pageSizes = [30, 50, 100];
  count = 0;

  accountDetails: Bankaccount[] = [];
  bankAccNumber: number;
  responceData: any;
  responceDataList: Transaction[] = []

  ngOnInit(): void {
    this.ngbFromDate = this.calendar.getToday();
    this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
    this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
    this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
    // this.list();
    this.bankDetails();
    // this.list()
  }

  onDateSelection(date: NgbDate) {
    if (!this.ngbFromDate && !this.ngbToDate) {
      this.ngbFromDate = date;
      // console.log(this.ngbFromDate)
    } else if (this.ngbFromDate && !this.ngbToDate && date.after(this.ngbFromDate)) {
      this.ngbToDate = date;
      // console.log(this.ngbToDate)
      this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
      // this.list();
    } else {
      this.ngbToDate = null;
      this.ngbFromDate = date;
      // console.log(this.ngbFromDate)
      this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
      // this.list();
    }
  }

  bankDetails() {
    this.accountService.accountTransfer().subscribe({
      next: (resp: any) => {
        // console.log(resp.data);
        this.accountDetails = resp.data;
        this.bankAccNumber = resp.data[0]?.id;
        this.list();
        this.cd.detectChanges();
      }
    })
  }

  list() {
    const additionalParams = this.getAdditionalRequestParams(this.formattedNgbFrom, this.formattedNgbTo, this.bankAccNumber, this.page, this.size);
    // console.log(additionalParams);
    this.accountService.getAllAccountDetail(additionalParams).subscribe({
      next: (resp: any) => {
        // console.log(resp.data);
        // console.log(resp.data.transaction);
        this.responceDataList = resp?.data?.transaction;
        this.responceData = resp.data;
        if (resp.totalItems) {
          this.count = resp.totalItems || 0;
        }
        this.cd.detectChanges();
      }
    })
  }

  getAdditionalRequestParams(fromdate: string, todate: string, accID: any, page: number, size: number): any {
    let params = { fromdate: fromdate, todate: todate, accID: accID, page: page, size: size } as any;
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;
    if (accID) params['accID'] = accID;
    if (page) params['page'] = page - 1;
    if (size) params['size'] = size;
    return params;
  }

  isRange(date: NgbDate) {
    return date.equals(this.ngbFromDate) || (this.ngbToDate && date.equals(this.ngbToDate)) || this.isInside(date) || this.isHovered(date);
  }

  isInside(date: NgbDate) {
    return this.ngbToDate && date.after(this.ngbFromDate) && date.before(this.ngbToDate);
  }

  isHovered(date: NgbDate) {
    return this.ngbFromDate && !this.ngbToDate && this.hoveredDate && date.after(this.ngbFromDate) && date.before(this.hoveredDate);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    // console.log(currentValue, input)
    // console.log(parsed)
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  getBankID(event: any) {
    // console.log(event.id);
    this.bankAccNumber = event.id;
    this.list();
    // console.log(event.target.value);
  }

  expandedIndex: number | null = null;
  toggleAccordion(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  handlePageSizeChange(event: any): void {
    this.size = event.target.value;
    this.page = 1;
    // console.log(this.size);
    this.cd.detectChanges();
    this.list();
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.list();
    this.cd.detectChanges();
  }

  showprintxl = true;
  downloadExcel() {
    this.showprintxl = false;
    const downloadXLparamData = this.downloadExcelParams(this.formattedNgbFrom, this.formattedNgbTo, this.bankAccNumber)
    // console.log(this.ngbFromDate, this.ngbToDate, this.expID);
    // console.log(downloadXLparamData);
    this.accountService.downloadXL(downloadXLparamData).subscribe({
      next: (resp: any) => {
        if (resp.message == 'Success') {
          // console.log("inside success");
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = resp.fileUrl;
          link.target = 'new';
          document.body.append(link);
          link.click();
          link.remove();
        }
      },
      error: (err: any) => {
        this.toast.failure('Error While download file : ' + err.error.message);
      }
    })
    this.showprintxl = true;
  }

  downloadExcelParams(fromdate: string, todate: string, accID: any): any {
    let params = { fromdate: fromdate, todate: todate, accID: accID };
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;
    if (accID) params['accID'] = accID;
    return params;
  }
}
