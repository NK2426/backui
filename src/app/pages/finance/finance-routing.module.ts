import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PaymentReportComponent } from './component/payment-report/payment-report.component';
import { PaymentScheduleComponent } from './component/payment-schedule/payment-schedule.component';
import { ViewThreeWayMatchingComponent } from './component/three-way-matching/view-three-way-matching/view-three-way-matching.component';
import { ProfitLossComponent } from './component/financeReport/profit-loss/profit-loss.component';
import { OrderPaymentStatusComponent } from './component/financeReport/order-payment-status/order-payment-status.component';
import { BankAccountTransactionComponent } from './component/financeReport/bank-account-transaction/bank-account-transaction.component';
import { ExpenseDetailsComponent } from './component/financeReport/expense-details/expense-details.component';
import { FinanceCategoryComponent } from './component/financeReport/finance-category/finance-category.component';
import { TopProductListComponent } from './component/financeReport/top-product-list/top-product-list.component';
import { GstTransactionComponent } from './component/financeReport/gst-transaction/gst-transaction.component';
import { RevenueChartComponent } from './component/financeReport/revenue-chart/revenue-chart.component';
import { TopVendorListComponent } from './component/financeReport/top-vendor-list/top-vendor-list.component';
// import { TopVendorListComponent } from './top-vendor-list/top-vendor-list.component';

const routes: Routes = [
  {
    path: 'payment-report', component: PaymentReportComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'payment-schedule', component: PaymentScheduleComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'po-grn-invoice', component: ViewThreeWayMatchingComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'profit-loss',
    component: ProfitLossComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'order-payment-status',
    component: OrderPaymentStatusComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'account-transaction',
    component: BankAccountTransactionComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'expense-details',
    component: ExpenseDetailsComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'finance-category',
    component: FinanceCategoryComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'top-sales',
    component: TopProductListComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'top-vendor',
    component: TopVendorListComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'gst-transaction',
    component: GstTransactionComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'dashboard',
    component: RevenueChartComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        onlu: ['ADMIN', 'FINANCE'],
        redirectTo: '/dashboard'
      }
    }
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./component/purchaseorder/purchaseorder.module').then(m => m.PurchaseorderModule),

  // },
  {
    path: 'payment',
    loadChildren: () => import('./component/payment/payment.module').then(payment => payment.PaymentModule),

  },
  {
    path: 'popayment',
    loadChildren: () => import('./component/po-payments/po-payments.module').then(payment => payment.PoPaymentsModule),

  },
  {
    path: 'expenses',
    loadChildren: () => import('./component/expenses/expenses.module').then(m => m.ExpensesModule),

  },
  {
    path: 'expensetypes',
    loadChildren: () => import('./component/expensetypes/expensetypes.module').then(m => m.ExpensetypesModule),

  },
  {
    path: 'po',
    loadChildren: () => import('./component/purchaseorder/purchaseorder.module').then(m => m.PurchaseorderModule),

  },

  {
    path: 'categories',
    loadChildren: () => import('./component/financecategories/financecategories.module').then(m => m.FinancecategoriesModule),

  },
  {
    path: 'matching',
    loadChildren: () => import('./component/three-way-matching/three-way-matching.module').then(m => m.ThreeWayMatchingModule),

  },
  {
    path: 'invoices',
    //component: HomesettingComponent,
    loadChildren: () => import('./component/goodsreceipt/goodsreceipt.module').then(m => m.GoodsreceiptModule),

  },
  {
    path: 'bankaccounts',
    //component: HomesettingComponent,
    loadChildren: () => import('./component/bankaccounts/bankaccounts.module').then(m => m.BankaccountsModule),

  },
  {
    path: 'salesorders',
    loadChildren: () => import('./component/picking/picking.module').then(m => m.PickingModule),

  },
  {
    path: 'salesinvoice',
    loadChildren: () => import('./component/sales-invoice/sales-invoice.module').then(m => m.SalesInvoiceModule),

  },
  {
    path: 'salesreport',
    loadChildren: () => import('./component/sales-report/sales-report.module').then(sr => sr.SalesReportModule),

  },
  {
    path: 'debit-notes',
    loadChildren: () =>
      import('./component/return-to-vendor/return-to-vendor.module').then(
        (r) => r.ReturnToVendorModule
      ),

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
