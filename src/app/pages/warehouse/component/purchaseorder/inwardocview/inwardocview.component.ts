import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Address, Productselectimages, Purchaseitem, Purchaseorder } from './../../../models/purchaseorder';
import { PurchaseorderService } from '../../../services/purchaseorder.service';

import { Grn, Grnitem } from './../../../models/grn';
import { Productmapparam } from './../../../models/product';
import { Productvariants } from './../../../models/productvariants';
import { Settings } from '../../../models/settings';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Warehouse } from '../../../models/warehouse';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { environment } from 'src/environments/environment';
// import { MRPPriceValidatorDirectiveModule } from 'src/app/_helpers/directives/mrp-price-validator.directive';
// import { PriceMRPValidatorDirectiveModule } from 'src/app/_helpers/directives/price-validator.directive';


@Component({
  selector: 'app-inwardocview',
  templateUrl: './inwardocview.component.html',
  styleUrls: ['./inwardocview.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, NgSelectModule, RouterModule, SharedModule]
})
export class InwardocviewComponent implements OnInit {

  data: Grn = {};
  tatkalpo: Purchaseorder = {};
  purchaseitems: any = [];
  grnitems: Grnitem[] = [];
  excessitems: any = [];
  comments = '';

  actionreason = false;
  billaddress: Address = {};
  submit: boolean = false; gsubmit: boolean = false;
  siteurl: string = '';
  seldate: any = '';
  productmapparams: Productmapparam[] = []
  genbundle = false;
  productimages: Productselectimages[] = []
  baseurl: string = ''
  taxvalue = 0;
  discount = 0
  docArray: any = [];
  fileName: any = '';
  currentImagePath = '';
  invoiceqtyflag = 0;

  tatkalpoitems: Purchaseitem[] = []

  showprint = true; showpdf?: any = [{}]; tatkalshowpdf?: any = [{}];
  psidlabel = `PSID's`;
  tatkalpoflag = false;
  disabled = false;
  public user = JSON.parse(localStorage.getItem('auth_user') || '{}');

  variants: Productvariants[] = [];
  taxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 }
  qtytotal = 0; invqtytotal = 0; recqtytotal = 0; recinvqtytotal = 0;
  subtotal = 0; total = 0; discounttotal = 0; grandtotal = 0;
  mappedvaiants: any = {}
  discountypes: Array<{ id: number, name: string }> = [{ id: 0, name: 'Select' }, { id: 1, name: 'Per Item' }, { id: 2, name: 'Overall' }];
  discountoptions: Array<{ id: number, name: string }> = [{ id: 0, name: '%' }, { id: 1, name: 'INR' }];
  tatkaltaxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 }
  tatkalqtytotal = 0;

  formats: Array<{ id: Number, name: string }> = [{ id: 1, name: 'A4 Size' }, { id: 2, name: '50mm(W)*25mm(L) Size' }, { id: 3, name: '15mm(W)*10mm(L) Size' }]//, { id: 4, name: 'Tag' }
  selectedFormat = 1;
  selectedMRP = 0;

  settings?: Settings;
  fitem: any = {}
  purchaseformval: any = []
  valid: any = [];

  formData!: FormGroup;
  warehouse: Warehouse;
  //sellerForm: FormGroup;
  addSellerForm!: FormGroup;
  
  priceupdate: Array<{ uuid: string; receivedqty: number; validqty:number; price: number; mrp: number; discount: number; discounttype: number; discountoption: number; discounttotal: number; show: boolean }> = [];
  constructor(
    private route: ActivatedRoute, private router: Router,
    private porderservice: PurchaseorderService, private toast: ToastService,
    private modelservice: NgbModal,
    private fb: FormBuilder,
  ) { }

  

  ngOnInit(): void {

    this.formData = this.fb.group({
      uuid: [''],
      remarks: ['', [Validators.required]],
      invoiceno: ['', [Validators.required]],
      invoiceitemcount: [0],
      status: ['Pick Up'],
      transportcost: ['', [Validators.pattern('[0-9]+'), Validators.required]],
      overalldiscount: ['', [Validators.pattern('[0-9]+'), Validators.required]],
      bundlereceivedqty: [0],
      grandtotal: [0]
    });

    this.addSellerForm = this.fb.group({
      grnitemid: [],
      uuid:[],
      sellingprice: ['', [Validators.required]],
      sellingmrp: ['', [Validators.required]],
    });

    var date = new Date();
    date.setDate(date.getDate() + 1);
    this.seldate = (date.toISOString().slice(0, 16)).split('T')[0] + 'T00:00';
    this.siteurl = this.porderservice.siteurl;
    this.baseurl = this.porderservice.baseurl;

    let uuid = this.route.snapshot.paramMap.get('uuid') || '';

    if (uuid) {
      this.porderservice.inwardgrnDetail(uuid)
        .subscribe({
          next: data => {
            this.data = data;
            this.formData.get('uuid')?.setValue(uuid);
            this.formData.get('remarks')?.setValue(this.data.purchaseorder?.remarks || '');
            this.formData.get('invoiceno')?.setValue(data.invoiceno || '');
            this.formData.get('invoiceitemcount')?.setValue(this.data.purchaseorder?.invoiceitemcount || 0);
            this.formData.get('transportcost')?.setValue(this.data.purchaseorder?.transportcost || '');
            //this.formData.get('overalldiscount')?.setValue(this.data.purchaseorder?.overalldiscount || '');
            this.formData.get('bundlereceivedqty')?.setValue(this.data?.bundlereceivedqty || 0);
            this.formData.get('grandtotal')?.setValue(this.data?.grandtotal || 0);
            //this.formData.get('itemlist')?.patchValue(data.purchaseorderitems);

            this.grnitems = []; this.excessitems = []
            this.priceupdate = Object.assign([], []);
            if (data.grnitems) {
              this.grnitems = data.grnitems
              this.subtotal = 0; this.total = 0; this.discounttotal = 0; this.grandtotal = 0;
              this.qtytotal = 0; this.invqtytotal = 0; this.recqtytotal = 0; this.recinvqtytotal = 0;
              this.taxtotal.ctaxtotal = 0; this.taxtotal.staxtotal= 0; this.taxtotal.itaxtotal = 0;
              this.grnitems.map((gitm: any, index: number) => {
                if (gitm.excessqty > 0)
                  this.tatkalpoflag = true;
                let qty = (gitm.receivedqty + gitm.excessqty)
                this.excessitems[index] = gitm;
                this.excessitems[index].receivedqty = qty
                this.excessitems[index].subtotal = qty * gitm.price
                if (gitm.discountoption == 0)
                  this.excessitems[index].discounttotal = (this.excessitems[index].subtotal * gitm.discount) / 100
                else {
                  if (gitm.discounttype == 1)
                    this.excessitems[index].discounttotal = gitm.discount * qty;
                  else
                    this.excessitems[index].discounttotal = gitm.discounttotal;
                }

                this.excessitems[index].total = parseFloat(this.excessitems[index].subtotal) - parseFloat(this.excessitems[index].discounttotal);
                if (gitm.ifigst == 0) {
                  this.excessitems[index].ctaxval = (this.excessitems[index].total * gitm.ctax) / 100;
                  this.excessitems[index].staxval = (this.excessitems[index].total * gitm.stax) / 100;
                  this.excessitems[index].grandtotal = parseFloat(this.excessitems[index].total) + parseFloat(this.excessitems[index].ctaxval) + parseFloat(this.excessitems[index].staxval);
                }
                else {
                  this.excessitems[index].itaxval = (this.excessitems[index].total * gitm.itax) / 100;
                  this.excessitems[index].grandtotal = parseFloat(this.excessitems[index].total) + parseFloat(this.excessitems[index].itaxval);
                }

                this.subtotal += this.excessitems[index].subtotal;
                this.total += this.excessitems[index].total;
                this.discounttotal += this.excessitems[index].discounttotal;
                this.grandtotal += this.excessitems[index].grandtotal;
                this.qtytotal += gitm.quantity;
                this.invqtytotal += qty;
                this.recqtytotal += gitm.receivedqty;
                this.recinvqtytotal += gitm.purchaseorderitem.receivedqty;
                this.taxtotal.ctaxtotal += parseFloat(this.excessitems[index].ctaxval);
                this.taxtotal.staxtotal += parseFloat(this.excessitems[index].staxval);
                this.taxtotal.itaxtotal += parseFloat(this.excessitems[index].itaxval);
                this.showpdf[index] = true;
                if (gitm.ifigst + '' == '1') {
                  this.taxtotal.ifigst = 1
                }
                let validqty = gitm.purchaseorderitem.quantity - gitm.purchaseorderitem.receivedqty;
                this.priceupdate = [...this.priceupdate, { uuid: gitm.uuid, receivedqty: gitm.receivedqty, validqty:validqty, price: gitm.price, mrp: gitm.mrp, discount: gitm.discount, discounttype: gitm.discounttype, discountoption: gitm.discountoption, discounttotal: gitm.discounttotal, show: false }];
              })
             
            }

            if (data.vendor?.addresses && data.vendor?.addresses.length > 0) {
              this.billaddress = data.vendor?.addresses[0];
            }
            if (data.product && data.product.productmapparams) {
              this.productmapparams = data.product.productmapparams

              this.productmapparams = this.productmapparams?.filter(val => val.value_id > 0);
            }

            if (data.product && data.product.productselectimages) {
              this.productimages = data.product.productselectimages;
            }
            if (data.discountype + '' === '1')
              this.discount = data.discount;
            else if (data.discountype + '' === '2')
              this.discount = data.total * data.discount / 100;

            if (data.taxpercentage > 0) {
              //this.taxvalue = ((data.total-this.discount) * data.taxpercentage)/100;
            }

            //this.poprocess()
          },
          error: () => {
          }
        });

      this.porderservice.findsetting().subscribe({
        next: data => {
          this.settings = data;
        }
      })
    }

  }


  get form() {
    return this.formData.controls;
  }

  viewDoc(content: any): void {
    const modelref = this.modelservice.open(content, { size: 'md' });
  }


  checkvalue(i: number) {
    if (this.priceupdate[i]) {
      // if (this.priceupdate[i]?.receivedqty > this.grnitems[i]?.quantity) {
      //   this.toast.failure('Please enter the receivedqty less than or equal to quantity');
      //   this.valid[i] = 1;
      //   return;
      // }
      // else {
      //   this.valid[i] = 0;
      // }

      if (this.priceupdate[i].price && (this.priceupdate[i].price < 0 || !Number(this.priceupdate[i].price * 1))) {
        this.priceupdate[i].price = 0;
        this.priceupdate[i].discount = 0;
        this.priceupdate[i].discounttotal = 0;
        //this.formData().at(i).patchValue(selitem)
      }
      if (this.priceupdate[i].receivedqty && (this.priceupdate[i].receivedqty <= 0 || !this.isNumeric(this.priceupdate[i].receivedqty))) {
        this.priceupdate[i].receivedqty = 1;
      }
      if (this.priceupdate[i].discounttype == 0 || (this.priceupdate[i].discountoption == 0 && this.priceupdate[i].discount >= 100) || this.priceupdate[i].discount < 0 || !Number(this.priceupdate[i].discount)) {
        this.priceupdate[i].discount = 0;
        this.priceupdate[i].discounttotal = 0;
        //this.formData().at(i).patchValue(selitem)
      }
      this.priceupdate[i].discount = this.priceupdate[i].discount

      if (this.priceupdate[i].discount < 0) {
        this.priceupdate[i].discount = 0;
        this.priceupdate[i].discounttotal = 0;
      }

      if ((this.priceupdate[i].discounttype == 1 && this.priceupdate[i].discount >= this.priceupdate[i].price) || (this.priceupdate[i].discounttype == 2 && this.priceupdate[i].discount >= parseFloat(this.grnitems[i].subtotal || ''))) {
        this.priceupdate[i].discount = 0;
        this.priceupdate[i].discounttotal = 0;
      }
      if (this.priceupdate[i].discounttype == 1) {
        let discounttotal = 0;
        if (this.priceupdate[i].discountoption == 0)
          discounttotal = this.priceupdate[i].receivedqty * ((this.priceupdate[i].price * this.priceupdate[i].discount) / 100)
        else {
          discounttotal = this.priceupdate[i].receivedqty * (this.priceupdate[i].discount)
        }

        this.priceupdate[i].discounttotal = discounttotal;
      }
      else if (this.priceupdate[i].discounttype == 2) {
        let discounttotal = this.priceupdate[i].discount;
        if (this.priceupdate[i].discountoption == 0)
          discounttotal = (((this.priceupdate[i].receivedqty * this.priceupdate[i].price) * this.priceupdate[i].discount) / 100)
        this.priceupdate[i].discounttotal = discounttotal;
      }

    }
  }

  printPage() {
    if (document.getElementById('print')) {
      var printContents = document.getElementById('print');
      document.body.innerHTML = '<html><head></head><body><style>img { width:500px; height: 400px; }</style>' + printContents?.innerHTML + '</body></html>';
      window.print();
      window.location.reload()
    }
  }
  toFloat(num: any) {
    return parseFloat(num).toFixed(2) || 0;
  }
  toInt(num: any) {
    return parseInt(num) || 0;
  }


  download() {
    this.showprint = false;
    this.porderservice.downloadgrninward(this.data.grnid).subscribe({
      next: resp => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + 'Inward Doc_' + this.data.grnid + '.pdf';
          link.target = "new"
          //link.download = path;
          document.body.appendChild(link);
          link.click();
          this.showprint = true;
          link.remove();
        }

      }, error: err => {
        this.toast.failure("Error while download file : " + err.error.message);
      }
    })
  }

  changeFormat(event: any) {
    this.selectedFormat = event.id;
    if (this.selectedFormat == 4) {
      this.psidlabel = 'Tags';
    }
  }


  ////// Selling Price & MRP update ///////
  get sellform() {
    return this.addSellerForm.controls;
  }

   saveSellingpriceMRP() {
    this.gsubmit = true;
    if (this.addSellerForm.invalid) {
      return;
    }
    console.log(this.addSellerForm)

    if(Number(this.addSellerForm.value.sellingprice) > Number(this.addSellerForm.value.sellingmrp))
    {
      this.toast.failure('Price must be less than or equal to MRP');
      return;
    }
    this.porderservice.saveInwarditem(this.addSellerForm.value).subscribe({
      next: (resp) => {
        //this.toast.success('Selling details updated Successfully');
        console.log(resp)
        this.generatepsid(this.addSellerForm.value.uuid,this.addSellerForm.value.grnitemid)
        this.ngOnInit()
        //window.location.reload()
        this.modelservice.dismissAll();
        //console.log(this.shippers);
        //this.shippers = [...this.shippers, resp];
        //this.addShipperForm.get('tax')?.setValue(resp?.id)
      },
      error: (err: any) => {
        this.toast.failure(err.error.message);
      }
    });
  }
  viewSeller(content: any,data:any,i:number): void {
    this.addSellerForm.get('uuid')?.setValue(data.uuid);
    this.addSellerForm.get('grnitemid')?.setValue(i);
    this.addSellerForm.get('sellingprice')?.setValue(data.sellingprice);
    this.addSellerForm.get('sellingmrp')?.setValue(data.sellingmrp);
    this.addSellerForm.controls['sellingmrp'].setValidators([Validators.min(data.mrp), Validators.required]);
    this.addSellerForm.controls['sellingprice'].setValidators([Validators.min(data.price), Validators.required]);
    this.addSellerForm.controls['sellingprice'].updateValueAndValidity();
    this.addSellerForm.controls['sellingmrp'].updateValueAndValidity();
    console.log(this.addSellerForm.controls)

    const modelref = this.modelservice.open(content, { size: 'md' });
  }

  generatepsid(uuid: any, i: number) {

    this.showpdf[i] = false;
    this.porderservice.generateBatchqrcode(uuid, this.selectedFormat, this.data.batch_id || 0).subscribe({
      next: resp => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + 'barcode_' + uuid + '.pdf';
          link.target = "new"
          //link.download = path;
          document.body.appendChild(link);
          link.click();
          let index = i;
          this.showpdf[i] = true;
          this.grnitems[index].genpdf = 2;
          link.remove();
        }
      },
      error: () => {

      }
    });
  }

  saveGrnitem(i: number) {
    this.priceupdate[i]['show'] = true;
    this.submit = true;

    if (
      isNaN(this.priceupdate[i]['receivedqty']) ||
      isNaN(this.priceupdate[i]['price']) ||
      this.priceupdate[i]['receivedqty'] <= 0 ||
      this.priceupdate[i]['price'] <= 0 
    ) {
      this.toast.failure('Invalid Quantity or Price');
      return;
    }
    if(this.priceupdate[i]['validqty'] < this.priceupdate[i]['receivedqty'])
    {
      this.toast.failure('Enter the received qty less than or equal to quantity with invoice qty');
      return;
    }
    if (Number(this.priceupdate[i]['mrp']) < Number(this.priceupdate[i]['price'])) {
      this.toast.failure('Price must be less than mrp');
      return;
    }

    // if (Number(this.grnitems[i]['quantity']) < (Number(this.priceupdate[i]['receivedqty']))) {
    //   this.toast.failure('Received qty must be less than or equal to quantity');
    //   return;
    // }
    // else if (this.grnitems[i].purchaseorderitem?.receivedqty == this.grnitems[i].quantity) {
    //   if (this.priceupdate[i]?.receivedqty > this.grnitems[i].receivedqty) {
    //     this.toast.failure('Please enter the receivedqty less than or equal to quantity with closed GRN qty');
    //     this.valid[i] = 1;
    //     return;
    //   }
    // }

    let subtotal = (this.grnitems[i]?.['quantity'] || 0) * parseFloat(this.grnitems[i]?.['price'] || '')
    if (subtotal <= Number(this.priceupdate[i]['discount'])) {
      this.toast.failure('Discount must be less than total');
      return;
    }
    this.disabled = false
    
    this.porderservice.grnitemUpdate(this.priceupdate[i], this.grnitems[i]['uuid']).subscribe({
      next: (resp) => {
        this.priceupdate[i]['show'] = false;

        this.toast.success('Price updated successfully');
        window.location.reload()
      },
      error: (err: any) => {
        this.toast.failure(err.error.message);
      }
    });
  }

  approveInwardoc(): void {
    const modalRefnc = this.modelservice.open(ConfirmAlert);
    let msgtitle = 'Approve Inward Document Confirmation'
    let msg = 'Are you sure after approving the Inward document, this GRN is ready to Stock QC?'
    if (this.tatkalpoflag == true) {
      msgtitle = 'Approve Inward Document & tatkal PO Confirmation'
      msg = 'Are you sure tatkal PO generated & confirmation for approving the Inward document, after this GRN is ready to Stock QC?'
    }
    modalRefnc.componentInstance.confirmationBoxTitle = msgtitle;
    modalRefnc.componentInstance.confirmationMessage = msg;
    modalRefnc.result.then((paramResponse) => {
      this.formData.value.status = 'Open';
      this.formData.value.uuid = this.data.grnid;
      this.formData.value.bundlereceivedqty = this.invqtytotal;
      this.formData.value.grandtotal = this.grandtotal;
      this.porderservice.Approveinwardoc(this.formData.value).subscribe({
        next: resp => {
          this.toast.success('Inward document approved Successfully');
          this.submit = false;
          window.location.reload()
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })

    }, err => {
      console.log(err);
    });
  }

  cancelAction(): void {
    this.router.navigate([`/app/orders`]);
  }


  isNumeric(str: any) {
    return /^-?\d+$/.test(str);
  }

  sumqty(event: any) {
    let invoiceitemcount = 0;
    // this.purformData().controls.map((itm, i) => {
    //   if (this.purformData().controls[i].status != 'INVALID') {
    //     invoiceitemcount += parseInt(itm.value.invoiceqty);
    //   }
    //   //this.data.invoiceitemcount = invoiceitemcount;
    //   this.invqtytotal = invoiceitemcount;
    // })
  }
  openImage(content: any, imagePath: any) {
    this.modelservice.open(content, { size: "lg" });
    this.currentImagePath = imagePath;
  }

  downloadUrl(url: string, fileName = new Date().toISOString()) {
    const a: any = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  };
  remove(i: any) {
    let index = i;
    if (this.purchaseformval[index].genpdf != 2) {
      this.purchaseformval[index].genpdf = 2;
      // console.log(this.purchaseformval[index].genpdf)
    }
    //event.target.hidden = true;
    //delete this.showpdf[i];
  }

  src: string;
  showFullImage(event: any, image: any) {
    this.modelservice.open(image, { size: 'lg' });
    this.src = event.target.src;
  }


}
