import { Routes } from '@angular/router';
import { UserprofileComponent } from './users/userprofile/userprofile.component';

const Routing: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    data: { layout: 'light-sidebar' }
  },
  {
    path: 'profile',
    component:UserprofileComponent
  },
  {
    path: 'po',
    loadChildren: () => import('./purchaser/purchaser.module').then((m) => m.PurchaserModule),
  },
  {
    path: 'index',
    loadChildren: () => import('./index/index.module').then((m) => m.IndexModule)
  },
  {
    path: 'hr',
    loadChildren: () => import('./hr/hr.module').then((m) => m.HrModule)
  },
  // {
  //   path: 'vendor',
  //   loadChildren: () => import('./vendor/vendor.module').then((m) => m.VendorModule)
  // },
  {
    path: 'warehouse',
    loadChildren: () => import('./warehouse/warehouse.module').then((m) => m.WarehouseModule)
  },
  {
    path: 'catalog',
    loadChildren: () => import('./catalog/cataog.module').then((m) => m.CatalogModule)
  },
  {
    path: 'finance',
    loadChildren: () => import('./finance/finance.module').then((m) => m.FinanceModule)
  },
  {
    path: 'app',
    loadChildren: () => import('../../../src/app/app.module').then((m) => m.AppModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./customers/customers.module').then((m) => m.CustomersModule)
  },
  {
    path: 'customer-support',
    loadChildren: () => import('./customer-support/customer-support.module').then((m) => m.CustomerSupportModule)
  },
  {
    path: 'category-head',
    loadChildren: () => import('./category-head/category-head.module').then((m) => m.CategoryHeadModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then((m) => m.OrderModule)
  },

  {
    path: '**',
    redirectTo: 'error/404'
  }
];

export { Routing };

