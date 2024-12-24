import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { RefundsComponent } from './refunds/refunds.component';

const routes: Routes = [
  { path: '', component: CustomerOrdersComponent },
  { path: 'refunds', component: RefundsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
