import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './expenses.component';

import { AddexpenseComponent } from './addexpense/addexpense.component';
import { ViewexpenseComponent } from './viewexpense/viewexpense.component';

const routes: Routes = [
  
          { path: '', component: ExpensesComponent },
          {
            path: 'add', component: AddexpenseComponent, 
          },
          { 
            path: 'edit/:uuid', component: AddexpenseComponent
          },
          { 
            path: 'view/:uuid', component: ViewexpenseComponent
          },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpensesRoutingModule { }
