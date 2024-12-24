import { Component, Input } from '@angular/core';
import { Analytics } from 'src/app/pages/hr/models/analytics';
import { AnalyticsService } from 'src/app/pages/hr/services/analytics.service';

@Component({
  selector: 'app-mixed-widget4',
  templateUrl: './mixed-widget4.component.html',
})
export class MixedWidget4Component {
  @Input() color: string = '';
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() date: string = '';
  @Input() progress: string = '';
  result?: any ;
  constructor(private analyticsService:AnalyticsService) {}

  ngOnInit(): void {
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
