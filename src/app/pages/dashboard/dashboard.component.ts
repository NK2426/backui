import { Component, ViewChild,ChangeDetectorRef} from '@angular/core';
import { getCSSVariableValue } from 'src/app/_themes/kt/_utils';
import { ModalComponent, ModalConfig } from '../../_themes/partials';
import { AnalyticsService } from '../hr/services/analytics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  public isLoggedIn = JSON.parse(sessionStorage.getItem('loggedIn') || null);
  public hasToken = JSON.parse(sessionStorage.getItem('token') || null);
  @ViewChild('modal') private modalComponent: ModalComponent;
  chartOptions: any;
  chartOptions2: any;
  result?: any ;
  shipQuantity: number=0;
  totalQuantity: number=0;
  totalOrderQuantity: number=0;
  totalStockQuantity: number=0;
  constructor(private analyticsService:AnalyticsService,private cdr:ChangeDetectorRef) {}


  async openModal() {
    return await this.modalComponent.open();
  }

  ngOnInit(): void {
    if (!this.isLoggedIn && this.hasToken && this.hasToken.accessToken) {
      sessionStorage.setItem('loggedIn', 'true');
      window.location.reload();

    }
 
    // this.analyticsService.inventorydetails()
    // .subscribe({
    //   next: data => {
    //     // console.log("card details",data)
    //     this.result = data.data[0]
    //     this.shipQuantity=parseInt(this.result.total_shippedqty);
    //     this.totalQuantity=parseInt(this.result.total_quantity);
    //     this.totalOrderQuantity=parseInt(this.result.total_orderqty);
    //     this.totalStockQuantity=parseInt(this.result.total_stockqty);
    //     // this.cdr.detectChanges();
        
    //   },
    //   error: () => {
    //     this.result = []
    //   }
    // });
  }
}

