import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { environment } from 'src/environments/environment';
import { RETURN } from '../../../models/return';
import { Settings } from '../../../models/settings';
import { PurchaseorderService } from '../../../services/purchaseorder.service';
import { ReturnService } from '../../../services/returns.service';

@Component({
  selector: 'app-view-return-invoice',
  templateUrl: './view-return-invoice.component.html',
  styleUrls: ['./view-return-invoice.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, NgSelectModule, RouterModule, QRCodeModule, NgbPaginationModule]
})
export class ViewReturnInvoiceComponent implements OnInit {
  returnDetail!: RETURN.Returninvoice;
  settings?: Settings;
  uuid!: string;
  invoiceNumber!: string;
  logistics: Array<{ id: string, name: string }> = [];
  submit: Boolean = false;
  pageSize = 25;
  page = 1;
  formData!: FormGroup;
  showprint: boolean = true;
  baseurl: string = '';
  total = 0;
  checked = 0;
  status = '';
  disputestatus = '';
  statustypes: Array<{ id: string; name: string }> = [
    { id: 'Accept', name: 'Accept' },
    { id: 'Reject', name: 'Reject' }
  ];
  disputetypes: Array<{ id: string; name: string }> = [
    { id: '000', name: 'Move To Inward (Shelf)' },
    { id: 'RTO01-Product damage', name: 'Product damage' },
    { id: 'RTO02-Product quality issue', name: 'Product quality issue' },
    { id: 'RTO03	Missing parts/Accessories', name: 'Missing parts/Accessories' },
    { id: 'RTO03	Intransit damage', name: 'Intransit damage' }
  ];

  formats: Array<{ id: Number; name: string }> = [
    { id: 2, name: '50mm(W)*25mm(L) Size' },
    { id: 3, name: '15mm(W)*10mm(L) Size' }
  ];
  selectedFormat = 2;
  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modelservice: NgbModal,
    private router: Router,
    private toast: ToastService,
    private utlis: UtilsService,
    private returnsService: ReturnService,
    private porderservice: PurchaseorderService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    let uuid = this.route.snapshot.paramMap.get('returnuuid');
    this.baseurl = environment.PDF_BASE_URL;
    if (uuid) {
      this.uuid = uuid;
      this.list(uuid);
      this.getAddress();
    }
    this.formData = this.formBuilder.group({
      length: ['', [Validators.required]],
      breath: ['', [Validators.required]],
      height: ['', [Validators.required]],
      weight: ['', [Validators.required]]
    });
    this.logistics = [{ id: '0', name: 'EcomExpress' }, { id: '1', name: 'Ekart' }]
  }
  list(uuid: string) {
    this.returnsService.getReturninvoiceDetail(uuid).subscribe({
      next: (returnDetail: RETURN.ReturninvoiceHttpResponse) => {
        if (returnDetail && Object.keys(returnDetail).length && returnDetail.data && Object.keys(returnDetail.data).length) {
          this.returnDetail = returnDetail.data;
          this.invoiceNumber = returnDetail.data.invoiceno;
          this.cdr.detectChanges();
          // this.total = this.returnDetail.returninvoiceitems.reduce(function (sum: any, current: any) {
          //   return sum + parseInt(current.orderitem.subtotal);
          // }, 0)
          //console.log(this.total)
        }
      },
      error: () => {}
    });
  }
  get form() {
    return this.formData.controls;
  }

  getAddress() {
    this.porderservice.findsetting().subscribe({
      next: (data) => {
        this.settings = data;
      }
    });
  }

  inWords(num: any) {
    let n: any;
    let str = '';
    let a = [
      '',
      'one ',
      'two ',
      'three ',
      'four ',
      'five ',
      'six ',
      'seven ',
      'eight ',
      'nine ',
      'ten ',
      'eleven ',
      'twelve ',
      'thirteen ',
      'fourteen ',
      'fifteen ',
      'sixteen ',
      'seventeen ',
      'eighteen ',
      'nineteen '
    ];
    let b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += n[5] != 0 ? (str != '' ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str.toUpperCase();
  }

  download(psid: any) {
    if (this.selectedFormat) {
      this.showprint = false;
      this.porderservice.downloadsinglepsid(psid, this.selectedFormat).subscribe({
        next: (resp) => {
          if (resp.message == 'Success') {
            let link = document.createElement('a');
            link.setAttribute('type', 'hidden');
            link.href = environment.PDF_BASE_URL + psid + '_' + this.selectedFormat + '.pdf';
            link.target = 'new';
            //link.download = path;
            document.body.appendChild(link);
            //console.log(link)
            link.click();
            this.showprint = true;
            link.remove();
          }
        },
        error: (err) => {
          this.toast.failure('Error while download file : ' + err.error.message);
        }
      });
    } else {
      this.toast.failure('Select the psid download format');
    }
  }
  saveReturnAWB(): void {
    if (this.formData.invalid) {
      this.toast.failure('Fill all input value');
      return;
    } else {
      if (confirm('Are you sure want to continue to generate REV AWB?')) {
        this.submit = true;
        let data = this.formData.value;
        data.status = 'Create';
        this.returnsService.generateReturnAWB(this.returnDetail.invoiceno, data).subscribe({
          next: (resp) => {
            if (resp.awbGenerateStatus !== 'Yes') {
              let reason = resp.reason || 'Try again later...';
              this.toast.failure('AWB Not Generate...' + reason);
              this.submit = false;
            } else {
              this.toast.success(`${'Awb Generated Successfully'} `);
              this.list(this.returnDetail.uuid);
              this.submit = false;
            }
          },
          error: (err) => {
            err = err.error || {};
            if (err.awbGenerateStatus !== 'Yes') {
              let reason = err.reason || 'Try again later...';
              this.toast.failure('AWB Not Generate...' + reason);
              this.submit = false;
            } else {
              this.toast.failure('AWB Not Generate...');
            }
            this.submit = false;
          }
        });
      }
    }
  }

  cancelreturnShipment(): void {
    if (confirm('Do you want to cancel this shipment?')) {
      let data = { status: 'Cancel' };
      this.returnsService.returncancelAWB(this.returnDetail.invoiceno, data).subscribe({
        next: (resp) => {
          if (resp.awbGenerateStatus !== 'Yes') {
            let reason = resp.reason || 'Try again later...';
            this.toast.failure('Shipment Not Cancelled...' + reason);
            this.submit = false;
          } else {
            this.toast.success(`${'Shipment Cancelled Successfully'} `);
            this.list(this.returnDetail.uuid);
            this.submit = false;
          }
        },
        error: (err) => {
          this.toast.failure('Shipment Not Cancelled... Try again later...');
          this.submit = false;
        }
      });
    }
  }
  returnRecevied(): void {
    if (confirm('Return Received Confirmation. Do you want to continue?')) {
      let data = { status: 'Received' };

      this.returnsService.returnReceived(this.returnDetail.invoiceno, data).subscribe({
        next: () => {
          this.toast.success(`${'Return Received Successfully'} `);
          this.list(this.returnDetail.uuid);
          this.submit = false;
          window.location.reload();
        },
        error: () => {
          this.toast.failure('Return Not Received... Try again later...');
          this.submit = false;
        }
      });
    }
  }
  submitQC(uuid: string) {
    if (this.status === 'Accept') {
      this.acceptQC(uuid);
    }
    if (this.status === 'Reject') {
      // if (this.disputestatus === '') {
      //   this.toast.failure('Select Reject Reason...');
      // } else {
        this.rejectQC(uuid);
      // }
    }

    // this.status === 'Accept' ? this.acceptQC(uuid) : this.rejectQC(uuid)
  }
  acceptQC(uuid: string): void {
    if (confirm('QC Accept Confirmation .Do you want to accept this item?')) {
      let data = { status: 'Accept', reason: "000" };
      this.returnsService.acceptqcitem(uuid, data).subscribe({
        next: (resp) => {
          this.toast.success(`${'Succesfully Accept this Item'} `);
          this.list(this.returnDetail.uuid);
          this.submit = false;
        },
        error: (err) => {
          this.toast.failure('Error... Try again later...');
          this.submit = false;
        }
      });
    }
  }
  rejectQC(uuid: string): void {
    if (confirm('QC Reject Confirmation . Do you want to reject this item?')) {
      let data = { status: 'Reject', reason: "006" };
      this.returnsService.rejectqcitem(uuid, data).subscribe({
        next: (resp) => {
          this.toast.success(`${'Succesfully Reject this Item'} `);
          this.list(this.returnDetail.uuid);
          this.submit = false;
        },
        error: (err) => {
          this.toast.failure('Error... Try again later...');
          this.submit = false;
        }
      });
    }
  }

  changeFormat(event: any) {
    this.selectedFormat = event.id;
  }
}
