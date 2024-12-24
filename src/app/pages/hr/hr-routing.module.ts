import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { ViewAttendanceComponent } from './components/attendance/view-attendance/view-attendance.component';
import { EditComponent } from './components/edit/edit.component';
import { EmployeeRolesComponent } from './components/employee-roles/employee-roles.component';
import { EmployeeSalaryComponent } from './components/employee-salary/employee-salary.component';
import { AdduserComponent } from './components/employees/adduser/adduser.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { LeavesTypesModule } from './components/leaves-types/leaves-types.module';
import { ViewComponent } from './components/view/view.component';
import { HrComponent } from './hr.component';

const routes: Routes = [
  {
    path: '',
    component: HrComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['HR', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    },
    children: [
      {
        path: 'employees', component: EmployeesComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['HR', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'employees/add', component: AdduserComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['HR', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'view/:uuid', component: ViewComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['HR', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'edit/:uuid', component: EditComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['HR', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },

      {
        path: 'attendance', component: AttendanceComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['HR', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'view', component: ViewAttendanceComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['HR', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },

      {
        path: 'leavestypes',
        loadChildren: () => import('./components/leaves-types/leaves-types.module').then(m => LeavesTypesModule)
      },

      {
        path: 'leaves',
        loadChildren: () => import('./components/leaves/leaves.module').then(m => m.LeavesModule)
      },
      

      {
        path: 'employee-roles', component: EmployeeRolesComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['HR', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'employee-salary', component: EmployeeSalaryComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['HR', 'ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      { path: '**', redirectTo: 'error/404' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrRoutingModule { }
