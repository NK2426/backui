import { Component, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { Analytics } from 'src/app/pages/hr/models/analytics';
import { AnalyticsService } from 'src/app/pages/hr/services/analytics.service';

@Component({
  selector: 'app-charts-widget7',
  templateUrl: './charts-widget7.component.html'
})
export class ChartsWidget7Component implements OnInit {
  labelColor = getCSSVariableValue('--bs-gray-500');
  borderColor = getCSSVariableValue('--bs-gray-200');
  strokeColor = getCSSVariableValue('--bs-gray-300');

  color1 = getCSSVariableValue('--bs-warning');
  color1Light = getCSSVariableValue('--bs-light-warning');

  color2 = getCSSVariableValue('--bs-success');
  color2Light = getCSSVariableValue('--bs-light-success');

  color3 = getCSSVariableValue('--bs-primary');
  color3Light = getCSSVariableValue('--bs-light-primary');

  // chartOptions: any = {}
  result?: Analytics[];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // this.chartOptions = getChartOptions(350);
    this.analyticsService.pocounts().subscribe({
      next: (data) => {
        this.result = data;
        // this.result = Object.keys(data).map((key) => data[key]);
        console.log('pocouts', this.result, typeof (this.result));
      },
      error: () => {
        this.result = [];
      }
    });
  }
  chartOptions: any = {
    series: [
      {
        name: 'Net Profit'
        // data: this.result[0]
      }
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {},
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'solid',
      opacity: 1
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 2,
      colors: [this.color1, 'transparent', 'transparent']
    },
    xaxis: {
      // categories: this.result[0],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        style: {
          colors: this.labelColor,
          fontSize: '12px'
        }
      },
      crosshairs: {
        show: false,
        position: 'front',
        stroke: {
          color: this.strokeColor,
          width: 1,
          dashArray: 3
        }
      },
      tooltip: {
        enabled: true,
        formatter: undefined as any,
        offsetY: 0,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        show: false,
        style: {
          colors: this.labelColor,
          fontSize: '12px'
        }
      }
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0
        }
      },
      hover: {
        filter: {
          type: 'none',
          value: 0
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0
        }
      }
    },
    tooltip: {
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: function (val: number) {
          return '$' + val + ' thousands';
        }
      }
    },
    colors: [this.color1, this.color2, this.color3],
    grid: {
      borderColor: this.borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    markers: {
      colors: [this.color1Light, this.color2Light, this.color3Light],
      strokeColors: [this.color1, this.color2, this.color3],
      strokeWidth: 3
    }
  };
}

function getChartOptions(height: number) {
  const labelColor = getCSSVariableValue('--bs-gray-500');
  const borderColor = getCSSVariableValue('--bs-gray-200');
  const strokeColor = getCSSVariableValue('--bs-gray-300');

  const color1 = getCSSVariableValue('--bs-warning');
  const color1Light = getCSSVariableValue('--bs-light-warning');

  const color2 = getCSSVariableValue('--bs-success');
  const color2Light = getCSSVariableValue('--bs-light-success');

  const color3 = getCSSVariableValue('--bs-primary');
  const color3Light = getCSSVariableValue('--bs-light-primary');

  return {
    series: [
      {
        name: 'Net Profit',
        data: [30, 30, 50, 50, 35, 35]
      }
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'line',
      height: height,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {},
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: 'solid',
      opacity: 1
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 2,
      colors: [color1, 'transparent', 'transparent']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px'
        }
      },
      crosshairs: {
        show: false,
        position: 'front',
        stroke: {
          color: strokeColor,
          width: 1,
          dashArray: 3
        }
      },
      tooltip: {
        enabled: true,
        formatter: undefined as any,
        offsetY: 0,
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: '12px'
        }
      }
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0
        }
      },
      hover: {
        filter: {
          type: 'none',
          value: 0
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0
        }
      }
    },
    tooltip: {
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: function (val: number) {
          return '$' + val + ' thousands';
        }
      }
    },
    colors: [color1, color2, color3],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    markers: {
      colors: [color1Light, color2Light, color3Light],
      strokeColors: [color1, color2, color3],
      strokeWidth: 3
    }
  };
}
