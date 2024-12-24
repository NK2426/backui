import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { AddLeavetypeComponent } from './add-leavetype/add-leavetype.component';
import { LeavesTypesRoutingModule } from './leaves-types-routing.module';
import { LeavesTypesComponent } from './leaves-types.component';
import { ViewLeavetypeComponent } from './view-leavetype/view-leavetype.component';



@NgModule({
  declarations: [
    LeavesTypesComponent,
    AddLeavetypeComponent,
    ViewLeavetypeComponent
  ],
  imports: [
    CommonModule,
    LeavesTypesRoutingModule,
    NgbPagination,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    NgSelectModule, NgxPermissionsModule.forChild(),
    NgbPaginationModule
  ]
})
export class LeavesTypesModule { }
