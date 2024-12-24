import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

//import { NgxPermissionsModule } from 'ngx-permissions';

//import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { AddBrandsComponent } from './add-brands/add-brands.component';
import { BrandsRoutingModule } from './brands-routing.module';
import { BrandsComponent } from './brands.component';
import { ViewBrandsComponent } from './view-brands/view-brands.component';


@NgModule({
  declarations: [AddBrandsComponent, BrandsComponent, ViewBrandsComponent],
  imports: [
    CommonModule,
    BrandsRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    //UIModule,
    NgxPermissionsModule.forChild(),
    NgSelectModule,
    SharedModule
    // NgxPermissionsModule.forChild()
  ]
})
export class BrandsModule { }
