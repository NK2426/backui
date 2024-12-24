import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxPermissionsModule } from 'ngx-permissions';
import { ActiveCustomerComponent } from './component/active-customer/active-customer.component';
import { AddCustomerComponent } from './component/add-customer/add-customer.component';
import { BlockCustomerComponent } from './component/block-customer/block-customer.component';
import { PrivilegeCustomerComponent } from './component/privilege-customer/privilege-customer.component';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';

@NgModule({
  declarations: [CustomersComponent, AddCustomerComponent, ActiveCustomerComponent, PrivilegeCustomerComponent, BlockCustomerComponent],
  imports: [CommonModule, NgxPermissionsModule.forChild(), CustomersRoutingModule]
})
export class CustomersModule { }
