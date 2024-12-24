import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { Analytics } from 'src/app/pages/hr/models/analytics';
import { AnalyticsService } from 'src/app/pages/hr/services/analytics.service';
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
export type ChartOptions = {
  series: ApexAxisChartSeries;
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
  selector: 'app-charts-widget1',
  templateUrl: './charts-widget1.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsWidget1Component implements OnInit {
  labelColor = getCSSVariableValue('--bs-gray-500');
  borderColor = getCSSVariableValue('--bs-gray-200');
  baseColor = getCSSVariableValue('--bs-primary');
  secondaryColor = getCSSVariableValue('--bs-gray-300');
  result?: Analytics[];
  datas: [];
  chartSeries1: any[] = [];
  chartSeries2: any[] = [];
  chartCat: any[] = [];
  chartCat2: any[] = [];
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor(private analyticsService: AnalyticsService, private cd: ChangeDetectorRef) {
    this.chartOptions = {
      series: [
        {
          name: "po",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "sales",
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
          columnWidth: "55%"
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
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },

      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "" + val + " INR";
          }
        }
      }
    };
  }

  ngOnInit(): void {

    this.analyticsService.povalue().subscribe({
      next: (data) => {
        this.chartSeries1 = [];
        this.chartCat = [];
        this.result = data.data;
        // console.log(this.result)
        let povalues = data.data.po
        let salvalues = data.data.sales
        let categories = data.data.month
        this.chartOptions.xaxis = {
          categories: categories
        }
        this.chartOptions.series = [
          {
            name: "po",
            data: povalues
          },
          {
            name: "sales",
            data: salvalues
          }
        ];

        // console.log('povalue', data.data);
        this.cd.detectChanges();
      },
      error: () => {
        this.result = [];
      }
    });

    // this.chartOptions.series[0] = this.chartSeries1;
    // this.chartOptions.series[1] = this.chartSeries2;
    //this.chartOptions.xaxis.categories = this.chartCat;
    console.log('salesvalue', this.chartOptions, this.chartCat, this.chartSeries1, this.chartSeries2);
  }
}
