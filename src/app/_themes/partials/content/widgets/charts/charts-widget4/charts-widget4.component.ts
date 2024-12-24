import { Component, OnInit,ViewChild,ChangeDetectorRef} from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { Analytics } from 'src/app/pages/hr/models/analytics';
import { AnalyticsService } from 'src/app/pages/hr/services/analytics.service';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ChartComponent
} from "ng-apexcharts";
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
};
@Component({
  selector: 'app-charts-widget4',
  templateUrl: './charts-widget4.component.html'
})
export class ChartsWidget4Component implements OnInit {
  
  result?: Analytics[];
  labelColor = getCSSVariableValue('--bs-gray-500');
  borderColor = getCSSVariableValue('--bs-gray-200');

  baseColor = getCSSVariableValue('--bs-primary');
  baseLightColor = getCSSVariableValue('--bs-primary-light');
  secondaryColor = getCSSVariableValue('--bs-primary');
  secondaryLightColor = getCSSVariableValue('--bs-primary-light');

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  
  constructor(private analyticsService: AnalyticsService,private cdr:ChangeDetectorRef) {
    this.chartOptions = {
      series: [76, 67, 61, 90],
      chart: {
        height: 390,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined
          },
          dataLabels: {
            name: {
              show: true
            },
            value: {
              show: true
            }
          }
        }
      },
      colors: ["#220715", "#b70d09", "#44de2a", "#8b05fd",'#66153F','#461e88','#049e2c','#892368','#ff7d09','#4db97d','#D53487','#92027c'],
      labels: [],
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: 50,
        offsetY: 10,
        labels: {
          useSeriesColors: true
        },
        formatter: function(seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };
  }
  chartSeries: any[] = [];
  chartLabels: any[] = [];



  ngOnInit(): void {
    this.analyticsService.inwardqty_status().subscribe({
      next: (data) => {
        this.chartSeries = [];
        this.chartLabels = [];
        this.result = data.data;

        this.result.forEach((e) => {
          this.chartSeries.push(e.no_of_products);
          this.chartLabels.push(e.status);
        });
        this.chartOptions.series = this.chartSeries;
        this.chartOptions.labels = this.chartLabels;
        console.log('inwardqty_status', this.result, this.chartSeries, this.chartLabels);
        this.cdr.detectChanges();
      },
      error: () => {
        this.result = [];
      }
    });

    // console.log('opt', this.chartOptions);
  }
  //   getChartOptions(series:number[]){
  //  series: {
  //         data: [this.chartSeries[0]]
  //       },
  //       chart: {
  //         height: 350,
  //         type: 'radialBar'
  //       },
  //       plotOptions: {
  //         radialBar: {
  //           dataLabels: {
  //             name: {
  //               fontSize: '22px'
  //             },
  //             value: {
  //               fontSize: '16px'
  //             }
  //           }
  //         }
  //       },
  //       colors: [
  //         '#220715',
  //         '#330A1F',
  //         '#440e2a',
  //         '#551134',
  //         '#66153F',
  //         '#771849',
  //         '#871C53',
  //         '#892368',
  //         '#BA2673',
  //         '#CB2A7D',
  //         '#D53487',
  //         '#D94541'
  //       ],
  //       labels: [this.chartLabels[0]],
  //       legend: {
  //         show: true,
  //         floating: true,
  //         fontSize: '16px',
  //         position: 'left',
  //         offsetX: 50,
  //         offsetY: 10,
  //         labels: {
  //           useSeriesColors: true,
  //           colors: [this.baseColor]
  //         },
  //         itemMargin: {
  //           horizontal: 3
  //         }
  //       },
  //       tooltip: {
  //         enabled: true,
  //         formatter: undefined as any,
  //         offsetY: 0,
  //         style: {
  //           fontSize: '12px'
  //         }
  //       },
  //       responsive: [
  //         {
  //           breakpoint: 480,
  //           options: {
  //             legend: {
  //               show: false
  //             }
  //           }
  //         }
  //       ],
  //       stroke: {
  //         curve: 'smooth',
  //         show: true,
  //         width: 3,
  //         colors: [this.baseColor]
  //       },
  //       states: {
  //         normal: {
  //           filter: {
  //             type: 'none',
  //             value: 0
  //           }
  //         },
  //         hover: {
  //           filter: {
  //             type: 'none',
  //             value: 0
  //           }
  //         },
  //         active: {
  //           allowMultipleDataPointsSelection: false,
  //           filter: {
  //             type: 'none',
  //             value: 0
  //           }
  //         }
  //       },
  //       grid: {
  //         borderColor: this.borderColor,
  //         strokeDashArray: 4,
  //         yaxis: {
  //           lines: {
  //             show: true
  //           }
  //         }
  //       },
  //       markers: {
  //         strokeColors: this.baseColor,
  //         strokeWidth: 3
  //       }
  //   }
}



// function ViewChild(arg0: string): (target: ChartsWidget4Component, propertyKey: "chart") => void {
//   throw new Error('Function not implemented.');
// }

