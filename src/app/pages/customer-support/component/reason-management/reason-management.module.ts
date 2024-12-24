import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AllReasonComponent } from './all-reason/all-reason.component';
import { ReasonRoutingModule } from './reason.routing';
import { ViewReasonComponent } from './view-reason/view-reason.component';
import { SharedModule } from 'src/app/_themes/shared/shared.module';



@NgModule({
  declarations: [
    AllReasonComponent,
    ViewReasonComponent
  ],
  imports: [
    CommonModule,
    ReasonRoutingModule,
    FormsModule,
    NgbModalModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbPaginationModule,
    SharedModule
  ]
})
export class ReasonManagementModule { }
