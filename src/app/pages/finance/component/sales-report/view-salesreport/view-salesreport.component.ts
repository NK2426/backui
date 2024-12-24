import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  ApexAxisChartSeries,
  ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent
} from "ng-apexcharts";

// import { columnChartInitialConfig, miniChartConfig } from './chart.config';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { DatePicker } from '../../../models/datepicker';
import { Ordering } from '../../../models/order';
import { OrderingService } from '../../../services/ordering.service';
import { columnChartInitialConfig, miniChartConfig } from '../chart.config';
export interface Card {
  icon: string
  title: string
  value: string
}


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
};
@Component({
  selector: 'app-view-salesreport',
  templateUrl: './view-salesreport.component.html',
  styleUrls: ['./view-salesreport.component.scss'],
  providers: [NgbDatepickerConfig],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewSalesreportComponent implements OnInit {

  /* Mini Card Config Starts*/
  miniCardConfig: Card[] = miniChartConfig;
  totalOrdersCount!: number;
  totalOrderAmount!: number;
  totalConfirmedOrder!: number;
  totalPendingOrder!: number;
  /*Mini Card Config Ends*/

  /*Chart Config Starts*/
  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild("columnChart") columnChart!: ChartComponent;
  public pieChartOptions: Partial<ChartOptions> | any;
  public columnChartOptions: Partial<ChartOptions> | any;
  /*Chart Config Starts*/

  salesData!: Array<Ordering.CustomerOrder>;
  chartFromDate!: string;
  chartToDate!: string;
  customer!: string | number | null;
  quickDatePickerInput!: DatePicker.QuickDatePicker[];
  selectedDate!: string;

  /*Ngb Date Picker Range*/
  hoveredDate!: NgbDate | null;

  ngbFromDate!: NgbDate | null;
  formattedNgbFrom!: string;
  ngbToDate!: NgbDate | null;
  formattedNgbTo!: string;
  pageSize = 10;
  page = 1;

  constructor(private router: Router, private calendar: NgbCalendar, private config: NgbDatepickerConfig, public formatter: NgbDateParserFormatter, private toast: ToastService, private salesOrderService: OrderingService, private utils: UtilsService,
    private cd: ChangeDetectorRef) {
    this.config.maxDate = this.calendar.getToday();
    this.config.outsideDays = 'collapsed';
  }

  ngOnInit(): void {
    this.chartFromDate = this.utils.getAPIDateFormat(new Date());
    this.chartToDate = this.utils.getAPIDateFormat(new Date());
    this.customer = null;
    this.quickDatePickerInput = [
      { displayName: 'Today', value: this.utils.getAPIDateFormat(this.utils.substractDays(new Date(), 0)) },
      { displayName: 'Yesterday', value: this.utils.getAPIDateFormat(this.utils.substractDays(new Date(), 1)) },
      { displayName: 'Last 7 Days', value: this.utils.getAPIDateFormat(this.utils.substractDays(new Date(), 7)) },
    ];
    this.selectedDate = this.quickDatePickerInput[0].value as string;

    this.ngbFromDate = this.calendar.getToday();
    this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
    this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
    this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
    this.getAllSalesOrder();
    this.columnChartOptions = this.initializeColumnChartConfig();
  }

  initializeColumnChartConfig() {
    return columnChartInitialConfig;
  }

  getAllSalesOrder(): void {

    const params = this.getRequestParams(this.formattedNgbFrom, this.formattedNgbTo, this.customer);
    this.salesOrderService.getAllSalesReport(params)
      .subscribe({
        next: salesreport => {
          this.salesData = salesreport;
          if (this.salesData) {
            this.columnChartOptions = JSON.parse(JSON.stringify(this.initializeColumnChartConfig()));
            this.getMiniCardData();
            this.getPieChartData();
            this.generateXValueForColumnChart();
          }
          this.cd.detectChanges();
        }, error: error => {
          this.toast.failure("Error getting the sales order.. Please Try again!!");
        }
      })
  }


  navigateToOrderDetail(orderUUID: string) {
    this.router.navigate([`finance/salesorders/orderdetail/${orderUUID}`]);
  }
  changeQuickDatePicker(event: DatePicker.QuickDatePicker) {
    this.chartToDate = event.value as string;
    if (event.displayName?.indexOf('Last') !== -1) {
      this.formattedNgbFrom = this.chartToDate;
      this.formattedNgbTo = this.utils.getAPIDateFormat(new Date());
      this.ngbFromDate = this.calendar.getToday();
      this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', -7);
    } else {
      this.formattedNgbFrom = this.chartToDate;
      this.formattedNgbTo = this.chartToDate;
      if (event.displayName?.indexOf('Yesterday') !== -1) {
        this.ngbFromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -1);
        this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', -1);
      } else {
        this.ngbFromDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
        this.ngbToDate = this.calendar.getNext(this.calendar.getToday(), 'd', 0);
      }
    }
    this.getAllSalesOrder();
  }

  getRequestParams(fromdate: string, todate: string, customer: string | number | null): any {
    let params = {} as any;
    if (fromdate)
      params['fromdate'] = fromdate;
    if (todate)
      params['todate'] = todate;
    if (customer)
      params['customer'] = customer;

    return params;
  }


  onDateSelection(date: NgbDate) {
    if (!this.ngbFromDate && !this.ngbToDate) {
      this.ngbFromDate = date;
    } else if (this.ngbFromDate && !this.ngbToDate && date.after(this.ngbFromDate)) {
      this.ngbToDate = date;
      this.formattedNgbTo = this.utils.ngbDateFormatToAPIFormat(this.ngbToDate);
      this.getAllSalesOrder();
    } else {
      this.ngbToDate = null;
      this.ngbFromDate = date;
      this.formattedNgbFrom = this.utils.ngbDateFormatToAPIFormat(this.ngbFromDate);
      this.getAllSalesOrder();
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.ngbFromDate && !this.ngbToDate && this.hoveredDate && date.after(this.ngbFromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.ngbToDate && date.after(this.ngbFromDate) && date.before(this.ngbToDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.ngbFromDate) ||
      (this.ngbToDate && date.equals(this.ngbToDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  getMiniCardData() {
    this.totalOrdersCount = Object.keys(this.salesData).length;
    this.totalOrderAmount = this.salesData.reduce((accum, item) => accum + item.amount, 0);
    this.totalConfirmedOrder = this.salesData.reduce((accum, item) => (item.status === 'Confirmed' ? accum + 1 : accum), 0);
    this.totalPendingOrder = this.salesData.reduce((accum, item) => (item.status === '' ? accum + 1 : accum), 0);
    let miniCardConfigUpdated = this.updateMiniCardData();
    this.miniCardConfig = JSON.parse(JSON.stringify(miniCardConfigUpdated));
  }

  updateMiniCardData() {
    let miniCardConfigUpdated = this.miniCardConfig.map((eachCardConfig) => {
      if (eachCardConfig.title === 'Total Orders') {
        return {
          ...eachCardConfig,
          value: this.totalOrdersCount
        }
      } else if (eachCardConfig.title === 'Total Order Amount') {
        return {
          ...eachCardConfig,
          value: this.totalOrderAmount
        }
      } else if (eachCardConfig.title === 'Confirmed Order(s)') {
        return {
          ...eachCardConfig,
          value: this.totalConfirmedOrder
        }
      } else {
        return {
          ...eachCardConfig,
          value: this.totalPendingOrder
        }
      }
    })
    return miniCardConfigUpdated;
  }

  getPieChartData() {
    this.pieChartOptions = {
      series: [this.totalConfirmedOrder, this.totalPendingOrder],
      chart: {
        type: "donut"
      },
      labels: ["Confirmed", "Pending"],
      responsive: [
        {

          options: {
            chart: {
              width: '100px',
              height: '100px'
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }


  generateXValueForColumnChart() {

    // Keys of SalesDatGrouped are the x value in colum chart
    const salesDataGrouped = this.salesData.reduce((group: any, product) => {
      const { createdAt } = product;
      const createdAtTrimmed = createdAt.slice(0, 10);
      if (group[createdAtTrimmed]) {
        group[createdAtTrimmed] = group[createdAtTrimmed];
      } else {
        group[createdAtTrimmed] = [];
      }

      group[createdAtTrimmed].push(product);
      //  this.updateColumnChartCo1nfig();
      return group;
    }, {});

    // console.log('GROUPED', salesDataGrouped);
    if (Object.keys(salesDataGrouped).length) {
      this.columnChartOptions.xaxis.categories = [...Object.keys(salesDataGrouped)];
      this.groupByStatus(salesDataGrouped);
    }
  }


  groupByStatus(salesDataGrouped: any) {
    if (Object.keys(salesDataGrouped).length) {
      for (const dateWiseSalesData in salesDataGrouped) {
        const test = dateWiseSalesData as any;
        salesDataGrouped[test] = this.generateYValueForColumnChart(salesDataGrouped[test]);
      }
    }
    // console.log('GROUPED GROUPED', salesDataGrouped);

    if (Object.keys(salesDataGrouped).length) {
      for (const dateWiseSalesData in salesDataGrouped) {
        const test = dateWiseSalesData as any;
        this.finalizeChart(salesDataGrouped[test])
      }
    }
    ;
  }


  generateYValueForColumnChart(product: Ordering.CustomerOrder[]) {
    // Keys of SalesDatGrouped are the x value in colum chart
    const statusGrouped = product.reduce((groupStatus: any, item) => {
      const { status } = item;
      if (groupStatus[status]) {
        groupStatus[status] = groupStatus[status];
      } else {
        groupStatus[status] = [];
      }

      groupStatus[status].push(item);
      return groupStatus;
    }, {});
    return statusGrouped;
  }


  finalizeChart(statusGrouped: any) {
    if (Object.keys(statusGrouped).length) {
      for (const statusWiseSalesData in statusGrouped) {
        const statusTempName = statusWiseSalesData as any;

        if (statusTempName === "Confirmed" && statusGrouped[''] && statusGrouped[''].length && statusGrouped['Confirmed'] && statusGrouped['Confirmed'].length) {
          this.columnChartOptions.series[0].data.push(statusGrouped['Confirmed'].length)
        }

        if (statusTempName === "" && statusGrouped[''] && statusGrouped[''].length && statusGrouped['Confirmed'] && statusGrouped['Confirmed'].length) {
          this.columnChartOptions.series[1].data.push(statusGrouped[''].length)
        }


        if (statusGrouped['Confirmed'] && statusGrouped['Confirmed'].length && !statusGrouped['']) {
          this.columnChartOptions.series[0].data.push(statusGrouped['Confirmed'].length)
          this.columnChartOptions.series[1].data.push(0);
          break;
        }

        if (statusGrouped[''] && statusGrouped[''].length && !statusGrouped['Confirmed']) {
          this.columnChartOptions.series[0].data.push(0)
          this.columnChartOptions.series[1].data.push(statusGrouped[''].length);
          break;
        }
      }

    }

    this.columnChartOptions = JSON.parse(JSON.stringify(this.columnChartOptions));
    // console.log(this.columnChartOptions);
  }

  numberFormat(num: any) {
    return this.utils.numberFormat(num);
  }

}
