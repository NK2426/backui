import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
//import { NgxPermissionsGuard } from 'ngx-permissions';
import { BrandsComponent } from './brands.component';

const routes: Routes = [
  {
    path: '',
    component: BrandsComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['CUSTOMER_SUPPORT', 'ADMIN','CATEGORY_HEAD'],
        redirectTo: '/dashboard'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandsRoutingModule { }
