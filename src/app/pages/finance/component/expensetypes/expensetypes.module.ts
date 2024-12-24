import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExpensetypesRoutingModule } from './expensetypes-routing.module';
import { ExpensetypesComponent } from './expensetypes.component';
import { AddExpensetypesComponent } from './add-expensetypes/add-expensetypes.component';
import { ViewExpensetypesComponent } from './view-expensetypes/view-expensetypes.component';
import { SharedModule } from 'src/app/_themes/shared/shared.module';


@NgModule({
  declarations: [
    ExpensetypesComponent,
    AddExpensetypesComponent,
    ViewExpensetypesComponent
  ],
  imports: [
    CommonModule,
    ExpensetypesRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    SharedModule
  ]
})
export class ExpensetypesModule { }
