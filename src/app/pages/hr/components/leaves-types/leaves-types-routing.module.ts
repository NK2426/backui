import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { LeavesTypesComponent } from './leaves-types.component';

const routes: Routes = [
  {
    path: '', component: LeavesTypesComponent,
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
export class LeavesTypesRoutingModule { }
