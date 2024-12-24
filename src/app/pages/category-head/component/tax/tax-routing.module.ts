import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { TaxComponent } from './tax.component';

const routes: Routes = [
  {
    path: '',
    component: TaxComponent,
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
export class TaxRoutingModule {}
