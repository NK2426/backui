import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankaccountsComponent } from './bankaccounts.component';
import { AddbankaccountComponent } from './addbankaccount/addbankaccount.component';
import { ViewbankaccountComponent } from './viewbankaccount/viewbankaccount.component';

const routes: Routes = [
  
          { path: '', component: BankaccountsComponent },
          { path: 'add', component: AddbankaccountComponent },
          { path: 'edit/:uuid', component: AddbankaccountComponent },
          { path: 'view/:uuid', component: ViewbankaccountComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankaccountsRoutingModule { }
