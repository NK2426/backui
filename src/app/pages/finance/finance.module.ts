import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgxPermissionsModule } from 'ngx-permissions';
import { PaymentReportComponent } from './component/payment-report/payment-report.component';
import { PaymentScheduleComponent } from './component/payment-schedule/payment-schedule.component';
import { PoGrnInvoiceComponent } from './component/po-grn-invoice/po-grn-invoice.component';
import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceComponent } from './finance.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SalesInvoiceModule } from './component/sales-invoice/sales-invoice.module';
// import { ProfitLossComponent } from './component/profit-loss/profit-loss.component';
import { ProfitLossComponent } from './component/financeReport/profit-loss/profit-loss.component';
import { NgbDatepickerModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// import { OrderPaymentStatusComponent } from './component/order-payment-status/order-payment-status.component';
import { OrderPaymentStatusComponent } from './component/financeReport/order-payment-status/order-payment-status.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgSelectModule } from '@ng-select/ng-select';
// import { BankAccountTransactionComponent } from './component/bank-account-transaction/bank-account-transaction.component';
import { BankAccountTransactionComponent } from './component/financeReport/bank-account-transaction/bank-account-transaction.component';
// import { ExpenseDetailsComponent } from './component/expense-details/expense-details.component';
import { ExpenseDetailsComponent } from './component/financeReport/expense-details/expense-details.component';
import { FinanceCategoryComponent } from './component/financeReport/finance-category/finance-category.component';
import { TopProductListComponent } from './component/financeReport/top-product-list/top-product-list.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GstTransactionComponent } from './component/financeReport/gst-transaction/gst-transaction.component';
import { RevenueChartComponent } from './component/financeReport/revenue-chart/revenue-chart.component';
import { TopVendorListComponent } from './component/financeReport/top-vendor-list/top-vendor-list.component';
// import { TopVendorListComponent } from './top-vendor-list/top-vendor-list.component';

@NgModule({
  declarations: [FinanceComponent, PoGrnInvoiceComponent, PaymentScheduleComponent, PaymentReportComponent, ProfitLossComponent,
    OrderPaymentStatusComponent, BankAccountTransactionComponent, ExpenseDetailsComponent, FinanceCategoryComponent, TopProductListComponent,
    GstTransactionComponent, RevenueChartComponent, TopVendorListComponent
  ],
  imports: [CommonModule, FinanceRoutingModule, SalesInvoiceModule, NgbDatepickerModule, NgbPaginationModule, NgbTooltipModule, NgxPermissionsModule.forChild(),
    CdkAccordionModule, NgSelectModule, NgApexchartsModule, SharedModule, NgbModule, ReactiveFormsModule, FormsModule
  ],
  providers: [BrowserAnimationsModule]
})
export class FinanceModule { }
