import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


import { DebitNotesService } from 'src/app/pages/warehouse/services/debit-notes.service';
import { DebitNotesViewComponent } from './debit-notes-view/debit-notes-view.component';
import { DebitNotesComponent } from './debit-notes/debit-notes.component';
import { ReturnToVendorRoutingModule } from './return-to-vendor.routing';



@NgModule({
  declarations: [
    DebitNotesComponent, DebitNotesViewComponent
  ],
  imports: [

    CommonModule,
    ReturnToVendorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbPaginationModule,
  ],
  providers: [DebitNotesService]
})
export class ReturnToVendorModule { }
