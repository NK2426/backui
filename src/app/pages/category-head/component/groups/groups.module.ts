import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GroupsComponent } from './groups.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxPermissionsModule } from 'ngx-permissions';
// import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { AddgroupComponent } from './addgroup/addgroup.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { ViewgroupComponent } from './viewgroup/viewgroup.component';

@NgModule({
  declarations: [GroupsComponent, AddgroupComponent, ViewgroupComponent],
  imports: [
    GroupsRoutingModule,
    NgxPermissionsModule.forChild(),
    CommonModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
    //UIModule,
  ]
})
export class GroupsModule { }
