import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import {
  BehaviorSubject,
  debounceTime,
  fromEvent,
  map,
  Subscription
} from 'rxjs';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { AUDITING } from '../../models/audit';
import { AuditingService } from '../../services/audit.service';


@Component({
  selector: 'app-shelf-movement',
  templateUrl: './shelf-movement.component.html',
  styleUrls: ['./shelf-movement.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule, ZXingScannerModule, NgbPaginationModule]
})
export class ShelfMovementComponent implements AfterViewInit {
  locationList!: AUDITING.Location[];
  title = 'Shelf transfer';
  /* zxing config  - to scan using camera*/
  scanqrcode = '';
  search = '';
  qrResultString: string = '';
  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  hasPermission: boolean = false;
  page = 1;
  count = 0;
  pageSize = 20;
  subscription!: Subscription;
  scancompleted = false;
  enableConfirm = false;
  destinationShelfID = '';
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  scanneditems!: number;
  modalRef: any = {};
  insbulkitems: any[] = []
  shelf: any = {};
  showqcscan: boolean = true;



  constructor(
    private auditService: AuditingService, private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private utlis: UtilsService,
    private modalService: NgbModal,
  ) { }

  ngAfterViewInit() {
    // server-side search - Added below logic to avoid server hit on every key up
    this.subscription = fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event) => this.searchInput.nativeElement.value),
        debounceTime(1000)
      )
      .subscribe((val) => {
        this.locationList = [];
        this.enableConfirm = false;
        this.search = val;
        this.list();
      });
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, 0, 0);

    this.auditService.getShelfdetail(this.search).subscribe({
      next: (list) => {
        this.shelf = list.data;
        //console.log(this.shelf)
        this.auditService.getLocationAuditing(params).subscribe({
          next: (list) => {
            this.locationList = list.data;
            this.cdr.detectChanges();
          },
          error: (error) => {
            this.toast.failure('Error getting the audit.. Please Try again!!');
            this.locationList = [];
          }
        });
      },
      error: (error) => {
        this.toast.failure('Shelf not found.. Please Try again!!');
        this.locationList = [];
      }
    });

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

  opentoShelfScan(shelfQRUUID: any): void {
    this.showqcscan = false;
    this.modalRef = this.modalService.open(shelfQRUUID, {
      size: 'sm',
      animation: true
    });
  }

  closeModal() {
    this.showqcscan = true;
    this.modalRef.close();
  }

  /* @desc : Item scan success  */
  onItemScan(psid: string) {
    if (!this.locationList || !this.locationList.length) {
      this.toast.failure('Search shelf first to scan items');
      return;
    }
    this.auditService.validateItem(psid).subscribe({
      next: (resp) => {
        if (resp.status == 'failure') {
          this.toast.failure(resp.message);
        } else {
          if (resp.data.shelfing.group_id === this.shelf.group_id && resp.data.shelfing.products === this.shelf.products) {
            const responseUUID = resp.data.psid;
            if (this.validateItem(responseUUID) == 'true') {
              this.toast.success('Item Matched');
            } else {
              if (resp.data.skuid) {
                resp.data.status = 'excess';
                this.locationList.push(resp.data);
                this.toast.success('Item Added');
              } else {
                this.toast.failure('Item not in the list');
              }
            }
            let samepsid = this.insbulkitems.findIndex(res => res.psid == responseUUID);
            if (samepsid < 0) {
              this.insbulkitems.push({ psid: responseUUID, shelfID: resp.data.shelfing.shelfID })
            }
          } else {
            this.toast.failure('This item not match (Group and Variant): ShelfID' + resp.data.shelfing.shelfID);
          }
        }
      },
      error: (err) => {
        this.toast.failure(err.error.message);
      }
    });
  }

  /* Ensures scanned stock are as same as listed */
  validateItem(responseUUID: string) {
    let isValid = 'false';
    this.locationList?.map((eachItem, index) => {
      if (eachItem.psid === responseUUID) {
        isValid = 'true';
        if (eachItem.status != 'excess') {
          this.locationList[index].status = isValid;
        }
      }
    });
    return isValid;
  }

  scantoShelf(shelfID: string) {
    this.addalertsound();
    this.enableConfirm = true;
    this.destinationShelfID = shelfID;
  }

  moveToDestShelf() {
    let movedata = this.insbulkitems.filter(res => res.shelfID !== this.destinationShelfID)
    //console.log(movedata)
    this.auditService.movetoBin(this.destinationShelfID, movedata).subscribe({
      next: (list) => {
        this.toast.success('Successfully moved to Shelf. Please place the items to shelf.');
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      },
      error: (error) => {
        let err = error.error || {}
        this.toast.failure(err.message || 'Error getting the audit.. Please Try again!!');
      }
    });
    ////console.log(this.insbulkitems)
    // api integration to be done
  }

  addalertsound() {
    var context = new window.AudioContext();
    var osc = context.createOscillator(); // instantiate an oscillator
    osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
    osc.frequency.value = 440; // Hz
    osc.connect(context.destination); // connect it to the destination
    osc.start(); // start the oscillator
    osc.stop(context.currentTime + 1); // stop 2 seconds after the current time
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
