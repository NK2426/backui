import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AllPoPaymentsComponent } from './all-po-payments/all-po-payments.component';
import { POPaymentRoutingModule } from './po-payments.routing';



@NgModule({
  declarations: [
    AllPoPaymentsComponent
  ],
  imports: [
    CommonModule,
    POPaymentRoutingModule
  ]
})
export class PoPaymentsModule { }
