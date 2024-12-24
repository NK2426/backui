import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AwbdetailsComponent } from './awbdetails/awbdetails.component';
import { SalesInvoiceRoutingModule } from './sales-invoice.routing';

@NgModule({
  declarations: [
    AwbdetailsComponent
  ],
  imports: [
    CommonModule,
    SalesInvoiceRoutingModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgSelectModule
  ]
})
export class SalesInvoiceModule { }
