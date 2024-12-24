import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TicketStatusRoutingModule } from './ticket-status.routing';
import { TicketStatusComponent } from './ticket-status/ticket-status.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';
import { SharedModule } from 'src/app/_themes/shared/shared.module';



@NgModule({
  declarations: [
    TicketStatusComponent,
    ViewTicketComponent
  ],
  imports: [
    CommonModule,
    TicketStatusRoutingModule,
    FormsModule,
    NgbPaginationModule,
    NgSelectModule,
    NgbDatepickerModule,
    SharedModule  
  ]
})
export class TicketStatusModule { }
