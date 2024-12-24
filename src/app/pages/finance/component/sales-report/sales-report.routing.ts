import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSalesreportComponent } from './view-salesreport/view-salesreport.component';

const routes: Routes = [
    { path: '', component: ViewSalesreportComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesReportRoutingModule { }
