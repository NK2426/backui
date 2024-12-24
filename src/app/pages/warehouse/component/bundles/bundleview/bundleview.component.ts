import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { QRCodeModule } from 'angularx-qrcode';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Bundle } from '../../../models/inventory';
import { Inwarditem } from '../../../models/product';
import { BundleService } from '../../../services/bundle.service';

// the scanner!
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-bundleview',
  templateUrl: './bundleview.component.html',
  styleUrls: ['./bundleview.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule, ZXingScannerModule]
})
export class BundleviewComponent implements OnInit {

  viewbundle: Bundle = {};
  inwarditems: Inwarditem[] = [];
  status: Array<{ id: string, name: string }> = [{ id: 'Deficit', name: 'Deficit (Low)' }, { id: 'Excess', name: 'Excess (High)' }, { id: 'QC', name: 'Equal' }];
  bundleapprove = { status: '', comments: '', image: '', inwardcount: 0 };
  actionnew = false;
  actionreason = false;

  scanqrcode = '';
  qrResultString: string = '';
  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  hasPermission: boolean = false;


  constructor(
    private route: ActivatedRoute, private router: Router,
    private bundleservice: BundleService, private toast: ToastService,
    private modalService: NgbModal, private cdr: ChangeDetectorRef,
    private utlis: UtilsService
  ) { }
  ngOnInit(): void {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.scanqrcode = uuid;
      this.verifyQRcode()
    } else {
      //this.router.navigate(['/app/']);
    }
  }
  verifyQRcode() {
    // this.bundleservice.find(this.scanqrcode)
    //     .subscribe({
    //       next: bundle => {           
    //         if (bundle.status === 'Inward') {
    //           this.viewbundle = bundle;
    //           let inwardcount = bundle.inwardcount || 0;
    //           this.bundleapprove.inwardcount = inwardcount;
    //           this.inwarditems = bundle.inwarditems || [];
    //           this.actionnew = true;
    //           //this.router.navigate(['/app/']);
    //         }else{
    //           this.toast.failure('Bundle not in Inward Stage.');
    //         }
    //       },
    //       error: () => {
    //         this.toast.failure('Bundle not in Inward Stage.');
    //         //this.router.navigate(['/app/']);
    //       }
    //     });

  }
  scaningqrcode() {
    this.redirectTo('/app/bundles/stocking/' + this.scanqrcode);
  }
  generatepsid() {
    //let uuid = this.route.snapshot.paramMap.get('uuid') || '';
    let uuid = this.viewbundle.bundleID || '';
    this.bundleservice.generatepsid({}, uuid)
      .subscribe({
        next: inwrditems => {
          this.inwarditems = inwrditems
        },
        error: () => {
          this.router.navigate(['/app/']);
        }
      });
  }
  printPage() {
    if (document.getElementById('print')) {
      var printContents = document.getElementById('print');
      document.body.innerHTML = '<html><head></head><body><style>img { width:500px; height: 400px; }</style>' + printContents?.innerHTML + '</body></html>';
      window.print();
      window.location.reload()
    }
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      //console.log(file)
      this.bundleapprove.image = file
    }
  }

  updateformstatus() {
    if (this.bundleapprove.status !== 'QC' && this.bundleapprove.comments === '') {
      this.actionreason = true
      return
    } else {
      const formd: any = new FormData();
      formd.append('status', this.bundleapprove.status);
      formd.append('comments', this.bundleapprove.comments);
      formd.append('image', this.bundleapprove.image);
      formd.append('inwardcount', this.bundleapprove.inwardcount);
      let msg = this.bundleapprove.status;
      let conf = 'Move to ' + msg + ' Section Confirmation. Do you want to continue?';
      if (confirm(conf)) {

        this.bundleservice.bundlemove(this.viewbundle.bundleID, formd).subscribe({
          next: resp => {
            this.toast.success('Successfully Updated');
            this.redirectTo('/warehouse/bundles/stocking');

          }, error: err => {
            this.toast.failure(err.error.message);
          }
        })
      }
    }
  }

  approve() {
    if (this.bundleapprove.status !== 'QC' && this.bundleapprove.comments === '') {
      this.actionreason = true
      return
    } else {
      if (confirm('Do you want to continue?')) {
        this.bundleservice.approval(this.viewbundle.bundleID, this.bundleapprove).subscribe({
          next: resp => {
            this.toast.success('Successfully Updated');
            this.redirectTo('/warehouse/bundles/stocking/' + this.bundleapprove.status);
            //this.ngOnInit()
          }, error: err => {
            this.toast.failure(err.error.message);
          }
        })
      }

    }
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  onCodeResult(resultString: string) {
    //this.qrResultString = resultString;
    this.addalertsound()
    this.scanqrcode = resultString;
    this.scaningqrcode()
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
    osc.type = 'triangle'; // this is the default - also square, sawtooth, triangle
    osc.frequency.value = 220; // Hz
    osc.connect(context.destination); // connect it to the destination
    osc.start(); // start the oscillator
    osc.stop(context.currentTime); // stop 2 seconds after the current time
  }



}
