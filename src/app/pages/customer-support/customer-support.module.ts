import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

import { ProcessTicketsComponent } from './component/process-tickets/process-tickets.component';
import { CustomerSupportRoutingModule } from './customer-support-routing.module';
import { CustomerSupportComponent } from './customer-support.component';

@NgModule({
  declarations: [CustomerSupportComponent, ProcessTicketsComponent],
  imports: [CommonModule, CustomerSupportRoutingModule, NgxPermissionsModule.forChild(),]
})
export class CustomerSupportModule { }
