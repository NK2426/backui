import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SalesInvoiceManagementComponent } from './sales-invoice-management/sales-invoice-management.component';
import { SalesInvoiceRoutingModule } from './sales-invoice.routing';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    SalesInvoiceManagementComponent,
    ViewInvoiceComponent
  ],
  imports: [
    CommonModule,
    SalesInvoiceRoutingModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SalesInvoiceModule { }
