import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxPermissionsModule } from 'ngx-permissions';
import { CompletedOrderComponent } from './component/completed-order/completed-order.component';
import { NewOrderComponent } from './component/new-order/new-order.component';
import { OrderListComponent } from './component/order-list/order-list.component';
import { ProcessOrderComponent } from './component/process-order/process-order.component';
import { ReplacementOrderComponent } from './component/replacement-order/replacement-order.component';
import { ReturnOrderComponent } from './component/return-order/return-order.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';

@NgModule({
  declarations: [
    OrderComponent,
    NewOrderComponent,
    ProcessOrderComponent,
    CompletedOrderComponent,
    ReturnOrderComponent,
    ReplacementOrderComponent,
    OrderListComponent
  ],
  imports: [CommonModule,
    NgxPermissionsModule.forChild(), OrderRoutingModule]
})
export class OrderModule { }
