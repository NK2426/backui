import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketStatusComponent } from './ticket-status/ticket-status.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';


const routes: Routes = [
    { path: '', component: TicketStatusComponent },
    { path: ':ticket-status', component: TicketStatusComponent },
    { path: 'ticket/:ticketID', component: ViewTicketComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketStatusRoutingModule { }
