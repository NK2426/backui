import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Grn, Transaction } from '../../../models/grn';
import { Bundle } from '../../../models/inventory';
import { PAYMENT } from '../../../models/payment';
import { Inwarditem } from '../../../models/product';
import { Productvariants } from '../../../models/productvariants';
import { Purchaseorder, Address } from '../../../models/purchaseorder';
import { Settings } from '../../../models/settings';
import { BundleService } from '../../../services/bundle.service';
import { PurchaseorderService } from '../../../services/purchaseorder.service';
import { Warehouse } from 'src/app/pages/purchaser/models/purchaseorder';

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GrnComponent implements OnInit {
  bundles: Bundle[] = [];
  purchaseorder?: any;
  currentBundle: Bundle = {};
  currentIndex = -1;
  currentInitem?: Inwarditem[] = [];
  currentdIndex = -1;
  bundleitemscount = 0;
  bundleinwardcount = 0;

  variants: Productvariants[] = [];
  mappedvaiants: any = {};
  disputes: any = [];
  qcreport: any = {};
  disputeitems: any = [];
  grn: Grn = {};
  totalqty = 0;
  totaldispute = 0;
  totalinventory = 0;
  payform!: FormGroup;
  submit = false;

  transactions: Transaction[] = [];
  totalamount = 0;
  totalgrnvalue = 0;

  settings?: Settings;
  billaddress: Address = {};
  warehouse?: Warehouse;
  paymentcycles: PAYMENT.Paymentcycle[] = [];
  paymentcyclearr: Array<any> = [];

  constructor(
    private bundleservice: BundleService,
    private route: ActivatedRoute,
    private poservice: PurchaseorderService,
    private modelservice: NgbModal,
    private fb: FormBuilder,
    private toast: ToastService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    let poid: any = this.route.snapshot.paramMap.get('id');
    let id: any;
    this.poservice.grndetail(poid).subscribe({
      next: (resp) => {
        this.purchaseorder = resp || [];
        id = resp.warehouse_id;
        // console.log(resp, resp.warehouse_id);
        this.getwarehouse(id)
        this.poservice.getpaymentcycles(this.purchaseorder?.paymentterm_id || 0).subscribe({
          next: (data) => {
            this.paymentcycles = data.data;
            // console.log(this.paymentcycles);
            this.paymentcyclearr = this.paymentcycles.map((cycle: any) => {
              return { id: cycle.id, name: cycle.type + ' - ' + cycle.percentage + '%' };
              //console.log(this.paymentcyclearr)
            });
            // this.cd.detectChanges();
          }
        });
        this.totalgrnvalue = this.purchaseorder?.grandtotal || 0;
        let variantdata: Productvariants[] = [];
        resp.purchaseorderitems.forEach((orderitem: any, index: number) => {
          if (orderitem.purchaseitemdetails) {
            orderitem.purchaseitemdetails.forEach((val: any) => {
              if (val.productvariant.id) {
                let checkvariant = variantdata.findIndex((res) => res.id === val.productvariant.id);
                if (checkvariant < 0) {
                  variantdata.push({
                    id: val.productvariant.id,
                    name: val.productvariant.name,
                    productvariantvalues: val.productvariant.productvariantvalues || []
                  });
                }
                let pid = orderitem.product_id || 0;
                if (!this.mappedvaiants[pid]) this.mappedvaiants[pid] = {};
                this.mappedvaiants[pid][val.productvariant.id] = true;
              }
              this.variants = variantdata;
            });
          }
          if (orderitem.inwarditems) {
            let damaged: any = [];
            let inventory = orderitem.inwarditems.filter((res: any) => {
              if (res.status == 'Dispute') {
                damaged.push(res);
              }
              if (res.status === 'Inventory') {
                return res;
              }
            });
            this.totaldispute += damaged.length;
            this.totalinventory += inventory.length;
            // console.log(inventory);
            // console.log(damaged);

            //let damaged = orderitem.inwarditems.filter((val: any) => val.status == 'Dispute');
            //this.disputes[index] = damaged

            this.qcreport[index] = { damage: damaged.length, inventory: inventory.length };
          }
          if (orderitem.quantity) {
            this.totalqty += orderitem.quantity;
          }
        });
        if (resp.user.addresses && resp.user.addresses.length > 0) {
          this.billaddress = resp.user.addresses[0];
        }
        this.bundleservice.viewGrn(resp.id).subscribe({
          next: (resp) => {
            this.grn = resp;
            this.cd.detectChanges();
          },
          error: () => { }
        });

        this.payform = this.fb.group({
          amount: ['', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]],
          transactionid: ['', [Validators.required]],
          grnid: [''],
          warehouse_id: [''],
          description: [''],
          expensedate: ['', [Validators.required]],
          paymentcycle_id: ['', [Validators.required]]
        });
        // this.cd.detectChanges();
      },
      error: () => { }
    });

    this.poservice.findsetting().subscribe({
      next: (data) => {
        this.settings = data;
        // this.cd.detectChanges();
      }
    });

    this.poservice.getTransactions(poid).subscribe({
      next: (resp) => {
        this.transactions = resp || [];
        this.totalamount = this.transactions.reduce(function (sum: any, current: any) {
          return sum + parseInt(current.amount);
        }, 0);
        // this.cd.detectChanges();
      },
      error: () => { }
    });

    this.bundleservice.getbundles(poid).subscribe({
      next: (resp) => {
        this.bundles = resp || [];
        this.bundleitemscount = this.bundles.reduce(function (sum: any, current: any) {
          return sum + parseInt(current.itemscount);
        }, 0);
        this.bundleinwardcount = this.bundles.reduce(function (sum: any, current: any) {
          return sum + parseInt(current.inwardcount);
        }, 0);
        // this.cd.detectChanges();
      },
      error: () => { }
    });
  }

  get form() {
    return this.payform.controls;
  }
  getwarehouse(id: any) {
    this.poservice.Warehouse(id).subscribe({
      next: (data) => {
        this.warehouse = data;
        // console.log(this.warehouse);
        this.cd.detectChanges();
      }
    });
  }

  savePayment() {
    this.submit = true;
    if (this.payform.invalid) {
      return;
    }
    if (this.purchaseorder?.grandtotal) {
      //let total:number = this.purchaseorder?.grandtotal || 0;
      let amounttoenter = this.purchaseorder?.grandtotal - this.totalamount;
      if (amounttoenter < this.payform.value.amount) {
        this.toast.failure('Enter amount less than or equal to total amount');
        return;
      }
    }
    this.payform.value.grnid = this.purchaseorder?.id;
    this.payform.get('grnid').setValue(this.purchaseorder?.id)
    this.payform.get('warehouse_id').setValue(this.warehouse.id)


    this.poservice.makepayment(this.purchaseorder?.uuid, this.payform.value).subscribe({
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
    // this.cd.detectChanges();
  }

  setActiveGrn(content: any, bundle: Bundle, index: number): void {
    const modelref = this.modelservice.open(content, { size: 'md' });
    this.currentIndex = index;
    this.currentBundle = bundle;
  }

  setDamagedGrn(dcontent: any, poitem: any, index: number): void {
    const modelref = this.modelservice.open(dcontent, { size: 'md' });
    this.currentdIndex = index;
    //this.currentInitem = Initem;
    //this.currentInitem.filter()
    // let psids: any = [];
    // Initem?.forEach((item: any) => {
    //   psids.push(item.psid)
    // })
    this.poservice.getdisputeitems({ poid: poitem }).subscribe({
      next: (resp) => {
        this.disputeitems = resp;
        // this.cd.detectChanges();
      },
      error: () => { }
    });
  }

  numberFormat(num: any) {
    if (num) {
      var ans = num.toLocaleString('en-IN', { currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return ans;
    } else return 0;
  }
}
