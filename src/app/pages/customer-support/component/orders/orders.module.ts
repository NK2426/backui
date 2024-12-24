import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { RefundsComponent } from './refunds/refunds.component';


@NgModule({
  declarations: [CustomerOrdersComponent, RefundsComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    FormsModule,
    NgbPaginationModule
  ]
})
export class OrdersModule { }
