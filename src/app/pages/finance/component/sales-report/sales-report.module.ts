import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SalesReportRoutingModule } from './sales-report.routing';
import { ViewSalesreportComponent } from './view-salesreport/view-salesreport.component';



@NgModule({
  declarations: [
    ViewSalesreportComponent
  ],
  imports: [
    CommonModule,
    SalesReportRoutingModule,
    NgSelectModule,
    FormsModule,
    NgbDatepickerModule,
    NgApexchartsModule
  ]
})
export class SalesReportModule { }
