import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
//import { ZXingScannerModule } from '@zxing/ngx-scanner';
//import { QRCodeModule } from 'angularx-qrcode';
import { CustomerOrderDetailComponent } from './customer-order-detail/customer-order-detail.component';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { PickingRoutingModule } from './picking.routing.module';



@NgModule({
  declarations: [
    CustomerOrderDetailComponent,
    CustomerOrdersComponent
  ],
  imports: [
    CommonModule,
    PickingRoutingModule,
    FormsModule,
    NgbPaginationModule,
    NgSelectModule,
    NgbTooltipModule,
    NgbDatepickerModule
  ]
})
export class PickingModule { }
