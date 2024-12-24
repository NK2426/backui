import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AddqcstockComponent } from './component/addqcstock/addqcstock.component';
import { BillingcounterComponent } from './component/billingcounter/billingcounter.component';
import { BundleInwardComponent } from './component/bundle-inward/bundle-inward.component';
import { BundlesComponent } from './component/bundles/bundle-list/bundles.component';
import { BundleviewComponent } from './component/bundles/bundleview/bundleview.component';
import { CheckbundleComponent } from './component/bundles/checkbundle/checkbundle.component';
import { CratemanagementComponent } from './component/cratemanagement/cratemanagement.component';
import { DamageStockComponent } from './component/damage-stock/damage-stock.component';
import { DispatchComponent } from './component/dispatch/dispatch.component';
import { GoodinTransitComponent } from './component/goodin-transit/goodin-transit.component';
import { GoodsreceiptComponent } from './component/goods-receipt/goodsreceipt.component';
import { GrnComponent } from './component/grn/grn.component';
import { ViewInventoryControlComponent } from './component/inventory-control/view-inventory-control/view-inventory-control.component';
import { PackagesComponent } from './component/packages/packages.component';
import { InvoiceManagementComponent } from './component/packing-order/invoice-management/invoice-management.component';
import { ManifestInvoiceComponent } from './component/packing-order/manifest-invoice/manifest-invoice.component';
import { OutwardInvoiceComponent } from './component/packing-order/outward-invoice/outward-invoice.component';
import { PackingOrderDetailComponent } from './component/packing-order/packing-order-detail/packing-order-detail.component';
import { ViewPackingOrderComponent } from './component/packing-order/view-packing-order/view-packing-order.component';
import { CustomerOrderDetailComponent } from './component/picking/customer-order-detail/customer-order-detail.component';
import { CustomerOrdersComponent } from './component/picking/customer-orders/customer-orders.component';
import { InwardpoComponent } from './component/purchaseorder/inwardpo/inwardpo.component';
import { InwardpoforqcComponent } from './component/purchaseorder/inwardpoforqc/inwardpoforqc.component';
import { PurchaseorderComponent } from './component/purchaseorder/po/purchaseorder.component';
import { ViewComponent } from './component/purchaseorder/view/view.component';
import { ReturnInvoiceComponent } from './component/return-invoice/return-invoice.component';
import { ViewReturnInvoiceComponent } from './component/return-invoice/view-return-invoice/view-return-invoice.component';
import { ViewReturnDetailComponent } from './component/return-management/view-return-detail/view-return-detail.component';
import { ViewReturnsComponent } from './component/return-management/view-returns/view-returns.component';
import { ShelfMovementComponent } from './component/shelf-movement/shelf-movement.component';
import { ShelfingComponent } from './component/shelfing/shelfing.component';
import { AllInvoicesShippedComponent } from './component/shipped-invoices/all-invoices-shipped/all-invoices-shipped.component';
import { ViewShippedInvoiceComponent } from './component/shipped-invoices/view-shipped-invoice/view-shipped-invoice.component';
import { ShipperComponent } from './component/shipper/shipper.component';
import { SingleqcstockComponent } from './component/singleqcstock/singleqcstock.component';
import { WarehousemanagerComponent } from './component/warehousemanager/warehousemanager.component';
import { AddWarehouseComponent } from './component/warehousemanager/add-warehouse/add-warehouse.component';
import { ViewWarehouseComponent } from './component/warehousemanager/view-warehouse/view-warehouse.component';
import { EditWarehouseComponent } from './component/warehousemanager/edit-warehouse/edit-warehouse.component';
import { ReceviedComponent } from './component/recevied/recevied.component';
import { StockqcBarcodeComponent } from './component/stockqc-barcode/stockqc-barcode.component';
import { ListBarcodeComponent } from './component/list-barcode/list-barcode.component';
import { TrashListComponent } from './component/trash-list/trash-list.component';
import { StockbarcodeWebComponent } from './component/stockbarcode-web/stockbarcode-web.component';
import { ViewBarcodeComponent } from './component/view-barcode/view-barcode.component';
import { CancelledInvoiceComponent } from './component/packing-order/cancelled-invoice/cancelled-invoice.component';
import { InwardgrnbundleComponent } from './component/purchaseorder/inwardgrnbundle/inwardgrnbundle.component';
import { InwardocviewComponent } from './component/purchaseorder/inwardocview/inwardocview.component';
import { InwardgrnforqcComponent } from './component/purchaseorder/inwardgrnforqc/inwardgrnforqc.component';
import { AddgrnqcstockComponent } from './component/addgrnqcstock/addqgrnqcstock.component';
import { StoreauditComponent } from './component/storeaudit/storeaudit.component';

const routes: Routes = [

  {
    path: 'orders', component: PurchaseorderComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  
  {
    path: 'orders/grninward', component: InwardgrnbundleComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'orders/grninward/:uuid', component: InwardocviewComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },

  {
    path: 'orders/inward', component: InwardpoComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  }
  ,
  {
    path: 'orders/view/:uuid', component: ViewComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  }
  ,
  {
    path: 'orders/recevied/:uuid', component: ReceviedComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'orders/qc', component: InwardpoforqcComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'orders/grnqc', component: InwardgrnforqcComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },

  {
    path: 'goods-receipt', component: GoodsreceiptComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'grn/:id', component: GrnComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'stocks/returnqc', component: SingleqcstockComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'stocks/qcadd/:uuid', component: AddqcstockComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'stocks/grnqcadd/:uuid', component: AddgrnqcstockComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'stocks/single', component: SingleqcstockComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'shelftransfer', component: ShelfMovementComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },


  {
    path: 'bundles', component: BundlesComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'bundles/inward', component: CheckbundleComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'bundles/inward/:poid', component: CheckbundleComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'bundles/stocking', component: BundleviewComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'bundles/stocking/:uuid', component: BundleviewComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'bundles/stocking/:uuid/type', component: BundleviewComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },



  {
    path: 'pickingorders', component: CustomerOrdersComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'orderdetail/:orderuuid', component: CustomerOrderDetailComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'packingorders', component: ViewPackingOrderComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'packingorders/invoice', component: InvoiceManagementComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'packingorders/manifest', component: ManifestInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'packingorders/orderdetail/:orderuuid', component: PackingOrderDetailComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'packingorders/invoice/:invoicenumber', component: OutwardInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },


  {
    path: 'shipped-invoices', component: AllInvoicesShippedComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'cancelled-invoices', component: CancelledInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'shipped-invoices/:invoicenumber', component: ViewShippedInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },


  {
    path: 'returns', component: ViewReturnsComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'returns/:returnuuid', component: ViewReturnDetailComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },

  {
    path: 'returninvoices', component: ReturnInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'returninvoices/:returnuuid', component: ViewReturnInvoiceComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },


  {
    path: 'shelves', component: ShelfingComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'cratemanagement', component: CratemanagementComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'billingcounter', component: BillingcounterComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'packages', component: PackagesComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'inventory-control', component: ViewInventoryControlComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'shippers', component: ShipperComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },

  {
    path: 'goodin-transit', component: GoodinTransitComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'bundle-inward', component: BundleInwardComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'damage-stock', component: DamageStockComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'dispatch', component: DispatchComponent,
    canActivate: [NgxPermissionsGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'warehouse-list', component: WarehousemanagerComponent,
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
    path: 'add-warehouse', component: AddWarehouseComponent,
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
    path: 'view-warehouse/:id', component: ViewWarehouseComponent,
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
    path: 'edit-warehouse/:id', component: EditWarehouseComponent,
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
    path: 'stockqc-barcode', component: StockqcBarcodeComponent,
    // canActivate: [NgxPermissionsGuard],
    // canActivateChild: [NgxPermissionsGuard],
    data: {
      Permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'stockqc-web/:barcode', component: StockbarcodeWebComponent,
    // canActivate: [NgxPermissionsGuard],
    // canActivateChild: [NgxPermissionsGuard],
    data: {
      Permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'audit-store', component: StoreauditComponent,
    // canActivate: [NgxPermissionsGuard],
    // canActivateChild: [NgxPermissionsGuard],
    data: {
      Permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'stockqc-barcode-view/:barcode', component: ViewBarcodeComponent,
    // canActivate: [NgxPermissionsGuard],
    // canActivateChild: [NgxPermissionsGuard],
    data: {
      Permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'stockqc-list', component: ListBarcodeComponent,
    // canActivate: [NgxPermissionsGuard],
    // canActivateChild: [NgxPermissionsGuard],
    data: {
      Permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  {
    path: 'trash-list', component: TrashListComponent,
    // canActivate: [NgxPermissionsGuard],
    // canActivateChild: [NgxPermissionsGuard],
    data: {
      Permissions: {
        only: ['WHO', 'ADMIN'],
        redirectTo: '/dashboard'
      }
    }
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
