import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Transaction } from '../../../models/grn';
import { PAYMENT } from '../../../models/payment';
import { Productmapparam } from '../../../models/product';
import { Productvariants } from '../../../models/productvariants';
import { Address, Poproess, Productselectimages } from '../../../models/purchaseorder';
import { Settings } from '../../../models/settings';
import { PurchaseorderService } from '../../../services/purchaseorder.service';
import { environment } from 'src/environments/environment';
import { Warehouse } from 'src/app/pages/purchaser/models/purchaseorder';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewComponent implements OnInit {
  data: any = {};
  purchaseitems: any = [];
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  poprocesslist: Poproess[] = [];
  status: Array<{ id: string; name: string }> = [
    { id: 'Accept', name: 'Accept' },
    { id: 'Vendor_revise', name: 'Revise' },
    { id: 'Decline', name: 'Decline' }
  ];

  actionreason = false;
  billaddress: Address = {};
  bundleform!: FormGroup;
  submit: boolean = false;
  siteurl: string = '';
  seldate: any = '';
  productmapparams: Productmapparam[] = [];
  genbundle = false;
  productimages: Productselectimages[] = [];
  baseurl: string = '';
  taxvalue = 0;
  discount = 0;
  docArray: any = [];
  purdocArray: any = [];
  seldocArray: any = [];
  docForm!: FormGroup;
  gsubmit = false;
  addfile: string = '';
  fileName: any = '';
  warehouse: Warehouse;

  addShipperForm!: FormGroup;

  showprint = true;

  public user = JSON.parse(localStorage.getItem('auth_user') || '{}');

  variants: Productvariants[] = [];
  taxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 };
  qtytotal = 0;
  mappedvaiants: any = {};

  settings?: Settings;

  paymentcycles: PAYMENT.Paymentcycle[] = [];
  paymentcyclearr: Array<any> = [];
  payform!: FormGroup;
  transactions: Transaction[] = [];
  totalamount = 0;
  totalgrnvalue = 0;
  show: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private porderservice: PurchaseorderService,
    private toast: ToastService,
    private modelservice: NgbModal,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }
  shipperForm: FormGroup;
  // headapprove = { status: '', comments: '', vendordocuments:[] };
  headapprove = { status: '', comments: '', vendordocuments: '' };

  ngOnInit(): void {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    this.seldate = date.toISOString().slice(0, 16).split('T')[0] + 'T00:00';
    this.siteurl = this.porderservice.siteurl;
    this.baseurl = environment.PDF_BASE_URL;
    this.shipperForm = this.fb.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]]
    });

    let uuid = this.route.snapshot.paramMap.get('uuid');
    let id: any;
    if (uuid) {
      this.porderservice.fulldetail(uuid).subscribe({
        next: (data) => {
          this.data = data;

          id = data.warehouse.id;
          if (data.expiredoc !== '') {
            this.show == true;
          }
          this.getwarehouse(id);
          this.cd.detectChanges();
          this.totalgrnvalue = this.data.grandtotal || 0;
          if (this.data?.paymentterm_id) {
            this.porderservice.getpaymentcycles(this.data?.paymentterm_id || 0).subscribe({
              next: (data) => {
                this.paymentcycles = data.data;
                // console.log(this.paymentcycles);
                this.paymentcyclearr = this.paymentcycles.map((cycle: any) => {
                  return { id: cycle.id, name: cycle.type + ' - ' + cycle.percentage + '%' };
                  //console.log(this.paymentcyclearr)
                });
              }
            });
            this.payform = this.fb.group({
              amount: ['', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
              transactionid: ['', [Validators.required]],
              grnid: [''],
              description: [''],
              expensedate: ['', [Validators.required]],
              paymentcycle_id: ['', [Validators.required]]
            });
          }

          this.porderservice.getTransactions(uuid).subscribe({
            next: (resp) => {
              this.transactions = resp || [];
              this.totalamount = this.transactions.reduce(function (sum: any, current: any) {
                return sum + parseInt(current.amount);
              }, 0);
              this.cd.detectChanges()
            },
            error: () => { }
          });

          if (data.status == 'Revision') {
            this.fromstatus = 'Revision';
            this.tostatus = 'Revised';
          }
          this.purchaseitems = [];
          if (data.purchaseorderitems) {
            let variantdata: Productvariants[] = [];

            if (data.purchaseorderitems) {
              this.taxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 };

              data.purchaseorderitems.forEach((orderitem: any) => {
                // if (orderitem.purchaseitemdetails) {
                //   orderitem.purchaseitemdetails.forEach((val: any) => {
                //     if (val.productvariant.id) {
                //       let checkvariant = variantdata.findIndex(res => res.id === val.productvariant.id)
                //       if (checkvariant < 0) {
                //         variantdata.push({ id: val.productvariant.id, name: val.productvariant.name, productvariantvalues: (val.productvariant.productvariantvalues || []) })
                //       }
                //       let pid = orderitem.product_id || 0;
                //       if (!this.mappedvaiants[pid])
                //         this.mappedvaiants[pid] = {}
                //       this.mappedvaiants[pid][val.productvariant.id] = true;
                //     }
                //     this.variants = variantdata;
                //   })
                // }
                this.qtytotal += orderitem.quantity;
                if (orderitem.ifigst + '' == '1') {
                  this.taxtotal.ifigst = 1;
                }
                this.taxtotal.ctaxtotal += parseFloat(orderitem.ctaxval);
                this.taxtotal.staxtotal += parseFloat(orderitem.staxval);
                this.taxtotal.itaxtotal += parseFloat(orderitem.itaxval);
              });
            }
            // this.purchaseitems = data.purchaseorderitems[0]['purchaseitemdetails']
          }

          if (data.user.addresses && data.user.addresses.length > 0) {
            // console.log(data.user.addresses[0]);
            this.billaddress = data.user.addresses[0];
          }
          if (data.product && data.product.productmapparams) {
            this.productmapparams = data.product.productmapparams;

            this.productmapparams = this.productmapparams?.filter((val) => val.value_id > 0);
          }

          if (data.product && data.product.productselectimages) {
            this.productimages = data.product.productselectimages;
          }
          if (data.discountype + '' === '1') this.discount = data.discount;
          else if (data.discountype + '' === '2') this.discount = (data.total * data.discount) / 100;

          if (data.taxpercentage > 0) {
            //this.taxvalue = ((data.total-this.discount) * data.taxpercentage)/100;
          }
          //this.poprocess()
        },
        error: () => { }
      });

      this.porderservice.findsetting().subscribe({
        next: (data) => {
          this.settings = data;
        }
      });
    }
  }

  getwarehouse(id: any) {
    this.porderservice.Warehouse(id).subscribe({
      next: (data) => {
        this.warehouse = data;
        // this.cd.detectChanges();
        // console.log(this.warehouse);
        this.cd.detectChanges();
      }
    });
  }

  get form() {
    return this.payform.controls;
  }

  savePayment() {
    this.submit = true;
    if (this.payform.invalid) {
      return;
    }
    if (this.data?.grandtotal) {
      //let total:number = this.purchaseorder?.grandtotal || 0;
      let amounttoenter = this.data?.grandtotal - this.totalamount;
      if (amounttoenter < this.payform.value.amount) {
        this.toast.failure('Enter amount less than or equal to total amount');
        return;
      }
    }
    this.payform.value.id = this.data.id;

    this.porderservice.makepayment(this.data?.uuid, this.payform.value).subscribe({
      next: (resp) => {
        this.toast.success('Make Payment Successfully');
        this.payform.reset();
        this.submit = false;
        this.ngOnInit();
      },
      error: (err: any) => {
        this.toast.failure(err.error.message);
      }
    });
  }

  download() {
    this.showprint = false;
    this.porderservice.download(this.data.uuid).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = this.baseurl + this.data.uuid + '.pdf';
          link.target = 'new';
          // link.download = path;
          document.body.appendChild(link);
          // console.log(link.href);
          link.click();
          link.remove();
        }
      },
      error: (err) => {
        console.log('error');
        this.toast.failure('Error while download file : ' + err.error.message);
      }
    });
    this.showprint = true;
  }

  toFloat(num: any) {
    return parseFloat(num) || 0;
  }
  toInt(num: any) {
    return parseInt(num) || 0;
  }

  numberFormat(num: any) {
    if (num) {
      var ans = num.toLocaleString('en-IN', { currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return ans;
    } else return 0;
  }
}
