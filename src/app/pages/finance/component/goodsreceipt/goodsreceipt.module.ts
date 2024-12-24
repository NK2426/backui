import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GoodsreceiptRoutingModule } from './goodsreceipt-routing.module';
import { GoodsreceiptComponent } from './goodsreceipt.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { GrnComponent } from './grn/grn.component';

@NgModule({
  declarations: [
    GoodsreceiptComponent,
    GrnComponent
  ],
  imports: [
    CommonModule,
    GoodsreceiptRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgbDatepickerModule,
    NgSelectModule
  ]
})
export class GoodsreceiptModule { }
