import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { ViewAttendanceComponent } from './components/attendance/view-attendance/view-attendance.component';
import { EditComponent } from './components/edit/edit.component';
import { EmployeeRolesComponent } from './components/employee-roles/employee-roles.component';
import { EmployeeSalaryComponent } from './components/employee-salary/employee-salary.component';
import { AdduserComponent } from './components/employees/adduser/adduser.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ViewComponent } from './components/view/view.component';
import { HrRoutingModule } from './hr-routing.module';
import { HrComponent } from './hr.component';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [
    HrComponent,
    EmployeesComponent,
    EmployeeRolesComponent,
    EmployeeSalaryComponent,
    AdduserComponent,
    ViewComponent,
    EditComponent,
    AttendanceComponent,
    ViewAttendanceComponent
  ],
  imports: [
    CommonModule,
    NgxPermissionsModule.forChild(),
    HrRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    NgSelectModule,
    NgbPaginationModule
  ]
})
export class HrModule {}
