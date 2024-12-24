import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

//import { NgxPermissionsGuard } from 'ngx-permissions';
import { AddgroupComponent } from './addgroup/addgroup.component';
import { GroupsComponent } from './groups.component';
import { ViewgroupComponent } from './viewgroup/viewgroup.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['CATEGORY_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'add',
    component: AddgroupComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['CATEGORY_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'edit/:uuid',
    component: AddgroupComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['CATEGORY_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'view/:uuid',
    component: ViewgroupComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['CATEGORY_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
