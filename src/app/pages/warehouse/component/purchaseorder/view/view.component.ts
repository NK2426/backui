import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Address, Poproess, Productselectimages, Purchaseorder, Batch, Qcitem } from '../../../models/purchaseorder';

import { CommonModule } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastService } from 'src/app/_helpers/toast.service';
import { environment } from 'src/environments/environment';
import { Productmapparam } from '../../../models/product';
import { Productvariants } from '../../../models/productvariants';
import { Settings } from '../../../models/settings';
import { Shipper } from '../../../models/shipper';
import { PurchaseorderService } from '../../../services/purchaseorder.service';
import { Warehouse } from '../../../models/warehouse';
import { Grn } from '../../../models/grn';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, NgSelectModule, RouterModule, QRCodeModule]
})
export class ViewComponent implements OnInit {
  siteUrl = environment.WAREHOUSE_SITE_URL;
  data: Purchaseorder = {};
  grndata: Grn = {};
  grns: Grn[];
  purchaseitems: any = [];
  vendordocument: any = [];
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  poprocesslist: Poproess[] = [];
  status: Array<{ id: string; name: string }> = [
    { id: 'Accept', name: 'Accept' },
    { id: 'Vendor_revise', name: 'Revise' },
    { id: 'Decline', name: 'Decline' }
  ];
  headapprove = { status: '', comments: '', vendordocuments: this.vendordocument };
  actionreason = false;
  billaddress: Address = {};
  bundleform!: FormGroup;
  submit: boolean = false;
  seldate: any = '';
  productmapparams: Productmapparam[] = [];
  genbundle = false;
  productimages: Productselectimages[] = [];
  taxvalue = 0;
  discount = 0;
  docArray: any = [];
  purdocArray: any = [];
  seldocArray: any = [];
  docForm!: FormGroup;
  gsubmit = false;
  addfile: string = '';
  fileName: any = '';

  shippers: Shipper[] = [];
  shipperForm: FormGroup;
  addShipperForm!: FormGroup;

  showprint = true;
  psidlabel = `PSID's`;

  public user = JSON.parse(sessionStorage.getItem('auth_user') || '{}');
  show: boolean;
  variants: Productvariants[] = [];
  taxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 };
  qtytotal = 0; recqtytotal = 0;
  mappedvaiants: any = {};
  warehouse: Warehouse;
  formats: Array<{ id: Number; name: string }> = [
    { id: 1, name: 'A4 Size' },
    { id: 2, name: '50mm(W)*25mm(L) Size' },
    { id: 3, name: '15mm(W)*10mm(L) Size' },
    { id: 4, name: 'Tag' }
  ];
  selectedFormat = 1;
  selectedMRP = 0;

  settings?: Settings;

   //For Batch
   batches:Batch[] = [];
   currentBatch: Batch = {}
   batcheditems:any = [];
   editbatch = false;
   showedit = false;
   //availablebatch:any = {}
   qcitems: Qcitem[] = []
   invqtytotal = 0;
   formData!: FormGroup;
   highqty: boolean = false;
   items:any = []

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private porderservice: PurchaseorderService,
    private toast: ToastService,
    private modelservice: NgbModal,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.shipperForm = this.fb.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    this.seldate = date.toISOString().slice(0, 16).split('T')[0] + 'T00:00';

    this.bundleform = this.fb.group({
      bundlecount: [''],
      itemlist: this.fb.array([])
    });
    let uuid = this.route.snapshot.paramMap.get('uuid');

    this.formData = this.fb.group({
      uuid: [uuid],
      remarks: [this.data.remarks, [Validators.required]],
      invoiceno: [this.data.invoiceno, [Validators.required]],
      receivedqty: [this.data.receivedqty || ''],
      invoiceitemcount: [this.data.invoiceitemcount || ''],
      itemlist: this.fb.array([]),
      status: [this.data.ship_status || '']
      // transporter: [this.data.transportcost, [Validators.required]]
    });

    this.docForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      path: ['', [Validators.required]],
      status: [1]
    });

    this.addShipperForm = this.fb.group({
      uuid: [this.data.uuid],
      shipper_id: [this.data.shipper_id, [Validators.required]]
    });
  
    this.list();
    //this.shipperlist();
  }

  list(){
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.porderservice.fulldetail(uuid).subscribe({
        next: (data) => {
          this.data = data;
          let id: any;
          id = data.warehouse_id
          this.getwarehouse(id)

          if (data.expiredoc != '' || null) {
            this.show == true;
          }
          if (data?.status == 'Revision') {
            this.fromstatus = 'Revision';
            this.tostatus = 'Revised';
          }
          this.purchaseitems = [];
          //Batch code
          this.batches = data.batches;
            this.qcitems = data.qcitems
            let openBatch = this.batches?.find((x:any)=>(x.status !== 3))
            
            if(this.showedit == false)
            {
              //this.availablebatch = this.batches?.find((x:any)=>(x.invoiceno == '' && x.status == 1))
              let lastbatchindex =this.batches?.length - 1 || 0
              if(!this.currentBatch?.id)
              this.currentBatch = this.batches?.[lastbatchindex]
              this.porderservice.poGrnsdetail(data?.id).subscribe({
                next: (grndata) => {
                  this.grns = grndata;
                  this.grndata = this.grns?.find(x=>x.batch_id == this.currentBatch?.id)
                }
              })
            }
            else
              this.currentBatch = {}
            
            if(this.data.ship_status !== '' && !this.showedit && this.currentBatch?.status == 3 && this.data.status == 'Accept' && !openBatch)
            {
              this.router.navigate(['/warehouse/orders/recevied/'+uuid])
              this.editbatch = true
            }
            
          if (data.purchaseorderitems) {
            let variantdata: Productvariants[] = [];

            if (data.purchaseorderitems) {
              this.taxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 };
              this.qtytotal = 0; this.recqtytotal = 0; this.invqtytotal = 0; this.items=[]
              data.purchaseorderitems.forEach((orderitem: any,index:any) => {
                if(!this.currentBatch?.id)
                  {
                    let qcitmqty = this.qcitems?.filter((y:any)=>(y.batch_id == 0 && y.purchaseorderitem_id == orderitem.id))
                   
                    this.items[index] = qcitmqty?.length == 0 ? orderitem.invoiceqty : qcitmqty?.length;
                    this.invqtytotal +=  this.items[index];
                  }
                  else
                  {
                    let qcitmqty = this.qcitems?.filter((y:any)=>(y.batch_id == this.currentBatch?.id && y.purchaseorderitem_id == orderitem.id))
                    this.items[index] = qcitmqty?.length;
                    this.invqtytotal +=  this.items[index];

                  }

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
                this.qtytotal += orderitem.quantity;
                this.recqtytotal += orderitem.receivedqty;
                //this.invqtytotal += orderitem.invoiceqty;
                if (orderitem.ifigst + '' == '1') {
                  this.taxtotal.ifigst = 1;
                }
                this.taxtotal.ctaxtotal += parseFloat(orderitem.ctaxval);
                this.taxtotal.staxtotal += parseFloat(orderitem.staxval);
                this.taxtotal.itaxtotal += parseFloat(orderitem.itaxval);
              });
            }

            this.purchaseitems = data.purchaseorderitems[0]['purchaseitemdetails'];
          }

          if (data.user.addresses && data.user.addresses.length > 0) {
            //console.log(data.user.addresses[0]);
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
          this.cdr.detectChanges();
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
    this.shipperlist()
  }
  
  getwarehouse(id: any) {
    this.porderservice.Warehouse(id).subscribe({
      next: (data) => {
        this.warehouse = data;

        this.cdr.detectChanges();
      }
    });
  }
  viewDoc(content: any): void {
    const modelref = this.modelservice.open(content, { size: 'md' });
  }

  printPage() {
    if (document.getElementById('print')) {
      var printContents = document.getElementById('print');
      document.body.innerHTML =
        '<html><head></head><body><style>img { width:500px; height: 400px; }</style>' + printContents?.innerHTML + '</body></html>';
      window.print();
      window.location.reload();
    }
  }
  toFloat(num: any) {
    return parseFloat(num).toFixed(2) || 0;
  }
  toInt(num: any) {
    return parseInt(num) || 0;
  }

  ////// Shipper ///////
  get shipform() {
    return this.shipperForm.controls;
  }

  get form() {
    return this.addShipperForm.controls;
  }

  saveShipper() {
    this.gsubmit = true;
    if (this.shipperForm.invalid) {
      return;
    }

    this.porderservice.addshipper(this.shipperForm.value).subscribe({
      next: (resp) => {
        this.toast.success('Shipper Created Successfully');
        this.shipperForm.reset();
        this.modelservice.dismissAll();
        //console.log(this.shippers);
        this.shippers = [...this.shippers, resp];
        //this.addShipperForm.get('tax')?.setValue(resp?.id)
      },
      error: (err: any) => {
        this.toast.failure(err.error.message);
      }
    });
  }
  viewShipper(content: any): void {
    const modelref = this.modelservice.open(content, { size: 'md' });
  }
  shipperlist() {
    this.porderservice.shipperlist().subscribe({
      next: (data) => {
        this.shippers = data;
        // if (this.data && this.data.tax) {
        //   let tax = this.data.tax
        //   this.purcaseForm.get('department')?.setValue(department);
        // }
      }
    });
  }

  addShipper() {
    this.submit = true;
    //console.log(this.addShipperForm);
    if (this.addShipperForm.invalid) {
      return;
    }

    if (this.data.ship_status == 'Pick Up') {
      let shipdata = this.addShipperForm.value;
      this.porderservice.addshipperID(shipdata).subscribe({
        next: (resp) => {
          this.toast.success('Shipper Assigned Successfully');
          this.data = {};
          this.submit = false;
          this.ngOnInit();
        },
        error: (err) => {
          this.toast.failure(err.error.message);
        }
      });
    }
  }

  download() {
    this.showprint = false;
    this.porderservice.download(this.data.uuid).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + this.data.uuid + '.pdf';
          link.target = 'new';
          //link.download = path;
          document.body.appendChild(link);
          //console.log(link);
          link.click();
          this.showprint = true;
          link.remove();
        }
      },
      error: (err) => {
        if (typeof err != 'object') {
          this.toast.failure('Error while downloading file ');
        }
        this.toast.failure('Error while download file : ' + err.error.message);
      }
    });
  }

  generatepsid(uuid: any) {
    // if (this.psidlabel == 'Tags' && this.selectedMRP <= 0) {
    //   this.toast.failure('Please enter valid MRP to show in Tags');
    //   return;
    // }
    this.showprint = false;
    this.porderservice.generateqrcode(uuid, this.selectedFormat, this.selectedMRP).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + 'psids_' + uuid + '.pdf';
          link.target = 'new';
          //link.download = path;
          document.body.appendChild(link);
          //console.log(link);
          link.click();
          this.showprint = true;
          link.remove();
        }
      },
      error: () => { }
    });
  }
  generatebarcode(uuid: any) {
    // if (this.psidlabel == 'Tags' && this.selectedMRP <= 0) {
    //   this.toast.failure('Please enter valid MRP to show in Tags');
    //   return;
    // }
    this.showprint = false;
    this.porderservice.generatebarcode(uuid, this.selectedFormat, this.selectedMRP).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + 'barcode_' + uuid + '.pdf';
          link.target = 'new';
          //link.download = path;
          document.body.appendChild(link);
          //console.log(link);
          link.click();
          this.showprint = true;
          link.remove();
        }
      },
      error: () => {}
    });
  }

  changeFormat(event: any) {
    this.selectedFormat = event.id;
    if (this.selectedFormat == 4) {
      this.psidlabel = 'Tags';
    }
  }

  changeMRP(event: any) {
    this.selectedMRP = event.target.value;
  }

  src: string;
  showFullImage(event: any, image: any) {
    this.modelservice.open(image, { size: 'lg' });
    this.src = event.target.src;
  }

  changeBatch(event: any) {
    if(event)
    {
      this.currentBatch = event;
    }
    else
    {
      this.currentBatch = {};
    }
    //this.purformData().controls = []
    this.list()

  }

  checkvalue(event: any, i: any) {
    //this.itemspoints.controls;
    this.formData.get('itemlist').value[i].receivedqty = Number(event.target.value);
    if (this.formData.get('itemlist').value[i].quantity < this.formData.get('itemlist').value[i].receivedqty) {
      this.highqty = true
    }
    if (this.formData.get('itemlist').value[i].quantity >this.formData.get('itemlist').value[i].receivedqty) {
      this.highqty = false
    }
    if (this.formData.get('itemlist').value[i].receivedqty == null) {
      this.formData.get('itemlist').value[i].receivedqty.setvalue(0)
    }

    let invoiceitemcount = 0;
    this.formData.get('itemlist').value.map((itm:any) => {
      //if (this.purformData().controls[i].status != 'INVALID') {
        invoiceitemcount += parseInt(itm.receivedqty);
      //}
      //this.data.invoiceitemcount = invoiceitemcount;
      //this.receivedqty = invoiceitemcount;
    })
   
  }
}
