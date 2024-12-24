import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { FinanceCategoryService } from '../../../services/finance-category.service';
import { FinanceCat, FinanceList } from '../../../models/financeCategory';

@Component({
  selector: 'app-finance-category',
  templateUrl: './finance-category.component.html',
  styleUrls: ['./finance-category.component.scss']
})
export class FinanceCategoryComponent implements OnInit {
  constructor(private cd: ChangeDetectorRef, private calendar: NgbCalendar, private config: NgbDatepickerConfig, public formatter: NgbDateParserFormatter,
    private utils: UtilsService, private route: ActivatedRoute, private toast: ToastService, private env: EnvService, private financeService: FinanceCategoryService
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

  financeName: FinanceCat[] = [];
  financeCatName: string;
  responceListData: FinanceList;

  ngOnInit(): void {
    this.ngbFromDate = this.calendar.getToday();
    this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
    this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
    this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
    this.getAllFinanceCategory();
  }

  getAllFinanceCategory() {
    this.financeService.getAllFinanceCategories().subscribe({
      next: (resp: any) => {
        // console.log(resp.data);
        this.financeName = resp.data;
        this.financeCatName = resp.data[0]?.name
        this.list()
        this.cd.detectChanges();
      }
    })
  }

  list() {
    const additionalParams = this.getAdditionalRequestParams(this.formattedNgbFrom, this.formattedNgbTo, this.financeCatName, this.page, this.size);
    // console.log(additionalParams);
    this.financeService.getFinanceCatList(additionalParams).subscribe({
      next: (resp: any) => {
        // console.log(resp.data);
        this.responceListData = resp.data;
        if (resp.totalItems) {
          this.count = resp.totalItems || 0;
        }
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

  getAdditionalRequestParams(fromdate: string, todate: string, financeCatName: any, page: number, size: number): any {
    let params = { fromdate: fromdate, todate: todate, financeCatName: financeCatName, page: page, size: size };
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;
    if (financeCatName) params['financeCatName'] = financeCatName;
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

  expandedIndex: number | null = null;
  toggleAccordion(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  // Get financeCat ID-------------
  getFinanceCatID(event: any) {
    // console.log(event.name);
    this.financeCatName = event;
    this.list();
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
    const downloadXLparamData = this.downloadExcelParams(this.formattedNgbFrom, this.formattedNgbTo, this.financeCatName)
    // console.log(this.ngbFromDate, this.ngbToDate, this.expID);
    // console.log(downloadXLparamData);
    this.financeService.downloadXL(downloadXLparamData).subscribe({
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

  downloadExcelParams(fromdate: string, todate: string, financeCatName: any): any {
    let params = { fromdate: fromdate, todate: todate, financeCatName: financeCatName };
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;
    if (financeCatName) params['financeCatName'] = financeCatName;
    return params;
  }

}
