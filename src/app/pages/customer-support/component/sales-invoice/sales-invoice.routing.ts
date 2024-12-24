import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AwbdetailsComponent } from './awbdetails/awbdetails.component';

const routes: Routes = [
  { path: 'awb', component: AwbdetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesInvoiceRoutingModule { }
