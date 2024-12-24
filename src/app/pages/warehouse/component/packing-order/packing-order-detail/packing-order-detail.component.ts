import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  selector: 'app-packing-order-detail',
  templateUrl: './packing-order-detail.component.html',
  styleUrls: ['./packing-order-detail.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule, ZXingScannerModule, NgbPaginationModule]
})
export class PackingOrderDetailComponent implements OnInit {

  orderUUID: string = ''
  orderDatum!: Ordering.CustomerOrder;
  crateUUID: string = '';
  lastItemUUID: string = '';
  modalRef: any = '';
  isReadyForInvoicing: boolean = false;
  /* Pagination Config */
  search = '';
  page = 1;
  count = 0;
  pageSize = 24;
  pageSizes = [10, 20, 30, 50, 100];

  /* zxing config  - to scan using camera*/
  scanqrcode = '';
  qrResultString: string = '';
  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  hasPermission: boolean = false;
  itemsReadyForBilling!: string[];

  constructor(private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef, private utlis: UtilsService, private orderingService: OrderingService, private toast: ToastService) { }

  ngOnInit(): void {
    this.itemsReadyForBilling = [];
    let uuid = this.route.snapshot.paramMap.get('orderuuid');
    if (uuid) {
      this.orderUUID = uuid;
      this.list()
    }
  }

  list() {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    let uuid = this.route.snapshot.paramMap.get('orderuuid') || '';
    this.orderingService.getPackingOrderDetailById(uuid)
      .subscribe({
        next: (orderDatum: Ordering.OrderDetailHttpResponse) => {
          if ('data' in orderDatum) {
            this.orderDatum = orderDatum.data;
            this.isReadyForInvoicing = this.isAllItemScanComplete();
            this.canHideScanner();
            this.cdr.detectChanges();
          }
        },
        error: () => {
        }
      });
  }



  /* @desc : Item scan success  */
  onItemScan(orderitemUUID: string) {
    // do we need orderitemuuid validation ??
    if (this.validateItem(orderitemUUID)) {
            this.orderingService.validateItemOnPacking(this.orderDatum.uuid, orderitemUUID).subscribe({
        next: resp => {
          if (resp.status == 'failure') {
            this.toast.failure(resp.message);
          }
          else {
            if (resp.data && resp.data.uuid && resp.data.status && resp.data.status === 'Scaned') {
              this.itemsReadyForBilling.push(resp.data.uuid);
              this.assignItemPacked(resp.data.psid);
              this.isReadyForInvoicing = this.isAllItemScanComplete();
              this.canHideScanner();
              this.toast.success(`${resp?.message || 'Item ready for packing'} `);
            }
          }
        }, error: err => {
          this.toast.failure(err);
        }
      })
    } else {
    this.toast.failure(`Scanned item not matching`);
    }
  }


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


  /* desc : Enable move to packing option when any one item status is picked*/
  isAllItemScanComplete(): boolean {
    let isReady = false;
    if (Object.keys(this.orderDatum).length && this.orderDatum.orderitems) {
      isReady = this.orderDatum.orderitems.some(eachItem => {
        return eachItem.status === 'Scaned'
      })
    }
    return isReady;
  }

  /* Hide the scanner when all the items are scanned or packed*/
  canHideScanner(): boolean {
    let isReady = false;
    if (Object.keys(this.orderDatum).length && this.orderDatum.orderitems) {
      isReady = this.orderDatum.orderitems.every(eachItem => {
        return eachItem.status === 'Invoice'
      })
    }
    return isReady;
  }

  /*  desc : Assign Picked status manually in UI after item scan success 
             This avoids making API calls to get latest status*/
  assignItemPacked(itemUUID: string) {
    if (Object.keys(this.orderDatum).length && this.orderDatum.orderitems?.length) {
      this.orderDatum.orderitems.map((eachItem, index) => {
        if (this.orderDatum.orderitems?.length && eachItem.psid === itemUUID) {
          this.orderDatum.orderitems[index].status = 'Scaned';
        }
      })
    }
  }

  validateItem(itemUUID: string): boolean {
    let isValidItem = false;
    if (Object.keys(this.orderDatum).length && this.orderDatum.orderitems?.length) {
      this.orderDatum.orderitems.map((eachItem, index) => {
        if (this.orderDatum.orderitems?.length && eachItem.psid === itemUUID) {
          isValidItem = true;
        }
      })
    }
    return isValidItem;
  }

  generateInvoice() {
    // console.log(this.itemsReadyForBilling);
    
    this.orderingService.generateInvoice(this.orderDatum.uuid, this.itemsReadyForBilling).subscribe({
      next: resp => {
        if (resp.status == 'failure') {
          this.toast.failure(resp.message);
        }
        else {
          if (resp.data && resp.data.invoice) {
            this.toast.success(`${resp?.message || 'Invoice Generated Successfully'} `);
            this.router.navigate([`/warehouse/packingorders/invoice/${resp.data.invoice}`]);
          }
        }
      }, error: err => {
        this.toast.failure(err);
      }
    })
  }

}
