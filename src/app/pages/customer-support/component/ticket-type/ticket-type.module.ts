import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { OrderRelatedComponent } from './order-related/order-related.component';
import { PaymentRelatedComponent } from './payment-related/payment-related.component';
import { ReturnRelatedComponent } from './return-related/return-related.component';
import { TicketTypeDetailComponent } from './ticket-type-detail/ticket-type-detail.component';
import { TicketTypeRoutingModule } from './ticket-type.routing';


@NgModule({
  declarations: [
    OrderRelatedComponent,
    PaymentRelatedComponent,
    TicketTypeDetailComponent,
    ReturnRelatedComponent
  ],
  imports: [
    CommonModule,
    TicketTypeRoutingModule,
    FormsModule,
    NgbPaginationModule,
    NgSelectModule,
    NgbDatepickerModule
  ]
})
export class TicketTypeModule { }
