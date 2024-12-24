import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancecategoriesRoutingModule } from './financecategories-routing.module';
import { FinancecategoriesComponent } from './financecategories.component';


@NgModule({
  declarations: [
    FinancecategoriesComponent
  ],
  imports: [
    CommonModule,
    FinancecategoriesRoutingModule
  ]
})
export class FinancecategoriesModule { }
