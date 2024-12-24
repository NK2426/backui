import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { ExpenseDetailsService } from '../../../services/expense-details.service';
import { Exp, ExpenseType } from '../../../models/expensesDetails';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss']
})
export class ExpenseDetailsComponent implements OnInit {
  constructor(private cd: ChangeDetectorRef, private calendar: NgbCalendar, private config: NgbDatepickerConfig, public formatter: NgbDateParserFormatter,
    private utils: UtilsService, private route: ActivatedRoute, private toast: ToastService, private env: EnvService, private expenseService: ExpenseDetailsService
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

  expID: any = '';
  expensesType: ExpenseType[] = [];
  expenseDetails: Exp

  ngOnInit(): void {
    this.ngbFromDate = this.calendar.getToday();
    this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
    this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
    this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
    this.getAllExpense();
  }

  getAllExpense() {
    this.expenseService.getAllExpensesData().subscribe({
      next: (resp: any) => {
        // console.log(resp.data);
        this.expensesType = resp.data;
        this.expID = resp.data[0]?.id;
        this.list();
        this.cd.detectChanges();
      }
    })
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

  expenseName: any = '';
  list() {
    const additionalParams = this.getAdditionalRequestParams(this.formattedNgbFrom, this.formattedNgbTo, this.expID, this.page, this.size);
    // console.log(additionalParams);
    this.expenseService.getAllExpenseDetail(additionalParams).subscribe({
      next: (resp: any) => {
        this.expenseName = resp?.data?.name;
        // console.log(this.expenseName);
        this.expenseDetails = resp.data;
        // console.log(this.expenseDetails)
        if (resp.totalItems) {
          this.count = resp.totalPages || 0;
        }
        this.cd.detectChanges();
      }
    })
  }

  getAdditionalRequestParams(fromdate: string, todate: string, expID: any, page: any, size: any): any {
    let params = { fromdate: fromdate, todate: todate, expID: expID, page: page, size: size };
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;
    if (expID) params['expID'] = expID;
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
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  getExpenseID(event: any) {
    this.expID = null;
    // console.log(event.id);
    this.expID = event.id;
    this.list();
  }

  expandedIndex: number | null = null;
  toggleAccordion(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  handlePageSizeChange(event: any): void {
    this.size = event.target.value;
    this.page = 1;
    // console.log(this.size);
    this.list();
    this.cd.detectChanges();
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.list();
    this.cd.detectChanges();
  }

  showprintxl = true;
  downloadExcel() {
    this.showprintxl = false;
    const downloadXLparamData = this.downloadExcelParams(this.formattedNgbFrom, this.formattedNgbTo, this.expID)
    // console.log(this.ngbFromDate, this.ngbToDate, this.expID);
    // console.log(downloadXLparamData);
    this.expenseService.downloadXL(downloadXLparamData).subscribe({
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

  downloadExcelParams(fromdate: string, todate: string, expID: any): any {
    let params = { fromdate: fromdate, todate: todate, expID: expID };
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;
    if (expID) params['expID'] = expID;
    return params;
  }

}
