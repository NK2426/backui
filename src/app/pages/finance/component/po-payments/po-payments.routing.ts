import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPoPaymentsComponent } from './all-po-payments/all-po-payments.component';

const routes: Routes = [
    { path: '', component: AllPoPaymentsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class POPaymentRoutingModule { }
