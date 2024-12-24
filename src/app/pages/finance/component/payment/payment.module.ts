import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentComponent } from './payment.component';
import { PaymentRoutingModule } from './payment.routing';
import { UpsertPaymentComponent } from './upsert-payment/upsert-payment.component';
import { ViewPaymentComponent } from './view-payment/view-payment.component';



@NgModule({
  declarations: [
    PaymentComponent,
    ViewPaymentComponent,
    UpsertPaymentComponent
  ],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    FormsModule,
    NgbTooltipModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class PaymentModule { }
