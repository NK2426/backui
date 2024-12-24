import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgxPermissionsModule } from 'ngx-permissions';
import { AddtaxComponent } from './addtax/addtax.component';
import { TaxRoutingModule } from './tax-routing.module';
import { TaxComponent } from './tax.component';
import { ViewtaxComponent } from './viewtax/viewtax.component';
import { SharedModule } from 'src/app/_themes/shared/shared.module';

@NgModule({
  declarations: [TaxComponent, AddtaxComponent, ViewtaxComponent],
  imports: [
    CommonModule,
    TaxRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPermissionsModule.forChild(),
    SharedModule
  ]
})
export class TaxModule {}
