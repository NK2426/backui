import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductvariantsRoutingModule } from './productvariants-routing.module';
import { ProductvariantsComponent } from './productvariants.component';
import { AddProductvariantsComponent } from './add-productvariants/add-productvariants.component';
import { ViewProductvariantsComponent } from './view-productvariants/view-productvariants.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/_themes/shared/shared.module';

@NgModule({
  declarations: [
    ProductvariantsComponent,
    ViewProductvariantsComponent,
    AddProductvariantsComponent
  ],
  imports: [
    CommonModule,
    ProductvariantsRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    NgxPermissionsModule.forChild(),
    SharedModule
  ]
})
export class ProductvariantsModule { }
