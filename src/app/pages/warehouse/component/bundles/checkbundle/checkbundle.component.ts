import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Bundle } from '../../../models/inventory';
import { Purchaseorder } from '../../../models/purchaseorder';
import { BundleService } from '../../../services/bundle.service';
import { PurchaseorderService } from '../../../services/purchaseorder.service';

@Component({
  selector: 'app-checkbundle',
  templateUrl: './checkbundle.component.html',
  styleUrls: ['./checkbundle.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule, ZXingScannerModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule]
})
export class CheckbundleComponent implements OnInit {


  bundles: Bundle[] = [];
  purchaseitems!: any;
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  selectedBrand: any = {}
  status: Array<{ id: string, name: string }> = [{ id: 'Accepted', name: 'Accepted' }, { id: 'Declined', name: 'Declined' }, { id: 'Halt', name: 'Halt' }, { id: 'Reject', name: 'Reject' }];
  actionreason = false;
  scanqrcode = '';
  selectBundle: Bundle = {};
  scanBundle: Bundle = {};
  currentIndex = -1;
  viewCompare = false;

  type = ''
  inwarditemcount = 0
  data: Purchaseorder = {};

  //// Dispute Form ///
  disputeForm !: FormGroup;
  gsubmit: Boolean = false;
  disputetypes: Array<{ id: string, name: string }> = [{ id: 'Damage', name: 'Damage' }, { id: 'Missing', name: 'Missing' }];
  disputeimage: string = '';
  /////


  /// Bundle ////
  scanedbundle: any = {};
  passedbundle: any[] = [];
  totalbundles = 0;
  purchaseorder_id = 0;

  qrResultString: string = '';
  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  hasPermission: boolean = false;

  constructor(
    private route: ActivatedRoute, private router: Router,
    private bundleservice: BundleService, private toast: ToastService,
    private modalService: NgbModal, private cdr: ChangeDetectorRef,
    private utlis: UtilsService,
    private fb: FormBuilder, private poservice: PurchaseorderService,
  ) { }

  ngOnInit(): void {

    this.disputeForm = this.fb.group({
      bundleId: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      photo: ['']
    })

    let uuid = this.route.snapshot.paramMap.get('poid');
    if (uuid) {
      this.poservice.fulldetail(uuid)
        .subscribe({
          next: data => {
            this.data = data;
            this.cdr.detectChanges();
          },
          error: () => {
            this.toast.failure('Internal Server Error.. Please Try again!!');
          }
        });
    }


  }

  verifyQRcode() {
    this.addalertsound()
    let bundleid = this.scanqrcode;

    this.bundleservice.findall(this.scanqrcode, this.data.id)
      .subscribe({
        next: bundles => {
          this.bundles = bundles || []; this.passedbundle = [];
          this.totalbundles = bundles.length;
          this.purchaseorder_id = bundles[0]['purchaseorder_id'] || 0;
          this.viewCompare = true;
          this.scanedbundle[bundleid] = bundleid;
          
          let checkindex = this.passedbundle.findIndex(res => res === bundleid)
          //console.log(checkindex)
          if (checkindex < 0) {
            this.passedbundle.push(bundleid)
            let bundleIndex = this.bundles.findIndex(res => res.bundleID === bundleid)
            this.bundles[bundleIndex]['passed'] = true;
          }

          this.scanqrcode = '';
        },
        error: (err) => {
          this.scanqrcode = '';
          this.bundles = [];
          this.viewCompare = false;
          this.toast.failure(err);

        }
      });


  }
  singleverifyQRcode() {
    this.addalertsound()
    let scanqrcode = this.scanqrcode;
    this.bundleservice.find(scanqrcode, this.data.id)
      .subscribe({
        next: bundle => {
          if (bundle.bundleID)
            this.scanedbundle[bundle.bundleID] = bundle.bundleID;

          let checkindex = this.passedbundle.findIndex(res => res === bundle.bundleID)
          if (checkindex < 0) {
            this.passedbundle.push(bundle.bundleID)
            let bundleIndex = this.bundles.findIndex(res => res.bundleID === bundle.bundleID)
            this.bundles[bundleIndex]['passed'] = true;
          }

          this.viewCompare = true;
          this.scanqrcode = '';
        },
        error: () => {
          this.scanedbundle[scanqrcode] = scanqrcode;
          this.scanBundle = {};
          this.scanqrcode = '';
        }
      });
  }
  passingBundle(i: number) {
    if (this.bundles[i]) {
      let bundleID = this.bundles[i]['bundleID']

      let checkindex = this.passedbundle.findIndex(res => res === bundleID)
      if (checkindex < 0)
        this.passedbundle.push(bundleID)

      this.bundles[i]['passed'] = true;
      this.scanedbundle[bundleID || ''] = bundleID;
    }

    //console.log(this.passedbundle)
  }
  disputeBundle(i: number, content: any) {
    if (this.bundles[i]) {
      this.bundles[i]['passed'] = false;
      this.scanedbundle[this.bundles[i]['bundleID'] || ''] = this.bundles[i]['bundleID'];
      let checkindex = this.passedbundle.findIndex(res => res === this.bundles[i]['bundleID'])
      if (checkindex >= 0)
        this.passedbundle.splice(checkindex, 1)

      this.disputeForm.get("bundleId")?.setValue(this.bundles[i]['bundleID']);

      const modelref = this.modalService.open(content, { size: 'md' });
    }
  }
  totalscan() {
    let count = Object.keys(this.scanedbundle).length;
    return count;
  }

  move(fstatus: string = 'Inward', mstatus: string) {
    if (confirm('Do you want to continue ? ')) {

      let data = { bundles: this.bundles, purchaseid: this.purchaseorder_id, status: mstatus, inwardcount: this.inwarditemcount }
      this.bundleservice.bulkmove(data).subscribe({
        next: resp => {
          this.toast.success('Successfully Move to Inward Stage');
          this.viewCompare = false;
          this.ngOnInit()
          this.modalService.dismissAll()
          // this.redirectTo('/app');
          this.router.navigate(['/warehouse/orders/qc'])
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  onCodeResult(resultString: string) {
    //this.qrResultString = resultString;
    this.scanqrcode = resultString;
    if (this.viewCompare)
      this.singleverifyQRcode()
    else
      this.verifyQRcode()
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
  clearResult(): void {
    this.qrResultString = '';
  }
  addalertsound() {
    var context = new (window.AudioContext)();
    var osc = context.createOscillator(); // instantiate an oscillator
    osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
    osc.frequency.value = 440; // Hz
    osc.connect(context.destination); // connect it to the destination
    osc.start(); // start the oscillator
    osc.stop(context.currentTime + 1); // stop 2 seconds after the current time
  }

  get disputeform() {
    return this.disputeForm.controls;
  }
  saveDispute() {
    this.gsubmit = true;
    if (this.disputeForm.invalid) {
      return;
    }
    const formd: any = new FormData();
    formd.append('bundleId', this.disputeForm.get('bundleId')?.value);
    formd.append('reason', this.disputeForm.get('reason')?.value);
    formd.append('image', this.disputeForm.get('photo')?.value);

    this.bundleservice.saveDisupteBundleImage(formd).subscribe({
      next: () => {
        this.gsubmit = false;
        this.disputeimage = '';
        this.disputeForm.reset()
        this.modalService.dismissAll();
        this.toast.success('Successfully Saved');
        this.cdr.detectChanges();
      }, error: (err: any) => {
        this.toast.failure(err?.error?.message);
      }
    });
  }


  onSelectedImage(event: any) {
    var mimeType = event.target.files[0].type;
    if (event.target.files && event.target.files[0] && mimeType.match('image.*')) {
      this.disputeForm.get("photo")?.setValue(event.target.files[0]);
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.disputeimage = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else {
      this.disputeForm.get("photo")?.setValue('');
      this.toast.failure("Upload Image only");
    }
  }

}
