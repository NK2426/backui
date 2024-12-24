import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
// import { ProfitlossService } from '../../services/profitloss.service';
import { ProfitlossService } from '../../../services/profitloss.service';
import { Data, ExpenseDetail } from '../../../models/profitOrLoss';
// import { Data, Expense, ExpenseDetail, Profit } from '../../models/profitOrLoss';/




@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class ProfitLossComponent implements OnInit {
  constructor(private cd: ChangeDetectorRef, private calendar: NgbCalendar, private config: NgbDatepickerConfig, public formatter: NgbDateParserFormatter,
    private utils: UtilsService, private route: ActivatedRoute, private toast: ToastService, private env: EnvService, private profitService: ProfitlossService,
  ) {
    this.config.maxDate = this.calendar.getToday();
    this.config.outsideDays = 'collapsed';
  }

  hoveredDate!: NgbDate | null;
  ngbFromDate!: NgbDate | null;
  formattedNgbFrom!: string;
  ngbToDate!: NgbDate | null;
  formattedNgbTo!: string;
  profitListData: ExpenseDetail[] = [];

  totalRevenue: Data;
  totalExpense: Data;
  profit: Data;
  loss: Data;

  viewExpenseData: boolean = false;
  expandedIndex: number | null = null;

  ngOnInit(): void {
    this.ngbFromDate = this.calendar.getToday();
    // console.log(this.ngbFromDate)
    this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
    this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
    this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
    this.list();
  }

  onDateSelection(date: NgbDate) {
    if (!this.ngbFromDate && !this.ngbToDate) {
      this.ngbFromDate = date;
      // console.log(this.ngbFromDate)
    } else if (this.ngbFromDate && !this.ngbToDate && date.after(this.ngbFromDate)) {
      this.ngbToDate = date;
      // console.log(this.ngbToDate)
      this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
      this.list();
    } else {
      this.ngbToDate = null;
      this.ngbFromDate = date;
      // console.log(this.ngbFromDate)
      this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
      this.list();
    }
  }

  list() {
    const additionalParams = this.getAdditionalRequestParams(this.formattedNgbFrom, this.formattedNgbTo);
    // console.log(additionalParams);
    this.profitService.profitLoss(additionalParams).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        this.profitListData = resp?.data?.expenseDetails;
        this.totalRevenue = resp.data.totalRevenue;
        this.totalExpense = resp.data.totalExpense;
        this.profit = resp.data.profit;
        this.loss = resp.data.loss;
        this.cd.detectChanges();
      }
    })
  }

  getAdditionalRequestParams(fromdate: string, todate: string): any {
    let params = {} as any;
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;
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

  viewExpense(event: any) {
    // console.log(event.target.value)
    // console.log(event.target)
    // console.log('inside view exp')
    this.viewExpenseData = true;
  }

  toggleAccordion(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  showprint: boolean = true;
  downloadPdf() {
    this.showprint = false;
    const downloadXLparamData = this.downloadPdfParams(this.formattedNgbFrom, this.formattedNgbTo)
    this.profitService.downloadvarpdf(downloadXLparamData).subscribe({
      next: (resp: any) => {
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = resp.fileUrl;
        link.target = 'new';
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
      error: (err: any) => {
        this.toast.failure('Error while download file : ' + err.error.message);
      }
    });
    this.showprint = true;
  }

  downloadPdfParams(fromdate: string, todate: string): any {
    let params = { fromdate: fromdate, todate: todate };
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;
    return params;
  }
}
