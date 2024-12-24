import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebitNotesViewComponent } from './debit-notes-view/debit-notes-view.component';
// import { DebitNotesViewComponent } from './debit-notes-view/debit-notes-view.component';
import { DebitNotesComponent } from './debit-notes/debit-notes.component';

const routes: Routes = [
    {
        path: '',
        component: DebitNotesComponent,
        data: {
            permissions: {
                only: ['ADMIN', 'FINANCE'],
                redirectTo: '/finance/po'
            }
        }
    },
    {
        path: 'view/:uuid',
        component: DebitNotesViewComponent,
        data: {
            permissions: {
                only: ['ADMIN', 'FINANCE'],
                redirectTo: '/finance/po'
            }
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReturnToVendorRoutingModule { }
