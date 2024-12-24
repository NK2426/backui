import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { Analytics } from 'src/app/pages/hr/models/analytics';
import { AnalyticsService } from 'src/app/pages/hr/services/analytics.service';
import { ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid } from 'ng-apexcharts';
  export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    dataLabels: ApexDataLabels;
    grid: ApexGrid;
    stroke: ApexStroke;
    title: ApexTitleSubtitle;
  };
  

@Component({
  selector: 'app-charts-widget3',
  templateUrl: './charts-widget3.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsWidget3Component implements OnInit {
  labelColor = getCSSVariableValue('--bs-gray-500');
  borderColor = getCSSVariableValue('--bs-gray-200');
  baseColor = getCSSVariableValue('--bs-primary');
  lightColor = getCSSVariableValue('--bs-primary-light');
  result?: Analytics[];
  month: [];
  values: [];
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor(private analyticsService: AnalyticsService,private cd: ChangeDetectorRef) {
    this.chartOptions = {
      series: [
        {
          name: "PO",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
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
        text: "",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: []
      }
    };
  }

  chartSeries: any[] = [];
  chartCat: any[] = [];
  year:any []=[];
  
  ngOnInit(): void {
    
    this.analyticsService.pocounts().subscribe({
      next: (data:any) => {
        this.chartSeries = [];
        this.chartCat = [];
        this.result = data;  
        console.log(this.result,typeof(data[0].mnth ));
        
        this.result.forEach((e) => {
          this.chartSeries.push(Number(e.no_of_po));
          this.chartCat.push(String(e.mnth)); 
        });

        console.log('pocouts', data[0].mnth);
       
        //this.chartOptions.series[0].data = this.chartSeries;
        this.chartOptions.xaxis={
         categories:this.chartCat
        }
        this.chartOptions.series = [{
          data: this.chartSeries
        }];
        
      
        console.log(JSON.stringify(this.chartCat));
        
        console.log('pocouts',this.chartOptions);
        
        this.cd.detectChanges()
      },
      error: () => {
        this.result = [];
      }
    });
  }
  // ngAfterViewInit(){
  //   this.cd.detectChanges()
  // }
}

