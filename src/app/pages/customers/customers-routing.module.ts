import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ActiveCustomerComponent } from './component/active-customer/active-customer.component';
import { AddCustomerComponent } from './component/add-customer/add-customer.component';
import { BlockCustomerComponent } from './component/block-customer/block-customer.component';
import { PrivilegeCustomerComponent } from './component/privilege-customer/privilege-customer.component';

const routes: Routes = [
  {
    path: 'add-customer', component: AddCustomerComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['CUSTOMER_SUPPORT', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'active-customer', component: ActiveCustomerComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['CUSTOMER_SUPPORT', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'privilege-customer', component: PrivilegeCustomerComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['CUSTOMER_SUPPORT', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'block-customer', component: BlockCustomerComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['CUSTOMER_SUPPORT', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
