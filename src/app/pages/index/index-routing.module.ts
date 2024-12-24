import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index.component';
import { OverallDashboardComponent } from './component/overall-dashboard/overall-dashboard.component';
import { PurchaseDashboardComponent } from './component/purchase-dashboard/purchase-dashboard.component';
import { SalesDashboardComponent } from './component/sales-dashboard/sales-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      { path: 'overall-dashboard', component: OverallDashboardComponent },
      { path: 'purchase-dashboard', component: PurchaseDashboardComponent },
      { path: 'sales-dashboard', component: SalesDashboardComponent },
      {
        path: '**',
        redirectTo: 'error/404'
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }
