import { Component, ChangeDetectorRef, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { RevenuechartService } from '../../../services/revenuechart.service';
import { RevenueChart } from '../../../models/revenueChart';
import {
  ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels,
  ApexPlotOptions, ApexYAxis, ApexLegend, ApexStroke, ApexXAxis, ApexFill, ApexTooltip,
  ApexGrid, ApexNonAxisChartSeries, ApexResponsive, ApexTitleSubtitle
} from "ng-apexcharts";
import { getCSSVariableValue } from 'src/app/_themes/kt/_utils';
import { GstTransactionService } from '../../../services/gst-transaction.service';
import { Gst } from '../../../models/gst-transaction';
import { TopproductService } from '../../../services/topproduct.service';
import { TopProduct, TopVendor } from '../../../models/topProduct';
import { DailyAnalysis, WarehouseList } from '../../../models/financeReport';

// Revenue Chartoption
export type ChartOptions = {
  series: ApexAxisChartSeries;
  email: ApexAxisChartSeries
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  colors: string[];
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

// Line Chart salescount
export type ChartOptions2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

export type ChartOptions4 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  stroke: ApexStroke;
  colors: string[];
  fill: ApexFill;
  tooltip: ApexTooltip;
};

// Pie chart Topproduct-----
export type ChartOptions3 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  tooltip: ApexTooltip;
};

// GST Chart--------------
export type ChartOptions1 = {
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
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.scss']
})
export class RevenueChartComponent implements OnInit, AfterViewInit {
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions2>;
  public chartOptions3: Partial<ChartOptions3>;
  public chartOptions4: Partial<ChartOptions4>;
  public chartOptions1: Partial<ChartOptions1>;

  constructor(private cd: ChangeDetectorRef, private utils: UtilsService, private revenueService: RevenuechartService,
    private gstService: GstTransactionService, private topProductService: TopproductService
  ) { }

  revenueMonths: any = [];
  gstMonth: any = [];
  revenueData: any = [];
  gstData: any = [];
  largestValue: any;

  warehouseData: WarehouseList[] = [];
  selectedWarehouse: any;

  topVendorList: TopVendor[] = [];
  topProductList: TopProduct[] = [];
  vendorAmount: any = [];
  vendorName: any = [];
  gstDataList: Gst[] = [];
  revenueList: RevenueChart[] = [];
  sTax: any = [];
  cTax: any = [];
  iTax: any = [];
  todaySalesDatas: DailyAnalysis[] = [];

  productName: any[] = [];
  productAmount: any[] = [];

  ngOnInit(): void {
    this.warehouseList();
    this.salesAnalysis();
    this.revenueChartList();
    this.salesCount();
    this.gstChartList();
    this.topVendorListAPI();
    this.topProduct();
  }

  ngAfterViewInit(): void {
    this.warehouseList()
  }

  // Get single warehouse
  getWarehouseID(event: any) {
    // console.log(event)
    this.todaySalesDatas = [];
    if (event) {
      this.selectedWarehouse = event.id
      this.revenueService.warehouseSalesReport(this.selectedWarehouse).subscribe({
        next: (resp: any) => {
          this.todaySalesDatas.push(resp.data);
          this.cd.detectChanges();
        }
      })
    } else if (event == undefined || '') {
      // console.log("Inside sales api")
      this.salesAnalysis();
    }
  }

  // Get all warehouse list
  warehouseList() {
    this.revenueService.getAllWarehouse().subscribe({
      next: (resp: any) => {
        this.warehouseData = resp.data;
        this.cd.detectChanges();
      }
    })
  }

  // Daywise sales report
  salesAnalysis() {
    this.revenueService.todaySalesReport().subscribe({
      next: (resp: any) => {
        this.todaySalesDatas.push(resp.data);
        this.cd.detectChanges();
      }
    })
  }

  // Revenue Chart
  revenueChartList() {
    this.revenueService.getRevenueList().subscribe({
      next: (resp: any) => {
        // console.log(resp);
        this.revenueList = resp.data;
        this.revenueList.forEach(element => {
          this.revenueMonths.push(element.month);
          this.revenueData.push(element.data);
        })
        const getLargeData = this.revenueData.map((item: any) => parseFloat(item));
        this.largestValue = Math.max(...getLargeData);
        this.cd.detectChanges();
      },
      error: err => {
        console.log(err);
      }
    });
    this.chartOptions = this.chartOptions = {
      series: [
        {
          name: "Vendors",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: 'Email',
          data: []
        },
      ],
      chart: {
        type: "bar",
        height: 350
      },
      colors: ["#FF4560", "#00bc8a", "#13d8aa", "#A5978B", "#2b908f", "#f9a3a4", "#90ee7e", "#f48024", "#69d2e7"],
      plotOptions: {
        bar: {
          horizontal: false,
          distributed: true,
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
      yaxis: {
        min: 0,
        max: this.largestValue
      }
    };
    this.chartOptions.xaxis = {
      categories: this.revenueMonths
    }
    this.chartOptions.series = [
      {
        name: "Sales",
        data: this.revenueData
      },
    ];
  }

  // Sales Count--------------
  details: any;
  date: any;
  dayArray: any = [];
  datCount: any = [];
  dateAmount: string[] = [];
  formatData: any[] = [];
  newData: any[];
  transformDates(dates: string[]): string[] {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return dates.map(date => {
      const [year, month, day] = date.split("-");
      return `${day}-${months[parseInt(month, 10) - 1].toLowerCase()}`;
    });
  }

  // Daywise sales count-----------
  dailySalesReport: [] = [];
  salesCount() {
    this.revenueService.orderCount().subscribe({
      next: (resp: any) => {
        this.dailySalesReport = resp.data;
        let index = 0;
        for ([this.date, this.details] of Object.entries(resp.data)) {
          this.datCount.push(this.details);
          this.dayArray.push(this.date);
          this.formatData.push(this.details.orderCount + ',' + '($)' + this.details.totalAmount)
          index++;
        }
        this.newData = this.transformDates(this.dayArray);
        this.chartOptions2.xaxis = {
          categories: this.newData
        }
        this.chartOptions2.series = [
          {
            name: "",
            data: this.formatData
          },
        ];
        // this.cd.detectChanges();
      }
    })
    this.chartOptions2 = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "area",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Daily sales",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"
        ]
      },
      tooltip: {
        y: {
          formatter: (val: number, { dataPointIndex }: { dataPointIndex: number }) => {
            const item = this.datCount[dataPointIndex];
            return `Total Count: ${item?.orderCount}, Total Amount :₹ ${item?.totalAmount}`;
          }
        }
      },
    }
  }

  // GST chart list data
  gstChartList() {
    this.iTax = [];
    this.cTax = [];
    this.sTax = [];
    this.gstService.getChartGst().subscribe({
      next: (resp: any) => {
        this.gstDataList = resp.data;
        this.gstDataList.forEach(element => {
          this.gstMonth.push(element.month);
          this.sTax.push(element.totalStaxval);
          this.cTax.push(element.totalCtaxval);
          this.iTax.push(element.totalItaxval);
        })
        this.chartOptions1 = this.chartOptions1 = {
          series: [
            {
              name: "Vendors",
              data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
            },
            {
              name: 'sales',
              data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
            },
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
        this.chartOptions1.xaxis = {
          categories: this.gstMonth,
        }
        // console.log(this.gstMonth)
        this.chartOptions1.series = [
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
        // console.log(this.chartOptions1);
      }
    })
  }

  // Top Proudct and vendor list---------------
  topVendorListAPI() {
    this.topProductService.getAllSalesOrder().subscribe({
      next: resp => {
        this.topVendorList = resp.topVendors;
        // this.topProductList = resp.topProducts;
        // this.topProduct(this.topProductList);
        this.topVendorList.forEach((ele: any) => {
          this.vendorName.push(ele.vendorName);
          this.vendorAmount.push(ele.totalAmount);
        })
        this.cd.detectChanges();
      },
    })
    this.chartOptions4 = {
      series: this.vendorAmount,
      chart: {
        type: "polarArea",
        height: 350
      },
      labels: this.vendorName,
      stroke: {
        colors: ["#fff"]
      },
      colors: ["#834eff", "#ffb700", "#1cc8ee", "#00bc8a", "#2b908f", "#f9a3a4", "#90ee7e", "#f48024", "#69d2e7"],
      fill: {
        opacity: 0.8
      },
      tooltip: {
        z: {
          formatter: function (val) {
            return "₹" + val;
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    }
  }

  // Top Product-------------------
  topProduct() {
    this.topProductService.getAllSalesOrder().subscribe({
      next: (resp: any) => {
        // this.topProductList = resp.topProducts;
        const topProduct = resp.topProducts.slice(0, 5);
        this.topProductList = topProduct;
        this.topProductList.forEach((ele: any) => {
          this.productName.push(ele.productName);
          this.productAmount.push(ele.totalAmount);
        });
      }
    })
    this.chartOptions3 = {
      series: this.productAmount,
      chart: {
        type: "donut",
        height: 350
      },
      labels: this.productName,
      tooltip: {
        z: {
          formatter: function (val) {
            return "₹" + val;
          }
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}

