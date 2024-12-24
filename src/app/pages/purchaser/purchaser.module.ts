import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgbDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { ApprovedPoComponent } from './components/approved-po/approved-po.component';
import { CompletedPoComponent } from './components/completed-po/completed-po.component';
import { InApprovalPoComponent } from './components/in-approval-po/in-approval-po.component';
import { IntransitPoComponent } from './components/intransit-po/intransit-po.component';
import { PurchaserRoutingModule } from './purchaser-routing.module';
import { PurchaserComponent } from './purchaser.component';
// import { NewPoListComponent } from './components/new-po-list/new-po-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    PurchaserComponent,
    // CreatePoComponent,
    InApprovalPoComponent,
    // HoldPoComponent,
    ApprovedPoComponent,
    // IntrabsitPoComponent,
    CompletedPoComponent,
    IntransitPoComponent,
    // NewPoListComponent,
    // AddVendorComponent
    //PoComponent,
  ],
  imports: [
    CommonModule,
    PurchaserRoutingModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatToolbarModule,
    NgSelectModule,
    NgbModule,
    NgbDatepicker,
    SharedModule, NgxPermissionsModule.forChild(),
    NgMultiSelectDropDownModule.forRoot(),
    NgxPermissionsModule.forChild()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [MatStepperModule],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    },
    DatePipe
  ]
})
export class PurchaserModule { }
