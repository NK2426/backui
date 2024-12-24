import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';


import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { environment } from 'src/environments/environment';

import { Settings } from '../../../models/settings';

import { TicketOrderInvoiceService } from 'src/app/pages/customer-support/services/ticketorderinvoice.service';
import { RETURN } from 'src/app/pages/warehouse/models/return';
import { ReturnService } from 'src/app/pages/warehouse/services/returns.service';
import { PurchaseorderService } from 'src/app/pages/warehouse/services/purchaseorder.service';


@Component({
  selector: 'app-view-return-detail',
  templateUrl: './view-return-detail.component.html',
  styleUrls: ['./view-return-detail.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule, ZXingScannerModule, NgbPaginationModule]
})
export class ViewReturnDetailComponent implements OnInit {

  returnDetail!: RETURN.Return;
  settings?: Settings;
  uuid!: string;
  invoiceNumber!: string;

  submit: Boolean = false;
  pageSize = 24;
  page = 1;
  formData!: FormGroup;
  showprint: boolean = true;
  showAction: boolean = true;
  show_inv_btn: boolean = false;
  baseurl: string = '';
  total = 0;
  checked = 0;

  constructor(private route: ActivatedRoute, private ticketOrderInvoicService: TicketOrderInvoiceService, private cdr: ChangeDetectorRef, private modelservice: NgbModal, private router: Router, private toast: ToastService, private utlis: UtilsService,
    private returnsService: ReturnService, private porderservice: PurchaseorderService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    let uuid = this.route.snapshot.paramMap.get('returnuuid');

    this.baseurl = environment.PDF_BASE_URL;
    // console.log('insiode list',uuid);
    if (uuid) {
      this.uuid = uuid;
      this.list(uuid);
      this.getAddress();
      // console.log('insiode list');
    }
    this.formData = this.formBuilder.group({
      length: ['', [Validators.required]],
      breath: ['', [Validators.required]],
      height: ['', [Validators.required]],
      weight: ['', [Validators.required]],
    });
  }



  list(uuid: string) {
    // console.log('insiode list');
    this.returnsService.getReturnDetail(uuid)
      .subscribe({
        next: (returnDetail: RETURN.ReturnHttpResponse) => {
          if (returnDetail && Object.keys(returnDetail).length && returnDetail.data && Object.keys(returnDetail.data).length) {
            this.returnDetail = returnDetail.data;
            this.invoiceNumber = returnDetail.data.invoiceno;

            this.returnDetail.returnitems.forEach(e => {
              e.ship_status == 'Initiated' ? this.show_inv_btn = true : ''
            })

            this.total = this.returnDetail.returnitems.reduce(function (sum: any, current: any) {
              return sum + parseInt(current.orderitem.subtotal);
            }, 0)
            this.cdr.detectChanges();
          }
        },
        error: () => {
        }
      });
  }


  getAddress() {
    this.porderservice.findsetting().subscribe({
      next: data => {
        this.settings = data;
      }
    })
  }

  saveBill(): void {
    this.submit = true;
    if (this.formData.invalid) {
      //console.log(this.formData);
      return;
    }

  }

  get form() {
    return this.formData.controls;
  }



  submitDetail() {
    let selecteditems = this.returnDetail.returnitems.filter((itm) => itm.checked == true)
    let selectedids = selecteditems.map((itm) => itm.orderitem_uuid)
    let data = { status: 'Create', returnitems: selectedids };
    if (selectedids.length <= 0) {
      this.toast.failure('Select Atleast one item');
      return;
    } else {
      this.returnsService.generateReturn(this.returnDetail.uuid, data).subscribe({
        next: resp => {
          if (resp.status == 'failure') {
            this.toast.failure(resp.message);
          }
          else {
            if (resp.data) {
              this.toast.success(`${resp?.message || 'Return Invoice Generated Successfully'} `);
              this.router.navigate([`/catalog/returninvoices/${resp.data.uuid}`]);
            }
          }
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
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
    return str.toUpperCase();
  }

  download(psid: any) {
    this.showprint = false;
    this.porderservice.downloadsinglepsid(psid, 2).subscribe({
      next: resp => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + psid + '.pdf';
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

  check(event: any) {
    if (event.target.checked == true)
      this.checked += 1;
    else
      this.checked -= 1;
  }
  acceptitem(returnitemuuid: string) {
    if (confirm("Are you sure you want to continue to accept this item?")) {
      this.ticketOrderInvoicService.acceptreturnItem(returnitemuuid).subscribe({
        next: (ticketOrder) => {

          this.toast.success("Successfully Accept this item");
          this.showAction = false
          // console.log(ticketOrder);
          this.show_inv_btn = true
          this.list(this.uuid);
          this.cdr.detectChanges()
        },
        error: (error) => {
          this.toast.failure("Error, Try Again.!");
        },
      });
    }
  }
  rejectitem(returnitemuuid: string) {
    if (confirm("Are you sure you want to continue to reject this item?")) {
      this.ticketOrderInvoicService.rejectretrunitem(returnitemuuid).subscribe({
        next: (ticketOrder) => {

          this.show_inv_btn = false
          this.showAction = false
          this.toast.success("Successfully Reject this item");
          this.list(this.uuid);
          this.cdr.detectChanges()
        },
        error: (error) => {
          this.toast.failure("Error, Try Again.!");
        },
      });
    }
  }
}
