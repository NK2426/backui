import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/_themes/shared/shared.module';

import { VendoragentRoutingModule } from './vendoragent-routing.module';
import { VendoragentComponent } from './vendoragent.component';
import { AddagentComponent } from './addagent/addagent.component';
import { ViewagentComponent } from './viewagent/viewagent.component';


@NgModule({
  declarations: [
    // VendoragentComponent,
    AddagentComponent,
    ViewagentComponent
  ],
  imports: [
    CommonModule,
    VendoragentRoutingModule,
    FormsModule,
    ReactiveFormsModule, NgbPagination, NgbPaginationModule,
    NgSelectModule, NgxPermissionsModule, SharedModule
  ]
})
export class VendoragentModule { }
