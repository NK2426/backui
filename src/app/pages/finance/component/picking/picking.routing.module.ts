import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerOrderDetailComponent } from './customer-order-detail/customer-order-detail.component';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';

const routes: Routes = [
    { path: '', component: CustomerOrdersComponent },
    { path: ':orderstatus', component: CustomerOrdersComponent },
    { path: 'orderdetail/:orderuuid', component: CustomerOrderDetailComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PickingRoutingModule { }
