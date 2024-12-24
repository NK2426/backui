import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses.component';


import { NgSelectModule } from '@ng-select/ng-select';
import { AddexpenseComponent } from './addexpense/addexpense.component';
import { ViewexpenseComponent } from './viewexpense/viewexpense.component';
import { SharedModule } from 'src/app/_themes/shared/shared.module';

@NgModule({
  declarations: [
    ExpensesComponent,
    AddexpenseComponent,
    ViewexpenseComponent
  ],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    SharedModule
  ]
})
export class ExpensesModule { }
