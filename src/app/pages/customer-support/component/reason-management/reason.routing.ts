import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllReasonComponent } from './all-reason/all-reason.component';
import { ViewReasonComponent } from './view-reason/view-reason.component';

const routes: Routes = [
    { path: '', component: AllReasonComponent },
    { path: ':reasonUUID', component: ViewReasonComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReasonRoutingModule { }
