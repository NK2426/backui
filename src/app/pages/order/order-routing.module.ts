import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CompletedOrderComponent } from './component/completed-order/completed-order.component';
import { NewOrderComponent } from './component/new-order/new-order.component';
import { OrderListComponent } from './component/order-list/order-list.component';
import { ProcessOrderComponent } from './component/process-order/process-order.component';
import { ReplacementOrderComponent } from './component/replacement-order/replacement-order.component';
import { ReturnOrderComponent } from './component/return-order/return-order.component';
import { OrderComponent } from './order.component';


const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    children: [
      {
        path: 'list', component: OrderListComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'new-order', component: NewOrderComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'process-order', component: ProcessOrderComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'complete-order', component: CompletedOrderComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'return-order', component: ReturnOrderComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      {
        path: 'replacement-order', component: ReplacementOrderComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['ADMIN'],
            redirectTo: '/dashboard'
          }
        }
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: '**', redirectTo: 'list', pathMatch: 'full' }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
