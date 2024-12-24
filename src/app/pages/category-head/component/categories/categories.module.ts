import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxPermissionsModule } from 'ngx-permissions';
import { AddCategoriesComponent } from './add-categories/add-categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { ViewCategoriesComponent } from './view-categories/view-categories.component';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    CategoriesComponent,
    AddCategoriesComponent,
    ViewCategoriesComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    SharedModule,
    NgSelectModule,
    NgxPermissionsModule.forChild()
  ]
})
export class CategoriesModule {}
