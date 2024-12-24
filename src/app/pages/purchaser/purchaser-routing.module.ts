import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ApprovedPoComponent } from './components/approved-po/approved-po.component';
import { CreatePoComponent } from './components/create-po/create-po.component';
import { EditComponent } from './components/edit/edit.component';
import { PoListComponent } from './components/po-list/po-list.component';
import { PoComponent } from './components/po/po.component';
import { ViewComponent } from './components/view/view.component';
import { PurchaserComponent } from './purchaser.component';
import { NewPoListComponent } from './components/new-po-list/new-po-list.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: PurchaserComponent,
  //   children: [

  //     // { path: '**', redirectTo: 'po', pathMatch: 'full' }
  //   ],
  // },
  {
    path: 'po-list', component: PoListComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['PURCHASE', 'PURCHASE_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'create-po/:uuid', component: CreatePoComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['PURCHASE', 'PURCHASE_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'create-po', component: CreatePoComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['PURCHASE', 'PURCHASE_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'create-po/:uuid', component: CreatePoComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['PURCHASE', 'PURCHASE_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'po', component: PoComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['PURCHASE', 'PURCHASE_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'po/po', component: NewPoListComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['PURCHASE', 'PURCHASE_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'po/:status', component: PoComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['PURCHASE', 'PURCHASE_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  // { path: 'intransit-po', component: IntransitPoComponent },
  // { path: 'completed-po', component: CompletedPoComponent },
  // { path: 'hold-po', component: HoldPoComponent },
  // { path: 'in-approval-po', component: InApprovalPoComponent },
  {
    path: 'approved-po', component: ApprovedPoComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['PURCHASE', 'PURCHASE_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  // { path: "stepper", component: StepperComponent },
  {
    path: 'view/:uuid', component: ViewComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['PURCHASE', 'PURCHASE_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'edit/:uuid', component: EditComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['PURCHASE', 'PURCHASE_HEAD', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  { path: '', redirectTo: 'po', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaserRoutingModule { }