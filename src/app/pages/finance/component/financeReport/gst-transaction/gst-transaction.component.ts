import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Gst, gstDate } from '../../../models/gst-transaction';
import { GstTransactionService } from '../../../services/gst-transaction.service';
import {
  ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels,
  ApexPlotOptions, ApexYAxis, ApexLegend, ApexStroke, ApexXAxis, ApexFill, ApexTooltip
} from "ng-apexcharts";
import { getCSSVariableValue } from 'src/app/_themes/kt/_utils';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  email: ApexAxisChartSeries
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-gst-transaction',
  templateUrl: './gst-transaction.component.html',
  styleUrls: ['./gst-transaction.component.scss']
})
export class GstTransactionComponent implements OnInit, OnChanges {
  public chartOptions: Partial<ChartOptions>;

  labelColor = getCSSVariableValue('--bs-gray-500');
  borderColor = getCSSVariableValue('--bs-gray-200');

  baseColor = getCSSVariableValue('--bs-primary');
  baseLightColor = getCSSVariableValue('--bs-primary-light');
  secondaryColor = getCSSVariableValue('--bs-primary');
  secondaryLightColor = getCSSVariableValue('--bs-primary-light');

  constructor(private gstService: GstTransactionService, private cd: ChangeDetectorRef, private calendar: NgbCalendar,
    private config: NgbDatepickerConfig, public formatter: NgbDateParserFormatter, private utils: UtilsService, private toast: ToastService,) {
    this.config.maxDate = this.calendar.getToday();
    this.config.outsideDays = 'collapsed';
  }

  gstTransaction: any = [
    { id: 1, name: 'Datewise', value: 'datewise' },
    { id: 2, name: 'Chart', value: 'chart' }
  ]

  hoveredDate!: NgbDate | null;
  ngbFromDate!: NgbDate | null;
  formattedNgbFrom!: string;
  ngbToDate!: NgbDate | null;
  formattedNgbTo!: string;
  page: any = 0;
  size = 25;
  pagesize = 25;
  pageSizes = [25, 50, 75, 100];
  count = 0;

  months: any = [];
  sTax: any = [];
  cTax: any = [];
  iTax: any = [];

  dateFlag: boolean = false;
  chartFlag: boolean = false;
  eventName = 'chart';

  dateWiseGstList: gstDate[] = []

  gstDataList: Gst[] = [];
  ngOnInit(): void {
    this.ngbFromDate = this.calendar.getToday();
    this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
    this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
    this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
    // this.list();
    this.dateWiseGst();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.list();
  }

  dateWiseGst() {
    // console.log(this.ngbFromDate, this.ngbToDate)
    const additionalParams = this.getAdditionalRequestParams(this.formattedNgbFrom, this.formattedNgbTo, this.page, this.size);
    // console.log(additionalParams);
    this.gstService.getDateWiseGst(additionalParams).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        this.dateWiseGstList = resp.data;
        if (resp.totalItems) {
          this.count = resp.totalItems || 0;
        }
        this.cd.detectChanges();
      }
    })
  }

  getAdditionalRequestParams(fromdate: string, todate: string, page: any, size: any): any {
    let params = { fromdate: fromdate, todate: todate, page: page, size: size };
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;
    if (page) params['page'] = page - 1;
    if (size) params['size'] = size;
    return params;
  }

  onDateSelection(date: NgbDate) {
    if (!this.ngbFromDate && !this.ngbToDate) {
      this.ngbFromDate = date;
    } else if (this.ngbFromDate && !this.ngbToDate && date.after(this.ngbFromDate)) {
      this.ngbToDate = date;
      this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
      this.dateWiseGst();
    } else {
      this.ngbToDate = null;
      this.ngbFromDate = date;
      this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
    }
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

  list() {
    this.iTax = [];
    this.cTax = [];
    this.sTax = [];
    this.gstService.getChartGst().subscribe({
      next: (resp: any) => {
        this.gstDataList = resp.data;
        this.gstDataList.forEach(element => {
          this.months.push(element.month);
          this.sTax.push(element.totalStaxval);
          this.cTax.push(element.totalCtaxval);
          this.iTax.push(element.totalItaxval);
        })
        this.chartOptions = this.chartOptions = {
          series: [
            // {
            //   name: "Vendors",
            //   data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
            // },
            // {
            //   name: 'sales',
            //   data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
            // },
          ],
          chart: {
            type: "bar",
            height: 350
          },
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "55%",
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ["transparent"]
          },
          xaxis: {
            categories: [
              "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"
            ]
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return "₹ " + val;
              }
            }
          },
        };
        this.chartOptions.xaxis = {
          categories: this.months,
        }
        this.chartOptions.series = [
          {
            name: "Total CGST value",
            data: this.cTax
          },
          {
            name: 'Total IGST value',
            data: this.iTax
          },
          {
            name: 'Total SGST value',
            data: this.sTax
          }
        ];
        this.cd.detectChanges();
        // console.log(this.chartOptions);
      }
    })
  }

  // getGstType(event: any) {
  //   // console.log(event.target.value);
  //   this.eventName = event.target.value;
  //   this.cd.detectChanges();
  // }

  handlePageSizeChange(event: any): void {
    this.size = event.target.value;
    this.page = 1;
    // console.log(this.size);
    this.dateWiseGst();
    this.cd.detectChanges();
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.dateWiseGst();
    this.cd.detectChanges();
  }

  showprintxl = true;
  downloadExcel() {
    this.showprintxl = false;
    const downloadXLparamData = this.downloadExcelParams(this.formattedNgbFrom, this.formattedNgbTo)
    // console.log(this.ngbFromDate, this.ngbToDate, this.expID);
    // console.log(downloadXLparamData);
    this.gstService.downloadXL(downloadXLparamData).subscribe({
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

  downloadExcelParams(fromdate: string, todate: string): any {
    let params = { fromdate: fromdate, todate: todate };
    if (fromdate) params['fromdate'] = fromdate;
    if (todate) params['todate'] = todate;
    return params;
  }
}
