import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { TopproductService } from '../../../services/topproduct.service';
import { Data, DetailedSale, TopProduct, TopVendor } from '../../../models/topProduct';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { getCSSVariableValue } from 'src/app/_themes/kt/_utils';

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
  selector: 'app-top-product-list',
  templateUrl: './top-product-list.component.html',
  styleUrls: ['./top-product-list.component.scss']
})
export class TopProductListComponent implements OnInit {
  @ViewChild("chart") chart: TopProductListComponent;
  public chartOptions: Partial<ChartOptions>;

  labelColor = getCSSVariableValue('--bs-gray-500');
  borderColor = getCSSVariableValue('--bs-gray-200');

  baseColor = getCSSVariableValue('--bs-primary');
  baseLightColor = getCSSVariableValue('--bs-primary-light');
  secondaryColor = getCSSVariableValue('--bs-primary');
  secondaryLightColor = getCSSVariableValue('--bs-primary-light');

  constructor(private cd: ChangeDetectorRef,
    private utils: UtilsService, private route: ActivatedRoute, private toast: ToastService, private env: EnvService,
    private topProductService: TopproductService
  ) { }

  vendorName: any = [];
  vendorTotalAmount: any = [];
  vendorEmail: any = [];

  topProductList: TopProduct[] = [];
  topVendorList: TopVendor[] = [];
  detailedSalesList: DetailedSale[] = [];

  topVendorFlag: boolean = false;

  eventName = 'topProducts'

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.topProductService.getAllSalesOrder().subscribe({
      next: resp => {
        // console.log(resp);
        this.topProductList = resp.topProducts;
        this.cd.detectChanges();
      }
    })
  }

  getDetail(event: any) {
    // console.log(event);
    if (event.target.value == 'topProducts') {
      this.eventName = event.target.value
      this.topProductService.getAllSalesOrder().subscribe({
        next: resp => {
          // console.log(resp);
          this.topProductList = resp.topProducts;
          this.cd.detectChanges();
        }
      })
    }
    else if (event.target.value == 'topVendors') {
      this.vendorName = []
      this.vendorTotalAmount = []
      this.eventName = event.target.value
      this.topProductService.getAllSalesOrder().subscribe({
        next: resp => {
          // console.log(resp);
          this.topVendorList = resp.topVendors;
          this.topVendorList.forEach(element => {
            this.vendorName.push(element.vendorName)
            this.vendorTotalAmount.push(element.totalAmount)
            this.vendorEmail.push(element.email);
          });
          this.topVendorFlag = true;
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
            categories: this.vendorName
          }
          this.chartOptions.series = [
            {
              name: "Sales",
              data: this.vendorTotalAmount
            },

          ];

          this.cd.detectChanges();
          // console.log(this.chartOptions);
        }
      })
    }
    else if (event.target.value == 'detailedSales') {
      this.eventName = event.target.value
      this.topProductService.getAllSalesOrder().subscribe({
        next: resp => {
          this.detailedSalesList = resp.detailedSales;
          this.cd.detectChanges();
        }
      })
    }
  }

}
