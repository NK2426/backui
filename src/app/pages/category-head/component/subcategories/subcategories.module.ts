import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxPermissionsModule } from 'ngx-permissions';
import { AddSubcategoriesComponent } from './add-subcategories/add-subcategories.component';
import { SubcategoriesRoutingModule } from './subcategories-routing.module';
import { SubcategoriesComponent } from './subcategories.component';
import { ViewSubcategoriesComponent } from './view-subcategories/view-subcategories.component';
import { SharedModule } from 'src/app/_themes/shared/shared.module';


@NgModule({
  declarations: [
    SubcategoriesComponent,
    AddSubcategoriesComponent,
    ViewSubcategoriesComponent
  ],
  imports: [
    CommonModule,
    SubcategoriesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ]
})
export class SubcategoriesModule {}
