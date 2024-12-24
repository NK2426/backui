import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';

import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Slots } from 'src/app/pages/warehouse/component/packing-order/outward-invoice/outward-invoice.component';
import { INVOICE } from 'src/app/pages/warehouse/models/invoice';
import { Settings } from 'src/app/pages/warehouse/models/settings';
import { InvoiceService } from 'src/app/pages/warehouse/services/invoice.service';
import { PurchaseorderService } from 'src/app/pages/warehouse/services/purchaseorder.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-shipped-invoice',
  templateUrl: './view-shipped-invoice.component.html',
  styleUrls: ['./view-shipped-invoice.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule, ZXingScannerModule, NgbPaginationModule]
})
export class ViewShippedInvoiceComponent implements OnInit {
  invoiceDetail!: INVOICE.InvoiceDetail;
  invoiceNumber!: string;
  settings?: Settings;
  slotsOption!: Slots[];
  selectedSlot!: number;
  submit: Boolean = false;
  pageSize = 24;
  page = 1;
  formData!: FormGroup;
  model!: NgbDateStruct;
  warehouse:any
  showprint = true;
  baseurl: string = '';

  showprintinv = true;
  instruction = [{ displayname: 'RAD (REAttempt)', value: 'RAD' }, { displayname: 'RTO (Cancellation/ Return to Origin)', value: 'RTO' }]

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private toast: ToastService, private utils: UtilsService,
    private invoiceService: InvoiceService, private porderservice: PurchaseorderService, private formBuilder: FormBuilder, private modelservice: NgbModal, private dataformat: NgbDateParserFormatter) { }

  ngOnInit(): void {
    let invoicenumber = this.route.snapshot.paramMap.get('invoicenumber');
    this.baseurl = environment.PDF_BASE_URL;

    if (invoicenumber) {
      this.invoiceNumber = invoicenumber;
      this.slotsOption = [
        { displayName: 'Slot 1(8AM-12PM)', value: 1 },
        { displayName: 'Slot 2(12PM-4PM)', value: 2 },
        { displayName: 'Slot 3(4PM-8PM)', value: 3 },
      ];
      this.model = this.utils.ngbStructure(this.utils.substractDays(new Date(), 0));
      //this.selectedSlot = this.slotsOption[0].value as number;
      this.list(invoicenumber);
      // this.getAddress();
    }

    this.formData = this.formBuilder.group({
      instruction: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      deliverydate: [this.model, [Validators.required]],
      deliveryslot: [1, [Validators.required]]
    });


  }



  list(invoiceNumber: string) {
    this.invoiceService.getInvoiceById(invoiceNumber)
      .subscribe({
        next: (invoiceDetail: INVOICE.InvoiceHttpResponse) => {
          if (invoiceDetail && Object.keys(invoiceDetail).length && invoiceDetail.data && Object.keys(invoiceDetail.data).length) {
            this.invoiceDetail = invoiceDetail.data;
            // console.log("warehouse",this.invoiceDetail.warehouse);
            this.warehouse = this.invoiceDetail.warehouse
            
            this.cdr.detectChanges();
          }
        },
        error: () => {
        }
      });
  }


  // getAddress() {
  //   this.porderservice.findsetting().subscribe({
  //     next: data => {
  //       this.settings = data;
  //     }
  //   })
  // }

  hittingNDR(): void {
    if (this.formData.invalid) {
      return;
    } else {
      if (confirm('Are you sure want to continue to NDR?')) {

        this.submit = true;
        let data = this.formData.value;
        data.deliverydate = this.dataformat.format(data.deliverydate);
        this.invoiceService.ndrHitting(this.invoiceDetail.invoiceno, data).subscribe({
          next: resp => {
            if (resp.awbGenerateStatus !== 'Yes') {
              let reason = resp.reason || 'Try again later...'
              this.toast.failure('NDR Not Update...' + reason);
              this.submit = false;
            }
            else {
              this.toast.success(`${'NDR Updated Successfully'} `);
              this.list(this.invoiceDetail.invoiceno)
              this.submit = false;
            }
          }, error: err => {
            this.toast.failure('NDR Not Updated... Try again later...');
            this.submit = false;
          }
        })
      }
    }
  }
  cancelShipment(): void {


    if (confirm('Do you want to cancel this shipment?')) {

      let data = { status: 'Cancel' }
      this.invoiceService.generateAWB(this.invoiceDetail.invoiceno, data).subscribe({
        next: resp => {
          //console.log(resp.awbGenerateStatus)
          if (resp.awbGenerateStatus !== 'Yes') {
            let reason = resp.reason || 'Try again later...'
            this.toast.failure('Shipment Not Cancelled...' + reason);
            this.submit = false;
          }
          else {
            this.toast.success(`${'Shipment Cancelled Successfully'} `);
            this.list(this.invoiceDetail.invoiceno)
            this.submit = false;
          }
        }, error: err => {
          this.toast.failure('Shipment Not Cancelled... Try again later...');
        }
      })
    }
  }

  get form() {
    return this.formData.controls;
  }


  inWords(num: any) {
    let n: any;
    let str = '';
    let a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    let b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
  }

  changeSlotOptions(event: any) {

  }

  download() {
    this.showprint = false;
    this.invoiceService.download(this.invoiceNumber).subscribe({
      next: resp => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + this.invoiceNumber + '.pdf';
          link.target = "new"
          //link.download = path;
          document.body.appendChild(link);
          //console.log(link)
          link.click();
          this.showprint = true;
          link.remove();
        }

      }, error: err => {
        this.toast.failure("Error while download file : " + err.error.message);
      }
    })
  }

  downloadinv() {
    this.showprintinv = false;
    this.invoiceService.downloadinvoice(this.invoiceNumber).subscribe({
      next: resp => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + 'INV_' + this.invoiceNumber + '.pdf';
          link.target = "new"
          //link.download = path;
          document.body.appendChild(link);
          //console.log(link)
          link.click();
          this.showprintinv = true;
          link.remove();
        }

      }, error: err => {
        this.toast.failure("Error while download file : " + err.error.message);
      }
    })
  }


}
