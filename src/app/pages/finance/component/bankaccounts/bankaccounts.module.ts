import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BankaccountsRoutingModule } from './bankaccounts-routing.module';
import { AddbankaccountComponent } from './addbankaccount/addbankaccount.component';
import { BankaccountsComponent } from './bankaccounts.component';
import { ViewbankaccountComponent } from './viewbankaccount/viewbankaccount.component';
import { SharedModule } from 'src/app/_themes/shared/shared.module';


@NgModule({
  declarations: [
    BankaccountsComponent,
    AddbankaccountComponent,
    ViewbankaccountComponent
  ],
  imports: [
    CommonModule,
    BankaccountsRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    SharedModule
  ]
})
export class BankaccountsModule { }
