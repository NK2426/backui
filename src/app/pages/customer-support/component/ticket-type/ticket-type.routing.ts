import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderRelatedComponent } from './order-related/order-related.component';
import { PaymentRelatedComponent } from './payment-related/payment-related.component';
import { ReturnRelatedComponent } from './return-related/return-related.component';
import { TicketTypeDetailComponent } from './ticket-type-detail/ticket-type-detail.component';


const routes: Routes = [
    { path: 'ordertickets', component: OrderRelatedComponent },
    { path: 'ordertickets/:ticketID/:orderitem_uuid', component: TicketTypeDetailComponent },
    { path: 'returntickets', component: PaymentRelatedComponent },
    { path: 'returntickets/:ticketID/:orderitem_uuid', component: ReturnRelatedComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketTypeRoutingModule { }
