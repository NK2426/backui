import { CommonModule, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Product, Productmapparam } from '../../models/product';
import { Address, Department, Poproess, Productselectimages, Purchaseorder, Purchaseorderpaginate, Vendor, Warehouse } from '../../models/purchaseorder';
import { PurchaseorderService } from '../../services/purchaseorder.service';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { environment } from 'src/environments/environment';
import { Documents } from '../../models/documents';
import { Productvariants } from '../../models/productvariants';
import { Settings } from '../../models/settings';
import { EnvService } from '../../services/env.service';
import { CreatePoComponent } from '../create-po/create-po.component';
import { NgxPermissionsModule } from 'ngx-permissions';
@Component({
  selector: 'app-list',
  templateUrl: './po-list.component.html',
  styleUrls: ['./po-list.component.scss'],
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, DatePipe, JsonPipe, MatStepperModule, CreatePoComponent, FormsModule, NgxPermissionsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoListComponent implements OnInit {
  data: Purchaseorder = {};
  purchaseitems!: any;
  comments = '';
  fromstatus = 'Create';
  tostatus = 'Process';
  poprocesslist: Poproess[] = [];
  status: Array<{ id: string; name: string }> = [];
  headapprove = { status: '', halt: '', comments: '' };
  actionreason = false;
  billaddress: Address = {};
  statuopenform: boolean = false;
  productmapparams: Productmapparam[] = [];
  productimages: Productselectimages[] = [];
  baseurl: string = '';
  taxvalue = 0;
  discount = 0;
  documentlist: Documents[] = [];
  vendocumentlist: Documents[] = [];
  submit = false;
  gsubmit = false;
  settings?: Settings;
  warehouse: Warehouse;
  addShipperForm!: FormGroup;
  docArray: Documents[] = [];
  vendocArray: Documents[] = [];

  vendor?: Vendor = {};
  variants: Productvariants[] = [];
  mappedvaiants: any = {};
  EmpName: any;
  public user = JSON.parse(sessionStorage.getItem('token') || '{}');
  analytics: any = [];
  taxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 };
  qtytotal = 0;
  showprint = true;
  showprintxl = true;



  @Input() item: any;
  @Output() refreshList = new EventEmitter<string>();
  //
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private porderservice: PurchaseorderService,
    private modelservice: NgbModal,
    private env: EnvService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.baseurl = environment.PDF_BASE_URL;
    // console.log("item ->", this.item)
    if (this.user && this.user.role === 3) {
      this.status = [{ id: 'Process', name: 'Send for approval' }];
    } else if (this.user && this.user.role === 4) {
      this.status = [
        { id: 'Approved', name: 'Approved' },
        { id: 'Revise', name: 'Revise' },
        { id: 'Halt', name: 'Halt' },
        { id: 'Reject', name: 'Reject' }
      ];
    }
    this.getData();


  }


  getData() {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    uuid = uuid !== null ? uuid : this.item;
    let id;
    // console.log(uuid, '=>', this.item);
    if (uuid) {
      this.porderservice.fulldetailvar(uuid).subscribe({
        next: (data) => {
          this.data = data;
          this.EmpName = data.purchase.uuid
          id = data.warehouse_id
          // console.log(this.data.billing);
          // console.log('view data=>', this.data);
          this.getwarehouse(id)
          if (data.documents != '' || data.vendocuments != '') {
            this.porderservice.documentlist().subscribe({
              next: (datalist) => {
                if (data.documents != '') {
                  this.documentlist = datalist.filter((data) => data.vendor_id == 0);
                  let docs: [] = data.documents.split(',');
                  this.docArray = datalist.filter((r1) => docs.some((r2) => r1.id == r2));
                }
                if (data.vendocuments != '') {
                  this.vendocumentlist = datalist.filter((data: any) => data?.vendor_id > 0);
                  let vendocs: [] = data.vendordocuments.split(',');
                  this.vendocArray = datalist.filter((r1) => vendocs.some((r2) => r1.id == r2));
                }
              }
            });
          }

          if (this.user && this.user.role === 3 && this.item == undefined) {
            if (data.status === 'Revise' || data.status === 'Vendor_revise') {
              this.statuopenform = true;
            }
          }
          if (this.user && this.user.role === 4) {
            if (data.status === 'Process' || data.status === 'Halt') {
              this.statuopenform = true;
            }
          }
          if (data.status == 'Revision') {
            this.fromstatus = 'Revision';
            this.tostatus = 'Revised';
          }
          if (data.purchaseorderitems) {
            let variantdata: Productvariants[] = [];

            if (data.purchaseorderitems) {
              this.taxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 };
              this.qtytotal = 0;
              data.purchaseorderitems.forEach((orderitem: any) => {
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

                if (orderitem.ifigst == 1) {
                  this.taxtotal.ifigst = 1;
                }
                this.taxtotal.ctaxtotal += parseFloat(orderitem.ctaxval);
                this.taxtotal.staxtotal += parseFloat(orderitem.staxval);
                this.taxtotal.itaxtotal += parseFloat(orderitem.itaxval);

                if (orderitem.product_id) {
                  //Analytics box commented need to update in future
                  /* this.porderservice.poanalytics(orderitem.product_id, data.vendor_id).subscribe({
                       next: analyticdata=>{
                         let checkanalytics = this.analytics.findIndex((res:any) => res.product_id+'' === orderitem.product_id+'')
                         if (checkanalytics < 0) {
                           analyticdata.product_id = orderitem.product_id
                           analyticdata.name = orderitem.product.name
 
                           this.analytics.push(analyticdata);
                        }
                       }
                     })*/
                }
              });
            }

            this.purchaseitems = data.purchaseorderitems[0]['purchaseitemdetails'];
          }
          if (data.user.addresses && data.user.addresses.length > 0) {
            this.billaddress = data.user.addresses[0];
          }
          // if(data.product && data.product.productmapparams)
          // {
          //   this.productmapparams = data.product.productmapparams;
          //   this.productmapparams = this.productmapparams?.filter(val=> val.value_id > 0 );
          // }

          if (data.product && data.product.productselectimages) {
            this.productimages = data.product.productselectimages;
          }
          if (data.discountype + '' === '1') this.discount = data.discount;
          else if (data.discountype + '' === '2') this.discount = (data.total * data.discount) / 100;

          if (data.taxpercentage > 0) {
            this.taxvalue = ((data.total - this.discount) * data.taxpercentage) / 100;
          }
          this.poprocess();
          this.addShipperForm = this.fb.group({
            uuid: [this.data.uuid],
            shipper_id: [this.data.shipper_id, [Validators.required]]
          });
          this.refreshList.emit('refresh');
          // this.porderservice.vendorlist(data.product.pid)
          // .subscribe({
          //   next: vendors => {
          //     this.vendor = vendors.find(res => res.vendor_id == data.vendor_id);
          //   }
          // });
          this.ref.detectChanges();
        },
        error: () => { }
      });
    }
  }
  getwarehouse(id: any) {
    // console.log('ware',this.data.warehouse_id);
    this.porderservice.Warehouse(id).subscribe({
      next: (data) => {
        this.warehouse = data;
        // console.log(this.warehouse);

        this.ref.detectChanges();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    // console.log(changes);
    this.getData();
  }

  poprocess() {
    this.porderservice.purchaserorderproess(this.data.id).subscribe({
      next: (data) => {
        this.poprocesslist = data;
        this.ref.detectChanges();
      }
    });
  }

  headapprovel() {
    if (this.headapprove.status !== 'Approved' && this.headapprove.comments === '') {
      this.actionreason = true;
      return;
    } else {
      this.porderservice.headapproval(this.data.uuid, this.headapprove).subscribe({
        next: (resp) => {
          this.toast.success('Successfully Update the Status');
          this.headapprove.comments = '';
          this.statuopenform = false;
          this.ngOnInit();

        },
        error: (err) => {
          this.toast.failure(err.error.message);
        }
      });
    }

  }
  approve() {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Approval  Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to continue to approval?';
    modalRef.result.then(
      (parameterResponse) => {
        this.porderservice
          .approve({ uuid: this.data.uuid, notes: this.comments, fromstatus: this.fromstatus, tostatus: this.tostatus })
          .subscribe({
            next: (resp) => {
              this.toast.success('Successfully Send For Approval');
              this.statuopenform = false;
              this.ngOnInit();
            },
            error: (err) => {
              this.toast.failure(err.error.message);
            }
          });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  toFloat(x: any) {
    let xyz = parseInt(x) === x ? x : parseFloat(x).toFixed(2);
    return Number(xyz);
  }

  download() {
    this.showprint = false;
    this.porderservice.downloadvarpdf(this.data.uuid).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = this.baseurl + this.data.uuid + '.pdf';
          link.target = 'new';
          //link.download = path;
          document.body.appendChild(link);
          // console.log(link);
          link.click();

          link.remove();
        }
      },
      error: (err) => {
        this.toast.failure('Error while download file : ' + err.error.message);
      }
    });
    this.showprint = true;
  }

  downloadexcel() {
    this.showprintxl = false;
    this.porderservice.downloadvarxl(this.data.uuid).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + this.data.uuid + '.xlsx';
          link.target = "new"
          //link.download = path;
          document.body.appendChild(link);
          // console.log(this.baseurl, link);
          link.click();

          link.remove();
        }
      },
      error: (err) => {
        this.toast.failure('Error while download file : ' + err.error.message);
      }
    });
    this.showprintxl = true;
  }

  headapproval() {
    if (this.headapprove.status !== 'Approved' && this.headapprove.comments === '') {
      this.actionreason = true
      return
    } else {
      this.porderservice.headapproval(this.data.uuid, this.headapprove).subscribe({
        next: resp => {
          this.toast.success('Successfully Update the Status');
          this.headapprove.comments = '';
          this.statuopenform = false;
          this.ngOnInit()
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }


  }
}
