import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AddLeaveComponent } from './add-leave/add-leave.component';
import { LeavesComponent } from './leaves.component';
import { ViewLeaveComponent } from './view-leave/view-leave.component';

const routes: Routes = [
  {
    path: '', component: LeavesComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'HR'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'view', component: ViewLeaveComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'HR'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'add', component: AddLeaveComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'HR'],
        redirectTo: '/dashboard'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
