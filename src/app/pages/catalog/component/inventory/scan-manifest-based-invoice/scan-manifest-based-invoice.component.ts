import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SCAN_MANIFEST_ORDER } from '../../../models/scan-mbo';
import { ScanManifestService } from '../../../services/scanmanifest-invoice.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';


@Component({
  selector: 'app-scan-manifest-based-invoice',
  templateUrl: './scan-manifest-based-invoice.component.html',
  styleUrls: ['./scan-manifest-based-invoice.component.scss']
})
export class ScanManifestBasedInvoiceComponent implements OnInit {


  existingMBO?: SCAN_MANIFEST_ORDER.MANIFEST_DETAIL[];
  currentIndex = -1;
  addAction = false;
  viewAction = false;
  title = 'Scan Invoice Manifest'
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 20;
  pageSizes = [20, 30, 50, 100];

  /* zxing config  - to scan using camera*/
  scanqrcode = '';
  qrResultString: string = '';
  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  hasPermission: boolean = false;
  scanedaws: any = [];

  constructor(private orderingService: ScanManifestService, private router: Router, private toast: ToastService, private utlis: UtilsService) { }

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    const params = this.utlis.getRequestParams(this.search, this.page, this.pageSize)
    this.orderingService.getAllMBO(params)
      .subscribe({
        next: responseMBO => {
          if (responseMBO?.length) {
            this.existingMBO = responseMBO;
          }
        }, error: error => {
          this.toast.failure("Error getting the manifest.. Please Try again!!");
        }
      })
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
  showexists(awb: any) {
    // console.log(this.scanedaws.includes(awb))
    return this.scanedaws.includes(awb)
  }

  /* @desc : Item scan success  */
  onItemScan(awbNumber: string) {
    this.orderingService.createMBO({ awbnumber: awbNumber }).subscribe({
      next: resp => {
        if (resp.status == 500) {
          this.toast.failure(resp.message);
        }
        else {
          const responseUUID = resp.message;
          this.scanedaws.push(awbNumber)

        }
      }, error: err => {
        // console.log(this.scanedaws);
        if (!this.scanedaws.includes(awbNumber)) {
          this.toast.failure(err);
        }
      }
    })
  }

  searchpsid() {
    let item = this.search;
    this.onItemScan(item);
    this.search = ''
  }

}
