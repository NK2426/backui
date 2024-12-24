import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Ordering } from '../../../models/order';
import { OrderingService } from '../../../services/ordering.service';


@Component({
  selector: 'app-customer-order-detail',
  templateUrl: './customer-order-detail.component.html',
  styleUrls: ['./customer-order-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CustomerOrderDetailComponent implements OnInit {
  orderUUID: string = ''
  orderDatum!: Ordering.CustomerOrder;
  crateUUID: string = '';
  lastItemUUID: string = '';
  modalRef: any = '';
  currentItemClickedForQR!: Ordering.Orderitem
  uuid_mismatch: boolean = false;
  readyForBilling: boolean = false;
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

  constructor(private route: ActivatedRoute, private router: Router, private modalService: NgbModal, private utlis: UtilsService, private orderingService: OrderingService, private toast: ToastService, private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    let uuid = this.route.snapshot.paramMap.get('orderuuid');
    if (uuid) {
      this.orderUUID = uuid;
      this.list()
    }
  }

  hasOrderDetail() {
    return this.orderDatum && !!Object.keys(this.orderDatum).length
  }

  list() {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    let uuid = this.route.snapshot.paramMap.get('orderuuid') || '';
    this.orderingService.getCustomerOrderDetailById(uuid)
      .subscribe({
        next: (orderDatum: Ordering.OrderDetailHttpResponse) => {
          if ('data' in orderDatum) {
            this.orderDatum = orderDatum.data;
            this.readyForBilling = this.isReadyForBilling();
          }
          this.cd.detectChanges();
        },
        error: () => {
        }
      });
  }


  scanCrateUUID(content: any): void {
    this.modalRef = this.modalService.open(content, { size: 'md', animation: true });
  }

  /* @desc : With crate scan success  */
  onCodeResult(crateUUID: string) { // crateUUID will be -1 for 'with out crate order items'
    //this.qrResultString = resultString;
    this.crateUUID = crateUUID;

    this.orderingService.assignCrate(this.crateUUID, this.orderUUID).subscribe({
      next: resp => {
        if (resp.status == 'failure') {
          this.toast.failure(resp.message);
        }
        else {
          if (this.modalRef) this.modalRef.close();
          this.toast.success(`${resp?.data?.name || 'Crate'} assigned successfully`);
          this.list();
        }
        this.cd.detectChanges();
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }

  /* @desc : Item scan success  */
  onItemScan(itemUUID: string) {
    if (this.currentItemClickedForQR.item_uuid === itemUUID) {
      this.lastItemUUID = itemUUID;
      this.uuid_mismatch = false;
      this.orderingService.pickItem(this.currentItemClickedForQR.uuid, itemUUID).subscribe({
        next: resp => {
          if (resp.status == 'failure') {
            this.toast.failure(resp.message);
          }
          else {
            this.assignItemPicked(this.lastItemUUID);
            if (this.modalRef) {
              this.closeModal();
            }
            this.toast.success(`${resp?.message || 'Item picked successfully'} `);
            this.readyForBilling = this.isReadyForBilling();
          }
          this.cd.detectChanges();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    } else {
      this.uuid_mismatch = true;
    }
  }


  /* @desc : After scanning all ordered items , moving to billing  */
  moveToBilling(billQRUUID: any): void {
    this.modalRef = this.modalService.open(billQRUUID, { size: 'md', animation: true });
  }



  /* @desc : Bill QR scan success  */
  onBillCounterQRScan(billCounterQR: string) { // crateUUID will be -1 for 'with out crate order items'
    this.orderingService.assignOrderBillCounter(this.orderUUID, billCounterQR).subscribe({
      next: resp => {
        this.uuid_mismatch = false;
        if (resp.status == 'failure') {
          this.toast.failure(resp.message);
        }
        else {
          this.modalRef.close();
          this.toast.success(`${resp?.message || 'Item picked successfully'} `);
          // this.router.navigate(['/app/pickingorders']); // redirect to view picking order screen
        }
        this.cd.detectChanges();
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })
  }


  closeModal() {
    this.modalRef.close();
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


  confirmBilling(qrcontent: any, billingItem: Ordering.Orderitem, index: number): void {
    this.modalRef = this.modalService.open(qrcontent);
    this.uuid_mismatch = false;
    this.currentItemClickedForQR = billingItem;
  }

  /* desc : Enable move to billing option when every item status is picked*/
  isReadyForBilling(): boolean {
    let isReady = false;
    if (Object.keys(this.orderDatum).length && this.orderDatum.orderitems) {
      isReady = this.orderDatum.orderitems.every(eachItem => {
        return eachItem.status === 'Picked'
      })
    }
    return isReady;
  }

  /*  desc : Assign Picked status manually in UI after item scan success 
             This avoids making API calls to get latest status*/
  assignItemPicked(itemUUID: string) {
    if (Object.keys(this.orderDatum).length && this.orderDatum.orderitems?.length) {
      this.orderDatum.orderitems.map((eachItem, index) => {
        if (this.orderDatum.orderitems?.length && eachItem.item_uuid === itemUUID) {
          this.orderDatum.orderitems[index].status = 'Picked';
        }
      })
    }
  }

  numberFormat(num: any) {
    return this.utlis.numberFormat(num);
  }

}
