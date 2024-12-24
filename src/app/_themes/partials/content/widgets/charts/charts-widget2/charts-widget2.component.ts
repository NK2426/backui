import { Component, OnInit,ViewChild,ChangeDetectorRef } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { Analytics } from 'src/app/pages/hr/models/analytics';
import { AnalyticsService } from 'src/app/pages/hr/services/analytics.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions
} from "ng-apexcharts";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};
@Component({
  selector: 'app-charts-widget2',
  templateUrl: './charts-widget2.component.html'
})
export class ChartsWidget2Component implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  result?: Analytics[];
  labelColor = getCSSVariableValue('--bs-gray-500');
  borderColor = getCSSVariableValue('--bs-gray-200');
  baseColor = getCSSVariableValue('--bs-primary');
  secondaryColor = getCSSVariableValue('--bs-gray-300');
  constructor(private analyticsService: AnalyticsService,private cd:ChangeDetectorRef) {
    this.chartOptions = {
      series: [
        {
          name: "PO Status",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        },
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: []
      },
      
    };
  }
  chartSeries: any[] = [];
  chartCat: any[] = [];
  ngOnInit(): void {
    
    this.analyticsService.postatus().subscribe({
      next: (data) => {
        this.chartSeries = [];
        this.chartCat = [];
        this.result = data.data;

        this.result.forEach((e) => {
          this.chartSeries.push(Number(e.no_of_po));
          this.chartCat.push(String(e.status));
        });
        // this.chartOptions.series = this.chartSeries;
        // this.chartOptions.xaxis.categories = this.chartCat;
        this.chartOptions.xaxis={
          categories:this.chartCat
         }
         this.chartOptions.series = [{
           name: "PO Status",
           data: this.chartSeries
         }];
        console.log('postatus', this.chartSeries,this.chartCat, this.chartOptions);
        this.cd.detectChanges();
      },
      error: () => {
        this.result = [];
      }
    });
  }
}


