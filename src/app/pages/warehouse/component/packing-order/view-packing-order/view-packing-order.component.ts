import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';

import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Ordering } from '../../../models/order';
import { OrderingService } from '../../../services/ordering.service';

@Component({
  selector: 'app-view-packing-order',
  templateUrl: './view-packing-order.component.html',
  styleUrls: ['./view-packing-order.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule, ZXingScannerModule, NgbPaginationModule]
})
export class ViewPackingOrderComponent implements OnInit {


  customerOrder?: Ordering.CustomerOrder[];
  packagepaginate?: Ordering.OrdersPaginate = {};
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  title = 'Packing'
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 20;
  pageSizes = [10, 20, 30, 50, 100];

  /* zxing config  - to scan using camera*/
  scanqrcode = '';
  qrResultString: string = '';
  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  hasPermission: boolean = false;

  constructor(private orderingService: OrderingService, private cdr: ChangeDetectorRef, private router: Router, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.orderingService.getCustomerOrdersForPacking(params)
      .subscribe({
        next: customerOrders => {
          this.customerOrder = customerOrders.datas;
          if (customerOrders.totalItems)
            this.count = customerOrders.totalItems;
          this.cdr.detectChanges();
        }, error: error => {
          this.toast.failure("Error getting the orders.. Please Try again!!");
        }
      })
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }


  /*zxing methods start*/

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }
  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  /* @desc : Item scan success  */
  onItemScan(itemUUID: string) {
    this.orderingService.validateCrateOnPacking(itemUUID).subscribe({
      next: resp => {
        if (resp.status == 'failure') {
          this.toast.failure(resp.message);
        }
        else {
          const responseUUID = resp.data.uuid;
          if (this.validateOrderUUID(responseUUID)) {
            this.router.navigate([`/warehouse/packingorders/orderdetail/${responseUUID}`]);
          } else {
            this.toast.failure('Crate UUID mismatch');
          }
        }
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }

  /* This function double confirms the scanned QR's 
    scancrate api and bill api order uuid match */
  validateOrderUUID(responseUUID: string) {
    let isValidUUID = false;
    this.customerOrder?.map((eachOrder) => {
      if (eachOrder.uuid === responseUUID) {
        isValidUUID = true;
      }
    })
    return isValidUUID;
  }

  /*zxing methods end */


}
