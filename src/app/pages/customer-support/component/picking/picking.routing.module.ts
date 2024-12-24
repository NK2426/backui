import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CancelOrdersComponent } from './cancel-orders/cancel-orders.component';
import { SkulevelOrdersPoComponent } from './skulevel-orders-po/skulevel-orders-po.component';
import { SkulevelOrdersComponent } from './skulevel-orders/skulevel-orders.component';
import { CustomerOrderDetailComponent } from 'src/app/pages/warehouse/component/picking/customer-order-detail/customer-order-detail.component';


const routes: Routes = [
  { path: 'skulevelpo', component: SkulevelOrdersPoComponent },
  { path: 'skulevel', component: SkulevelOrdersComponent },
  { path: 'cancel', component: CancelOrdersComponent },
  { path: 'orderdetail/:orderuuid', component: CustomerOrderDetailComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickingRoutingModule { }
