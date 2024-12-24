import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbModule, NgbNavModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { AddLeaveComponent } from './add-leave/add-leave.component';
import { LeavesRoutingModule } from './leaves-routing.module';
import { LeavesComponent } from './leaves.component';
import { ViewLeaveComponent } from './view-leave/view-leave.component';

@NgModule({
  declarations: [
    LeavesComponent,
    AddLeaveComponent,
    ViewLeaveComponent
  ],
  imports: [
    CommonModule,
    LeavesRoutingModule,
    NgbPagination, NgxPermissionsModule.forChild(),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbModule
  ]
})
export class LeavesModule { }
