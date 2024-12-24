import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NewTicketsComponent } from './component/new-tickets/new-tickets.component';
import { PaymentRelatedComponent } from './component/payment-related/payment-related.component';
import { ProcessTicketsComponent } from './component/process-tickets/process-tickets.component';
import { ReturnRelatedComponent } from './component/return-related/return-related.component';
import { TicketStatusComponent } from './component/ticket-status/ticket-status.component';
import { TicketTypeDetailComponent } from './component/ticket-type-detail/ticket-type-detail.component';
import { ViewTicketComponent } from './component/view-ticket/view-ticket.component';

const routes: Routes = [
  {
    path: 'ticket/:ticket-status', component: TicketStatusComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'ticket/:ticketID', component: ViewTicketComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'ordertickets', component: NewTicketsComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'ordertickets/:ticketID/:orderitem_uuid', component: TicketTypeDetailComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT'],
        redirectTo: '/dashboard'  
      }
    }
  },
  {
    path: 'process-ticket', component: ProcessTicketsComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'returntickets', component: PaymentRelatedComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'returntickets/:ticketID/:orderitem_uuid', component: ReturnRelatedComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'users',
    loadChildren: () => import('./component/user/user.module').then(m => m.UserModule),
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT','WEBTEAM'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'tickets',
    loadChildren: () => import('./component/ticket-status/ticket-status.module').then(ticket => ticket.TicketStatusModule),
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'ticket-type',
    loadChildren: () => import('./component/ticket-type/ticket-type.module').then(ticket => ticket.TicketTypeModule),
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'reasons',
    loadChildren: () => import('./component/reason-management/reason-management.module').then(reason => reason.ReasonManagementModule),
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT','WEBTEAM'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'orders',
    loadChildren: () => import('./component/orders/orders.module').then(orders => orders.OrdersModule),
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT','WEBTEAM'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'salesorders',
    loadChildren: () => import('./component/picking/picking.module').then((m) => m.PickingModule),
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT','WEBTEAM'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'salesinvoice',
    loadChildren: () => import('./component/sales-invoice/sales-invoice.module').then((m) => m.SalesInvoiceModule),
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'CUSTOMER_SUPPORT'],
        redirectTo: '/dashboard'
      }
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerSupportRoutingModule { }
