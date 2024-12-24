import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { PurchaseorderRoutingModule } from './purchaseorder-routing.module';
import { PurchaseorderComponent } from './purchaseorder.component';

import { NgbModule, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ViewComponent } from './view/view.component';


@NgModule({
  declarations: [
    PurchaseorderComponent,
    ViewComponent,
  ],
  imports: [
    CommonModule,
    PurchaseorderRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule
  ]
})
export class PurchaseorderModule { }
