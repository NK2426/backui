import { Component, Input, OnInit } from '@angular/core';
import { Analytics } from 'src/app/pages/hr/models/analytics';
import { AnalyticsService } from 'src/app/pages/hr/services/analytics.service';


@Component({
  selector: 'app-mixed-widget1',
  templateUrl: './mixed-widget1.component.html'
})
export class MixedWidget1Component implements OnInit {
  @Input() color: string = '';

  result?: Analytics[];


  constructor(
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    // this.analyticsService.inventorydetails()
    // .subscribe({
    //   next: data => {
    //     this.result = data.data
    //     console.log(data.data[0].total_returnqty,this.result[0].total_damageqty);

    //   },
    //   error: () => {
    //     this.result = []
    //   }
    // });

  }
}
