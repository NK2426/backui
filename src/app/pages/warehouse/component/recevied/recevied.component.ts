import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbDateParserFormatter  } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastService } from 'src/app/_helpers/toast.service';
import { PurchaseorderService } from '../../services/purchaseorder.service';
import { Address, Categories, Productselectimages, Purchaseorder, Subcategories, Batch, Qcitem } from '../../models/purchaseorder';
import { Settings } from '../../models/settings';
import { environment } from 'src/environments/environment';
import { Productvariants } from '../../models/productvariants';
import { Productmapparam } from '../../models/product';
import { Warehouse } from '../../models/warehouse';
import { DepartmentsService } from '../../services/departments.service';
import { Department } from '../../models/department';
import { Group } from 'src/app/pages/category-head/models/groups';
import { ProductvariantsService } from 'src/app/pages/category-head/services/productvariants.service';
import { forEach } from 'lodash';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { Console } from 'console';
import { Grn } from '../../models/grn';

@Component({
  selector: 'app-recevied',
  templateUrl: './recevied.component.html',
  styleUrls: ['./recevied.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, NgbModule, NgSelectModule, RouterModule, QRCodeModule, NgbModule]
})
export class ReceviedComponent implements OnInit {
  settings?: Settings;
  data: Purchaseorder = {};
  grndata: Grn = {};
  grns: Grn[];
  mappedvaiants: any = {};
  billaddress: Address = {};
  psidlabel = `PSID's`;
  discount = 0;
  showprint = true;
  selectedFormat = 1;
  selectedMRP = 0;
  formats: Array<{ id: Number; name: string }> = [
    { id: 1, name: 'A4 Size' },
    { id: 2, name: '50mm(W)*25mm(L) Size' },
    { id: 3, name: '15mm(W)*10mm(L) Size' },
    { id: 4, name: 'Tag' }
  ];
  variantList: boolean = false;
  taxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 };
  fromstatus = 'Create';
  tostatus = 'Process';
  purchaseitems: any = [];
  public user = JSON.parse(sessionStorage.getItem('auth_user') || '{}');
  show: boolean;
  variants: Productvariants[] = [];

  productmapparams: Productmapparam[] = [];
  genbundle = false;
  productimages: Productselectimages[] = [];
  qtytotal = 0;
  receivedqty: number; invoiceqty: number;
  temp: any;
  formData!: FormGroup;
  priceForm!: FormGroup;
  pricesubmit: boolean = false
  variantPoint: any;
  typeForm!: FormGroup;
  warehouse: Warehouse;
  submit: boolean = false;
  @Input() selectedPO: Purchaseorder = new Purchaseorder();
  @Output() refreshList = new EventEmitter<string>();
  departments: Department[] = [];
  productVariantCellValue: any = [];
  class: Categories[] = [];
  subclass: Subcategories[] = [];
  productvariants?: Productvariants[];
  groups: Group[] = [];
  selectedDept = '';
  selectedBrand = '';
  selectedClass = '';
  selectedSubclass = '';
  selectedGroup = '';
  variantlist: any = [];
  sum: number = 0;
  intValue: number = 0;
  valuelist: any = [];
  max_count: any;
  mrp: any;
  varList: any = {};
  getList: boolean = false;
  vendorMappingForms: FormArray;
  productVariantHeader: Productvariants[];
  productForm: FormGroup;
  cat_id: any;
  highqty: boolean = false;

  items: any=[];
  orderitem_array: any = [];

  //For Batch creation
  batches: Batch[] = [];
  currentBatch: Batch = {}
  batcheditems: any = [];
  editbatch = false;
  showedit = false;
  availablebatch: any = {}
  qcitems: Qcitem[] = []
  invqtytotal = 0;
  invoiceName:any='';  mindate:any = '';
  public formatter: NgbDateParserFormatter
  invdate:any='';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private porderservice: PurchaseorderService,
    private toast: ToastService,
    private modelservice: NgbModal,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private poservice: PurchaseorderService,
    private fb: FormBuilder,
    private departmentservice: DepartmentsService,
    private productvariantsservice: ProductvariantsService
  ) { }
  ngOnInit(): void {
    this.list();
    this.vendorMappingForms = this.fb.array([]);
    let uuid = this.route.snapshot.paramMap.get('uuid');
    var date = new Date();
    this.mindate = (date.toISOString().slice(0, 16)).split('T')[0]+'T00:00';
    this.formData = this.formBuilder.group({
      uuid: [uuid],
      remarks: [this.data.remarks, [Validators.required]],
      invoicedate: [this.data.invoicedate, [Validators.required]],
      invoicevalue: [this.data.invoicevalue, [Validators.required]],
      invoiceno: [this.data.invoiceno, [Validators.required]],
      invoice: [this.data.invoice, [Validators.required]],
      lrno: [this.data.lrno],
      transportcost: [this.data.transportcost || 0, [Validators.required]],
      //transporterid: [this.data.transporterid, [Validators.required]],
      overalldiscount: [this.data.overalldiscount || 0, [Validators.required]],
      receivedqty: [''],
      invoiceqty: [''],
      invoiceitemcount: [this.data.invoiceitemcount || ''],
      itemlist: this.fb.array([]),
      status: [this.data.ship_status || '']
      // transporter: [this.data.transportcost, [Validators.required]]
    });
    this.priceForm = this.formBuilder.group({
      uuid: [''],
      purchaseorder_id: [''],
      buyingprice: ['', [Validators.required, Validators.pattern('[0-9]*\.[0-9]{2}$')]],
      sellingprice: ['', [Validators.required, Validators.pattern('[0-9]*\.[0-9]{2}$')]],
      format: [this.selectedFormat, [Validators.required]]
    })
    //console.log(this.formData);
    this.productForm = this.fb.group({
      variant_points: this.fb.array([])
    });
  }

  list() {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      let itemData: any = [];
      this.porderservice.fulldetail(uuid).subscribe({
        next: (data) => {
          this.data = data;
          //this.items = data.purchaseorderitems;
          this.orderitem_array = [];
          if(this.data.invoicedate)
          {
            console.log(this.data.invoicedate)
            let splittime = (new Date(this.data.invoicedate).toISOString().slice(0, 16)).split('T')[1].split(':')
            this.invdate = (new Date(this.data.invoicedate).toISOString().slice(0, 16)).split('T')[0] + 'T'+splittime[0]+':'+splittime[0];
          }
         

          //Batch code
          this.batches = data.batches;
            this.qcitems = data.qcitems
            let openBatch = this.batches?.find((x:any)=>(x.status == 1))
            
            if(this.showedit == false)
            {
              this.availablebatch = this.batches?.find((x:any)=>(x.invoiceno == '' && x.status == 1))
              let lastbatchindex =this.batches?.length - 1 || 0
              if(!this.currentBatch?.id)
              this.currentBatch = this.batches?.[lastbatchindex]
               //Get All Grns
              this.porderservice.poGrnsdetail(data?.id).subscribe({
                next: (grndata) => {
                  this.grns = grndata;
                  this.grndata = this.grns?.find(x=>x.batch_id == this.currentBatch?.id)
                }
              })
            
            }
            else
              this.currentBatch = {}

            if(this.data.ship_status !== '' && !openBatch && !this.showedit && !this.availablebatch)
            {
              this.editbatch = true
            }
          //Batch code ends
          //this.invoiceqty = 0;
          this.priceForm.get('purchaseorder_id').setValue(this.data.id)
          this.data.purchaseorderitems.forEach((e: any, i: any) => {
            let key = Object.keys(e);
            let validqty = e.quantity - e.receivedqty;
            //this.invoiceqty += validqty

            if(!this.formData.controls['itemlist'].value[i])
            (this.formData.get('itemlist') as FormArray).push(
              this.fb.group({ id: e.id, uuid: e.uuid, receivedqty: e.receivedqty, invoiceqty: e.invoiceqty, validqty:validqty, quantity: e.quantity, product_id:e.product_id, purchaseorder_id:e.purchaseorder_id })
            );
            this.formData.get('invoiceitemcount').setValue(this.items.invoiceqty);
          });

          this.porderservice.Warehouse(this.data.warehouse_id).subscribe({
            next: (data) => {
              this.warehouse = data;
              this.cdr.detectChanges();
            }
          });
          this.invoiceName = this.data.invoice || '';
          if(this.invoiceName != '')
          {
            this.formData.controls['invoice'].clearValidators()
            this.formData.controls['invoice'].updateValueAndValidity()
          }
          this.formData.get('remarks').setValue(this.data.remarks);
          this.formData.get('transportcost').setValue(this.data.transportcost || 0);
          this.formData.get('overalldiscount').setValue(this.data.overalldiscount || 0);
          this.formData.get('invoiceno').setValue(this.data.invoiceno);
          this.formData.get('invoicedate').setValue(this.invdate);
          this.formData.get('invoicevalue').setValue(this.data.invoicevalue);
          this.formData.get('lrno').setValue(this.data.lrno);
          this.formData.get('receivedqty').setValue(this.data.receivedqty);
          //this.formData.get('invoice').setValue(this.data.invoice);

          // this.formData.get('invoiceitemcount').setValue(this.data.invoiceitemcount);
          if (data.expiredoc !== '') {
            this.show == true;
          }
          if (data.status == 'Revision') {
            this.fromstatus = 'Revision';
            this.tostatus = 'Revised';
          }
          this.purchaseitems = [];
          if (data.purchaseorderitems) {
            let variantdata: Productvariants[] = [];

            if (data.purchaseorderitems) {
              this.taxtotal = { ifigst: 0, ctaxtotal: 0, staxtotal: 0, itaxtotal: 0 };
              this.qtytotal = 0;
              this.receivedqty = 0;  this.invqtytotal = 0; this.invoiceqty = 0;
              data.purchaseorderitems.forEach((orderitem: any,index:any) => {
                this.orderitem_array.push(orderitem);
                //let dispatchedqty = this.qcitems?.filter((y:any)=>(y.batch_id != 0 && y.purchaseorderitem_id == orderitem.id))
                if(!this.currentBatch?.id)
                  {
                    let qcitmqty = this.qcitems?.filter((y:any)=>(y.batch_id == 0 && y.purchaseorderitem_id == orderitem.id))
                   
                    this.items[index] = qcitmqty?.length == 0 ? orderitem.invoiceqty : qcitmqty?.length;
                    this.invqtytotal +=  this.items[index];
                  }
                  else
                  {
                    let qcitmqty = this.qcitems?.filter((y:any)=>(y.batch_id == this.currentBatch?.id && y.purchaseorderitem_id == orderitem.id))
                    this.items[index] = qcitmqty?.length == 0 ? orderitem.invoiceqty : qcitmqty?.length;
                    this.invqtytotal +=  this.items[index];
                  }
                // for (let i = 0; i < this.orderitem_array.length; i++) {
                //   // this.formData.controls['invoiceitemcount'].setValue(this.orderitem_array[i].receivedqty)
                //   // console.log(this.orderitem_array[i].receivedqty);
                // }

                // this.formData.controls['invoiceitemcount'].setValue(orderitem.receivedqty)

                // if (orderitem.purchaseitemdetails) {
                //   orderitem.purchaseitemdetails.forEach((val: any) => {
                //     if (val.productvariant.id) {
                //       let checkvariant = variantdata.findIndex((res) => res.id === val.productvariant.id);
                //       if (checkvariant < 0) {
                //         variantdata.push({
                //           id: val.productvariant.id,
                //           name: val.productvariant.name,
                //           productvariantvalues: val.productvariant.productvariantvalues || []
                //         });
                //       }
                //       let pid = orderitem.product_id || 0;
                //       if (!this.mappedvaiants[pid]) this.mappedvaiants[pid] = {};
                //       this.mappedvaiants[pid][val.productvariant.id] = true;
                //     }

                //     this.variants = variantdata;
                //   });
                // }
                this.qtytotal += orderitem.quantity;
                this.receivedqty += orderitem.receivedqty;
                this.invoiceqty += orderitem.invoiceqty;
                if (orderitem.ifigst + '' == '1') {
                  this.taxtotal.ifigst = 1;
                }

                this.taxtotal.ctaxtotal += parseFloat(orderitem.ctaxval);
                this.taxtotal.staxtotal += parseFloat(orderitem.staxval);
                this.taxtotal.itaxtotal += parseFloat(orderitem.itaxval);
              });
            }
            //this.purchaseitems = data.purchaseorderitems[0]['purchaseitemdetails'];
          }

          if (data.user?.addresses && data.user?.addresses.length > 0) {
            //console.log(data.user.addresses[0]);
            this.billaddress = data.user?.addresses[0];
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

  get form() {
    return this.formData.controls;
  }
  toFloat(num: any) {
    return parseFloat(num).toFixed(2) || 0;
  }
  toInt(num: any) {
    return parseInt(num) || 0;
  }
  changeFormat(event: any) {
    this.selectedFormat = event.id;
    if (this.selectedFormat == 4) {
      this.psidlabel = 'Tags';
    }
  }

  generatepsid(uuid: any) {
    if (this.psidlabel == 'Tags' && this.selectedMRP <= 0) {
      this.toast.failure('Please enter valid MRP to show in Tags');
      return;
    }
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
    if (this.psidlabel == 'Tags' && this.selectedMRP <= 0) {
      this.toast.failure('Please enter valid MRP to show in Tags');
      return;
    }
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
      error: () => { }
    });
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
          document.body.appendChild(link);
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
  // changeMRP(event: any) {
  //   this.selectedMRP = event.target.value;
  // }
  get itemspoints() {
    return this.formData.get('itemlist') as FormArray;
  }
  additem(item: any) {
    return (this.formData.get('itemlist') as FormArray).push(this.fb.group(item));
  }

  checkvalue(event: any, i: any) {
    this.formData.controls['itemlist'].value[i].invoiceqty= Number(event.target.value);
    if (this.formData.get('itemlist').value[i].validqty < this.formData.get('itemlist').value[i].invoiceqty) {
      this.highqty = true
    }
    if (this.formData.get('itemlist').value[i].validqty >= this.formData.get('itemlist').value[i].invoiceqty) {
      this.highqty = false
    }
    if (this.formData.get('itemlist').value[i].invoiceqty == null) {
      this.formData.get('itemlist').value[i].invoiceqty.setvalue(0)
    }

    let invoiceitemcount = 0; this.invoiceqty = 0; this.invqtytotal = 0;
    this.formData.get('itemlist').value.map((itm:any) => {
      //if (this.purformData().controls[i].status != 'INVALID') {
        if(itm.invoiceqty)
        {
          invoiceitemcount += parseInt(itm.invoiceqty);
          this.invoiceqty += parseInt(itm.invoiceqty);
         // this.invqtytotal += parseInt(itm.invoiceqty)
        }
     
    })

  }

  save(status: string) {
    this.formData.get('status').setValue(status);
    this.formData.get('invoiceitemcount').setValue(this.invoiceqty)
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    let variant_array: any = [];
    // this.items.forEach((element: any) => {
    //   if (element.vendorvariantmapping.description == 'No Variant') {
    //     console.log('this is No Variant');
    //     console.log(element.vendorvariantmapping.description);

    //     variant_array.push(element.vendorvariantmapping.description);
    //   }
    // });

    //console.log('variant_array', variant_array, this.highqty);
    this.formData.get('itemlist').value.map((itm:any) => {
      if (itm.validqty < itm.invoiceqty) {
        this.highqty = true
      }
    })
    if (this.highqty) {
      this.toast.failure('Enter Invoice count less than received quantity'); 
    } else {
      if (variant_array.find((e: any) => e == 'No Variant')) {
        if (confirm('Are you sure want to proceed with No Variant? ')) {
          if (confirm('Are you sure want to proceed? ')) {
            this.poservice.updateRemarks(this.formData.value).subscribe({
              next: (resp) => {
                this.toast.success('P.O. Saved Successfully');
                this.refreshList.emit('refresh');
                this.formData.reset();
                this.formData.get('itemlist').reset();
                this.submit = false;
                this.list();
                this.router.navigate(['/warehouse/orders'])
              },
              error: (err) => {
                this.toast.failure(err);
              }
            });
          }
        } else {
          return;
        }
      } else {
        if (confirm('Are you sure want to proceed? ')) {
          this.poservice.updateRemarks(this.formData.value).subscribe({
            next: (resp) => {
              this.toast.success('P.O. Saved Successfully');
              this.refreshList.emit('refresh');
              this.formData.reset();
              this.formData.get('itemlist').reset();
              this.submit = false;
              this.list();
              this.router.navigate(['/warehouse/orders'])
            },
            error: (err) => {
              this.toast.failure(err);
            }
          });
        }
      }
    }
    this.highqty = false
  }

  recevied(status: string) {
    this.formData.get('status').setValue(status);
    this.formData.get('invoiceitemcount').setValue(this.invoiceqty)
    this.submit = true;
    if (this.formData.invalid) {
      return;
    }
    let variant_array: any = [];
    
    this.formData.get('itemlist').value.map((itm:any) => {
      if (itm.validqty < itm.invoiceqty) {
        this.highqty = true
      }
    })
    if (this.highqty) {
      this.toast.failure('Enter Invoice qty less than qty with received qty');
    } else {
      if (variant_array.find((e: any) => e == 'No Variant')) {
        if (confirm('Are you sure want to proceed with No Variant? ')) {
          if (confirm('Are you sure want to proceed? ')) {
            this.poservice.updateRemarks(this.formData.value).subscribe({
              next: (resp) => {
                this.toast.success('P.O. Saved Successfully');
                this.refreshList.emit('refresh');
                this.formData.reset();
                this.formData.get('itemlist').reset();
                this.submit = false;
                this.list();
                this.router.navigate(['/warehouse/orders/grninward'])
              },
              error: (err) => {
                if(err == 'po_id must be unique')
                  this.toast.failure("Enter unique invoice number");
                else
                this.toast.failure(err);
              }
            });
          }
        } else {
          return;
        }
      } else {
        if (confirm('Are you sure want to proceed? ')) {
          this.poservice.updateRemarks(this.formData.value).subscribe({
            next: (resp) => {
              this.toast.success('P.O. Saved Successfully');
              this.refreshList.emit('refresh');
              this.formData.reset();
              this.formData.get('itemlist').reset();
              this.submit = false;
              this.list();
              this.router.navigate(['/warehouse/orders/grninward'])
            },
            error: (err) => {
              if(err == 'po_id must be unique')
                this.toast.failure("Enter unique invoice number");
              else
              this.toast.failure(err);
            }
          });
        }
      }
    }


  }
  cancelAction(): void {
    let type = 'cancel1';
    if (!this.selectedPO.id) {
      type = '';
    }
    this.refreshList.emit(type);
  }
  novariant(content: any, item: any, index: number) {
    this.modelservice.open(content, { size: 'lg', animation: true });
    this.valuelist = [];
    this.variantList = true;
    this.cat_id = item.category_id;
    this.variant_function('yes', index);
  }
  getRequestParams(dept: string, cat: string, subcat: string): any {
    let params = { dept: '', cat: '', subcat: '', group: '' };

    if (dept) params['dept'] = dept;
    if (cat) params['cat'] = cat;
    if (subcat) params['subcat'] = subcat;
    // if (group)
    //   params['group'] = group;

    return params;
  }
  changeVariant(e: any) {
    this.valuelist = [];
  }

  // Used to get a strongly typed formarray
  getByIndex(index: number): FormArray {
    return this.vendorMappingForms.controls[index] as FormArray;
  }
  add_quentity(event: any) {

    this.variantPoint = this.productForm.value.variant_points;
    this.intValue = 0;

    this.variantPoint.forEach((element: any) => {
      // console.log(element.qty, typeof Number(element.qty),this.sum, typeof(this.sum), element);
      this.intValue += Number(element.qty);
      // console.log(this.sum, typeof(this.sum), this.intValue, typeof(this.intValue));
      // console.log(this.intValue)
      // console.log(parseInt(this.sum), typeof(this.sum))
    });
    if (this.max_count < this.intValue) {
      return this.toast.failure('Maximum Quantity for ' + this.max_count);
    }
  }
  check_quentity(event: any, index: any = null) {
    let value = 0;
    // parseFloat(this.formDataProduct.get('mrp').value);
    const control = <FormArray>this.productForm.controls['variant_points'];
    if (event.target.value > this.mrp) {
      //control.getvalue[index].price=0;
      ((this.productForm.get('variant_points') as FormArray).at(index) as FormGroup).get('price').patchValue(0);
      return this.toast.failure('Price should be Less than MRP :' + '' + this.mrp);
    }
  }
  getProductVariantOptions(index: number): FormArray {
    return this.getByIndex(index).get('productVariantOptions') as FormArray;
  }

  // dynamic insert form control in to form array
  addProductVariantOptions(index: number) {
    this.getProductVariantOptions(index).push(this.fb.control('', [Validators.required]));
  }
  // newVariant(id:any){
  //   this.productvariantsservice.variantlist(id).subscribe({
  //     next: (variants) => {
  //       this.productvariants = variants;

  //       console.log(this.productvariants);
  //     }
  //   });
  // }
  get variantPoints() {
    return this.productForm.get('variant_points') as FormArray;
  }

  addVariantPoint() {
    this.variantPoints.push(this.fb.group(this.varList));
  }
  deleteVariantPoint(index: any) {
    this.variantPoints.removeAt(index);
  }

  variant_function(value: any, index: any) {
    const control = <FormArray>this.productForm.controls['variant_points'];
    while (control.length > 0) {
      control.removeAt(0);
    }
    this.max_count = this.items[index].quantity;
    this.mrp = this.items[index].mrp;
    if (value === 'yes') {

      this.getList = true;
      this.vlist(index);
      // var x = document.getElementById("variant_details");
      // if(x.style.display === "none"){
      //   x.style.display = "block";
      // }
      // else{
      //   x.style.display = "none";
      // }
      // document.getElementById('variant_details').style.visibility = 'visible';
    } else {
      this.productForm.reset();
      this.varList = { Color: '1', qty: 0, price: 0 };
      this.addVariantPoint();
      //document.getElementById('variant_details').style.display = 'none';
      this.getList = false;
    }
  }
  async vlist(index: number) {
    this.valuelist = [];
    // let params = this.getRequestParams(
    //   this.purcaseForm.get('department').value,
    //   this.purcaseForm.get('category_id').value,
    //   this.purcaseForm.get('subcategory_id').value
    // );

    // await this.productvariantsservice.getAllVariants(params).subscribe({
    //   next: (productvariants:any) => {
    //     let variant=productvariants.data
    //     this.variantlist = variant?.rows;
    //     console.log(productvariants,this.productvariants);
    //   }, error: error => {
    //     //this.authRedirect.next(error)
    //   }
    // })
    // this.purcaseForm.get('category_id').value
    let cat = this.items[index].vendorvariantmapping.category_id;
    await this.productvariantsservice.getvariantlist(cat).subscribe({
      next: (productvariants: any) => {
        //let variant=productvariants.data;
        this.variantlist = productvariants;
        let tempData: any = { price: 0, qty: 0 };
        let i = 0;
        for (var index in productvariants) {
          tempData[productvariants[index].name] = 0;
          i++;
        }
        tempData = { ...tempData, price: 0, qty: 0 };
        this.varList = tempData;
        this.cdr.detectChanges();
        this.addVariantPoint();
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
  }
  submitVariant() {
    console.log(this.productForm.controls['variant_points'].value);

  }

  add(content: any, item: any) {
    this.priceForm.get('uuid').setValue(item)
    this.modelservice.open(content);
  }
  get formPrice() {
    return this.priceForm.controls;
  }

  addprice() {
    if (this.psidlabel == 'Tags' && this.selectedMRP <= 0) {
      this.toast.failure('Please enter valid MRP to show in Tags');
      return;
    }
    this.pricesubmit = true;
    this.porderservice.updateprice(this.priceForm.value).subscribe({
      next: (resp) => {

        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = environment.PDF_BASE_URL + 'psids_' + this.priceForm.get('uuid').value + '.pdf';
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

  createBatch() {
    this.editbatch = false
    this.showedit = true
    //this.purformData().controls = []
    //this.formData.get('itemlist')?.reset()
    this.list()
    
  }

  changeBatch(event: any) {
    if (event) {
      this.currentBatch = event;
    }
    else {
      this.currentBatch = {};
    }
    //this.purformData().controls = []
    this.list()

  }

  onSelectedFilepath(event: any, type:string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      //this.addfilepath = file
      const formdp: any = new FormData();
      formdp.append('path', file);
      formdp.append('type', type);
      formdp.append('uuid', this.data.uuid);
      var msg = 'Created';
      this.porderservice.saveinvoice(formdp).subscribe({
        next: resp => {
         
          if(type=='invoice')
          this.invoiceName = resp;
          this.toast.success('Document Successfully '+msg);
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      });
    }
  }

  
}

