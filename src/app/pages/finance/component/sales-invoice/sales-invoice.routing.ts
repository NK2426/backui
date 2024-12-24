import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesInvoiceManagementComponent } from './sales-invoice-management/sales-invoice-management.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';

const routes: Routes = [
    { path: '', component: SalesInvoiceManagementComponent },
    { path: ':invoicenumber', component: ViewInvoiceComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesInvoiceRoutingModule { }
