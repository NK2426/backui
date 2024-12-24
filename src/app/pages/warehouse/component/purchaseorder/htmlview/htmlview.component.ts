import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { ToastService } from 'src/app/_helpers/toast.service';
import { Productmapparam } from '../../../models/product';
import { Productvariants } from '../../../models/productvariants';
import { Address, Poproess, Productselectimages, Purchaseorder } from '../../../models/purchaseorder';
import { Shipper } from '../../../models/shipper';
import { PurchaseorderService } from '../../../services/purchaseorder.service';

@Component({
  selector: 'app-htmlview',
  templateUrl: './htmlview.component.html',
  styleUrls: ['./htmlview.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule]
})
export class HtmlviewComponent implements OnInit {

  data: Purchaseorder = {};
  purchaseitems: any = [];
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  poprocesslist: Poproess[] = [];
  status: Array<{ id: string, name: string }> = [{ id: 'Accept', name: 'Accept' }, { id: 'Vendor_revise', name: 'Revise' }, { id: 'Decline', name: 'Decline' }];
  headapprove = { status: '', comments: '', vendordocuments: [] };
  actionreason = false;
  billaddress: Address = {};
  bundleform!: FormGroup;
  submit: boolean = false;
  siteurl: string = '';
  seldate: any = '';
  productmapparams: Productmapparam[] = []
  genbundle = false;
  productimages: Productselectimages[] = []
  baseurl: string = ''
  taxvalue = 0;
  discount = 0
  docArray: any = []; purdocArray: any = [];
  seldocArray: any = [];
  docForm !: FormGroup; gsubmit = false;
  addfile: string = '';
  fileName: any = '';

  shippers: Shipper[] = [];
  shipperForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    location: ['', [Validators.required]]
  });
  addShipperForm !: FormGroup;



  public user = JSON.parse(sessionStorage.getItem('auth_user') || '{}');

  variants: Productvariants[] = [];
  taxtotal = { isigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 }
  mappedvaiants: any = {}


  constructor(
    private route: ActivatedRoute, private router: Router,
    private porderservice: PurchaseorderService, private toast: ToastService,
    private modelservice: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    var date = new Date();
    date.setDate(date.getDate() + 1);
    this.seldate = (date.toISOString().slice(0, 16)).split('T')[0] + 'T00:00';
    this.siteurl = this.porderservice.siteurl;
    this.baseurl = this.porderservice.siteurl;



    this.bundleform = this.fb.group({
      bundlecount: [''],
      itemlist: this.fb.array([])
    })

    this.docForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      path: ['', [Validators.required]],
      status: [1]
    })

    let uuid = this.route.snapshot.paramMap.get('uuid');



    if (uuid) {
      // this.porderservice.html(uuid).subscribe({
      //   next: data => {
      //   }
      // });
      this.porderservice.fulldetail(uuid)
        .subscribe({
          next: data => {
            this.data = data;

            this.addShipperForm = this.fb.group({
              uuid: [this.data.uuid],
              shipper_id: [this.data.shipper_id, [Validators.required]],
            })


            if (data.status == 'Revision') {
              this.fromstatus = 'Revision';
              this.tostatus = 'Revised';
            }
            this.purchaseitems = [];
            if (data.purchaseorderitems) {

              let variantdata: Productvariants[] = []

              if (data.purchaseorderitems) {

                this.taxtotal = { isigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 }

                data.purchaseorderitems.forEach((orderitem: any) => {
                  if (orderitem.purchaseitemdetails) {
                    orderitem.purchaseitemdetails.forEach((val: any) => {
                      if (val.productvariant.id) {
                        let checkvariant = variantdata.findIndex(res => res.id === val.productvariant.id)
                        if (checkvariant < 0) {
                          variantdata.push({ id: val.productvariant.id, name: val.productvariant.name, productvariantvalues: (val.productvariant.productvariantvalues || []) })
                        }
                        let pid = orderitem.product_id || 0;
                        if (!this.mappedvaiants[pid])
                          this.mappedvaiants[pid] = {}
                        this.mappedvaiants[pid][val.productvariant.id] = true;
                      }
                      this.variants = variantdata;
                    })
                  }
                  if (orderitem.isigst + '' == '1') {
                    this.taxtotal.isigst = 1
                  }
                  this.taxtotal.ctaxtotal += parseFloat(orderitem.ctaxval);
                  this.taxtotal.staxtotal += parseFloat(orderitem.staxval);
                  this.taxtotal.itaxtotal += parseFloat(orderitem.itaxval);
                });



              }

              this.purchaseitems = data.purchaseorderitems[0]['purchaseitemdetails']
            }

            if (data.user.addresses && data.user.addresses.length > 0) {
              //console.log(data.user.addresses[0])
              this.billaddress = data.user.addresses[0];
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
    }
    //this.doclist();
    this.shipperlist()

  }



  viewDoc(content: any): void {
    const modelref = this.modelservice.open(content, { size: 'md' });
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
    return parseFloat(num) || 0;
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
      next: resp => {
        this.toast.success('Shipper Created Successfully');
        this.shipperForm.reset();
        this.modelservice.dismissAll();
        //console.log(this.shippers)
        this.shippers = [...this.shippers, resp]
        //this.addShipperForm.get('tax')?.setValue(resp?.id)
      }, error: (err: any) => {
        this.toast.failure(err.error.message);
      }
    })
  }
  viewShipper(content: any): void {
    const modelref = this.modelservice.open(content, { size: 'md' });
  }
  shipperlist() {
    this.porderservice.shipperlist()
      .subscribe({
        next: data => {
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
    if (this.addShipperForm.invalid) {
      return;
    }

    if (this.data.ship_status == 'Pick Up') {
      let shipdata = this.addShipperForm.value;
      this.porderservice.addshipperID(shipdata).subscribe({
        next: resp => {
          this.toast.success('Shipper Assigned Successfully');
          this.data = {};
          this.submit = false;
          this.ngOnInit();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }

}
