import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

import { BundleInwardComponent } from './component/bundle-inward/bundle-inward.component';
import { DamageStockComponent } from './component/damage-stock/damage-stock.component';
import { DispatchComponent } from './component/dispatch/dispatch.component';
import { GoodinTransitComponent } from './component/goodin-transit/goodin-transit.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseComponent } from './warehouse.component';
import { EditWarehouseComponent } from './component/warehousemanager/edit-warehouse/edit-warehouse.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { CancelledInvoiceComponent } from './component/packing-order/cancelled-invoice/cancelled-invoice.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortableDirectiveModule } from 'src/app/_helpers/directives/advance-sortable.directive';
import { NgSelectModule } from '@ng-select/ng-select';
// import { StoreauditComponent } from './component/storeaudit/storeaudit.component';
// import { StockbarcodeWebComponent } from './component/stockbarcode-web/stockbarcode-web.component';
// import { ListBarcodeComponent } from './component/list-barcode/list-barcode.component';
// import { TrashListComponent } from './component/trash-list/trash-list.component';
// import { StockqcBarcodeComponent } from './component/stockqc-barcode/stockqc-barcode.component';
// import { ReceviedComponent } from './component/recevied/recevied.component';



@NgModule({
  declarations: [
    WarehouseComponent,
    GoodinTransitComponent,
    BundleInwardComponent,
    DamageStockComponent,
    DispatchComponent,
    EditWarehouseComponent,
    CancelledInvoiceComponent,
    // StoreauditComponent
    // StockbarcodeWebComponent,
    // ListBarcodeComponent,
    // TrashListComponent
    // StockqcBarcodeComponent,
    // ReceviedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SortableDirectiveModule,
    SharedModule,
    NgbModule,
    NgSelectModule,
    NgxPermissionsModule.forChild(),
    WarehouseRoutingModule,
    

  ]
})
export class WarehouseModule {}
