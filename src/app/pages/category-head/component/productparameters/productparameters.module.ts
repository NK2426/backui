import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

//import { NgxPermissionsModule } from 'ngx-permissions';
//import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { AddparametersComponent } from './addparameters/addparameters.component';
import { ProductparametersRoutingModule } from './productparameters-routing.module';
import { ProductparametersComponent } from './productparameters.component';
import { ViewparametersComponent } from './viewparameters/viewparameters.component';

@NgModule({
  declarations: [
    ProductparametersComponent,
    AddparametersComponent,
    ViewparametersComponent
  ],
  imports: [
    CommonModule,
    ProductparametersRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    SharedModule,
    NgxPermissionsModule.forChild()
  ]
})
export class ProductparametersModule { }
