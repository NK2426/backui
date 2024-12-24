import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
//import { ZXingScannerModule } from '@zxing/ngx-scanner';
//import { QRCodeModule } from 'angularx-qrcode';
import { CancelOrdersComponent } from './cancel-orders/cancel-orders.component';
import { PickingRoutingModule } from './picking.routing.module';
import { SkulevelOrdersPoComponent } from './skulevel-orders-po/skulevel-orders-po.component';
import { SkulevelOrdersComponent } from './skulevel-orders/skulevel-orders.component';
import { SharedModule } from 'src/app/_themes/shared/shared.module';


@NgModule({
  declarations: [
    SkulevelOrdersComponent,
    SkulevelOrdersPoComponent,
    CancelOrdersComponent,
    
  ],
  imports: [CommonModule, PickingRoutingModule, FormsModule, NgbPaginationModule, NgSelectModule, NgbTooltipModule, NgbDatepickerModule,SharedModule]
})
export class PickingModule { }
