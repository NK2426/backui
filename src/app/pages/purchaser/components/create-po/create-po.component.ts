import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { map, take } from 'rxjs';
import { Tax } from 'src/app/pages/category-head/models/product';
import { MRPPriceValidatorDirective } from 'src/app/_helpers/directives/mrp-price-validator.directive';
import { PriceMRPValidatorDirective } from 'src/app/_helpers/directives/price-validator.directive';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { environment } from 'src/environments/environment';
import { Documents } from '../../models/documents';
import { Group, Product, Productmapparam, Productselectimage } from '../../models/product';
import { Department, Paymentterm, Purchaseorder, Vendor, Warehouse, purchaseid } from '../../models/purchaseorder';
import { EnvService } from '../../services/env.service';
import { PurchaseorderService } from '../../services/purchaseorder.service';
import { PoListComponent } from '../po-list/po-list.component';
import { PoComponent } from '../po/po.component';
import { UsersService } from 'src/app/pages/hr/services/users.service';
import { VendorService } from 'src/app/pages/category-head/services/vendor.service';
import { State, VendorAgent } from 'src/app/pages/category-head/models/vendor';
import { daysToWeeks } from 'date-fns';
import { AddvendorComponent } from '../add-vendor/add-vendor.component';
import { isEmpty } from 'lodash';
import { Categories, Categoriespaginate } from 'src/app/pages/category-head/models/categories';
import { CategoriesService } from 'src/app/pages/category-head/services/categories.service';
import { ProductsService } from 'src/app/pages/category-head/services/products.service';
import { Subcategories } from 'src/app/pages/category-head/models/subcategories';
import { Action } from 'rxjs/internal/scheduler/Action';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { ProductvariantsService } from 'src/app/pages/category-head/services/productvariants.service';
import { GroupService } from 'src/app/pages/catalog/services/group.service';
import { th } from 'date-fns/locale';
import { Productvariants } from '../../models/productvariants';
import { HighContrastMode } from '@angular/cdk/a11y';
import { CompressImageService } from '../../services/compress-image.service';

// import { Vendor } from 'src/app/pages/category-head/models/vendor';
@Component({
  selector: 'app-create-po',
  templateUrl: './create-po.component.html',
  styleUrls: ['./create-po.component.scss'],
  standalone: true,
  imports: [
    PoListComponent,
    AddvendorComponent,
    CommonModule,
    MRPPriceValidatorDirective,
    PriceMRPValidatorDirective,
    NgIf,
    NgFor,
    RouterModule,
    FormsModule,
    DatePipe,
    JsonPipe,
    MatStepperModule,
    MatIconModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {
        showError: true,
        displayDefaultIndicatorType: false
      }
    }
  ]
})
export class CreatePoComponent implements OnInit {
  interests: any = [];
  fileName: any = '';
  billing: any;
  isLinear = true;
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  paymentarr: any = {};
  searchdepart = 0;
  @ViewChild(PoComponent) PoComponent: PoComponent;
  @ViewChild(AddvendorComponent) AddvendorComponent: AddvendorComponent;
  po_detailsForm: FormGroup;
  product_detailsForm: FormGroup;
  poCreationForm: FormGroup;
  @Input() components: ComponentType<any>[];
  taxes: Tax[] = [];
  group: Group = {};
  searching = false;
  searchFailed = false;
  stepperOrientation: any = 'horizontal';
  items: FormArray<any>;
  mobile: boolean;
  warehousetaxtype: any
  link: any = '';
  silkSareeDetail: any;
  formDataProduct!: FormGroup;
  formBuilder: any;
  uuid: any = '';
  urlLink: any = '';
  tempPurchaseOrderItems: any;
  agents: any = [];
  billingAddress: any = '';
  cdata: any = '';
  scdata: any = '';
  desc: string = '';
  catids: any;
  subcatid: any;
  grupsdata: Group[] = [];
  mylatlng: any = {
    lat: null,
    lng: null
  };
  max_count: any = 0;
  variantPoint: any;
  sum: number = 0;
  intValue: number = 0;

  selectedGroup: string;
  getList: boolean = false;
  isvariant: any = '';
  // new edit image
  images: any[] = [];
  selectedimages: any[] = [];
  medselectedimages: any[] = [];
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  previews: string[] = [];
  editImage: any = {};
  index: any = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private porderservice: PurchaseorderService,
    private fb: FormBuilder,
    private utiltiyservice: UtilsService,
    private env: EnvService,
    private modalService: NgbModal,
    private toaster: ToastService,
    private datepipe: DatePipe,
    private userservice: UsersService,
    private breakpointObserver: BreakpointObserver,
    private vendorservice: VendorService,
    private productservice: ProductsService,
    private modelservice: NgbModal,
    private catservice: CategoriesService,
    private productvariantsservice: ProductvariantsService,
    private groupService: GroupService,
    private compressImage: CompressImageService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    //this.purcaseForm = this.createFormGroupWithBuilderAndModel(this.fb);
  }

  purcaseForm: FormGroup;
  itemlist: FormArray;
  categories?: Categories[];
  subcategories: Subcategories[] = [];
  categorypaginate?: Categoriespaginate = {};
  dataProduct: Product = {};
  submit: boolean = false;
  breadCrumbItems: Array<{}> = [];
  departments: Department[] = [];
  products: Product[] = [];
  vendors: Vendor[] = [];
  purchaseid: purchaseid[] = [];
  selvendor: Vendor = {};
  variants: any[] = [];
  discountypes: Array<{ id: number; name: string }> = [
    { id: 0, name: 'Select' },
    { id: 1, name: 'Per Item' },
    { id: 2, name: 'Overall' }
  ];
  discountoptions: Array<{ id: number; name: string }> = [
    { id: 0, name: '%' },
    { id: 1, name: 'INR' }
  ];
  addfile: string = '';
  subtotal = 0;
  total = 0;
  fitem: any = {};
  selproductid = '';
  data: Purchaseorder = {};
  productmapparams: Productmapparam[] = [];
  productimages: Productselectimage[] = [];
  productvariants?: Productvariants[];
  baseurl: string = '';
  documentlist: Documents[] = [];
  symbol = '';
  valid = [{}];
  disvalid = true;
  distypevalid = true;
  totalvalid = true;
  docArray: any = [];
  state = '';
  mappedvaiants: any = {};
  setvalue = '-1-';
  EmpName: any;
  showsingleimg: boolean = false;

  potypes: Array<{ name: string }> = [{ name: 'Inventory' }, { name: 'SOR' }];
  paymentterms: Paymentterm[] = [];
  purchaseformval: any = [];
  totalval = { subtotal: 0, totaldiscount: 0, total: 0, cgsttotal: 0, sgsttotal: 0, igsttotal: 0, grandtotal: 0 };
  vendor: VendorAgent[] = [];
  minDate: any = '';
  expminDate: any = '';
  payment = false;
  warehouses: Warehouse[] = [];
  currentItem: any;
  isId: boolean = false;
  wareHouseId: any = 0;
  newArray: any;
  step1 = new FormControl('');
  step2 = new FormControl('');
  step3 = new FormControl('');
  step4 = new FormControl('');
  @ViewChild('stepper') stepper: MatStepper;
  public user = JSON.parse(sessionStorage.getItem('token') || '{}');
  modelref: NgbModalRef;
  datehint: boolean = false;
  states?: State[];
  groups: any[] = [];
  productForm: FormGroup;
  variantlist: any = [];
  valuelist: any = [];
  varList: any = {};
  payementtermValue: any

  ngOnInit(): void {
    this.baseurl = environment.PDF_BASE_URL;
    // console.log(this.purcaseForm);
    this.purcaseForm = this.fb.group({
      uuid: [''],
      agentId: [''],
      department: [''],
      potrasnporter_id: [''],
      lat: [''],
      long: [''],
      billingaddress_id: [''],
      purchaseid: [''],
      //product: [''],
      vendor: ['', [Validators.required]],
      warehouse_id: ['', [Validators.required]],
      //discountype: [''],
      //discount: ['', [Validators.pattern('[0-9]+')]],
      date: ['', [Validators.required]],
      deliverydate: ['', [Validators.required]],
      paymentterm_id: [''],
      potransporter_id: [''],
      potype: ['', [Validators.required]],
      //billing_address: ['', [Validators.required]],
      notes: [''],
      documents: [''],
      state: [''],
      group_id: [''],
      category_id: ['', [Validators.required]],
      subcategory_id: [''],
      state_id: [''],
      itemlist: this.fb.array([])
    });
    this.formDataProduct = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      department_id: [0, [Validators.required]],
      category_id: ['', { disabled: true }, [Validators.required]],
      subcategory_id: ['', { disabled: true }, [Validators.required]],
      group_id: ['', { disabled: true }, [Validators.required]],
      did: ['', [Validators.required]],
      brand_id: [0, [Validators.required]],
      mrp: [0, { validators: [Validators.required, Validators.pattern(/^[-+]?[0-9]*\.?[0-9]+$/)], updateOn: 'change' }],
      price: [0, { validators: [Validators.required, Validators.pattern(/^[-+]?[0-9]*\.?[0-9]+$/)], updateOn: 'change' }],
      description: [''],
      selling_price: [0],
      status: ['1'],
      vendor_id: [0, [Validators.required]],
      tax_id: [-1, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      percentage: [0, [Validators.required]],
      hsncode: ['', [Validators.pattern('[0-9]+'), Validators.required]],
      image: ['', Validators.required]
    });
    this.minDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.expminDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.purcaseForm.get('date').patchValue(this.formatDate(new Date()));

    this.state = history.state.clone || '';

    this.baseurl = this.env.Vendor_URL;
    ///// Edit P.O
    let uuid = this.route.snapshot.paramMap.get('uuid');
    //console.log('uuid', uuid)
    this.uuid = uuid;
    let puid = history.state.puid;
    this.getWarehouse();
    this.paymentermlist();

    // this.porderservice.allvendor('3').subscribe({
    //   next: (data) => {
    //     this.vendors = data;
    //     this.cdr.detectChanges();
    //   }
    // });
    this.userservice.getPurchaserid().subscribe({
      next: (data) => {
        this.purchaseid = data.data;
        // console.log(this.uuid, '->666');
        this.cdr.detectChanges();
      }
    });

    // this.purcaseForm.get('purchaseid').setValue(this.purchaseid)

    this.vendorservice.getAgent().subscribe({
      next: (agent) => {
        this.agents = agent.data;
        this.purcaseForm.get('agentId').setValue(this.agents[this.agents.length - 1].id);
        // console.log(this.agents[this.agents.length - 1].id, this.agents);
        this.cdr.detectChanges();
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
    this.getvendors('');
    this.purcaseForm.get('warehouse_id').setValue(this.user.warehouse_id);
    // if (this.user.role !== 0) this.purcaseForm.get('warehouse_id').disable();

    // console.log('uuid=>', uuid);
    if (uuid) {
      // console.log('uuid=>', uuid);
      this.porderservice.find(uuid).subscribe({
        next: (data) => {
          this.data = data;
          // console.log('new ', data, typeof this.data);
          if (this.state == '' && this.data.status != 'Draft' && this.data.status != 'Revise' && this.data.status != 'Vendor_revise') {
            this.router.navigate(['/po/view/' + this.data.uuid]);
          }
          this.vendorlist(Number(this.data.agentId));
          this.purcaseForm.get('department')?.setValue(this.data.department_id || '3');
          this.purcaseForm.get('date')?.setValue(this.data.date || '');
          this.purcaseForm.get('agentId')?.setValue(this.data.agentId || '');
          this.purcaseForm.get('deliverydate')?.setValue(this.data.deliverydate || '');
          this.payementtermValue = this.purcaseForm.get('paymentterm_id')?.setValue(this.data.paymentterm_id || '0');
          this.purcaseForm.get('paymentterm_id')?.setValue(this.data.paymentterm_id || '0');
          this.purcaseForm.get('warehouse_id')?.setValue(this.data.warehouse_id || '0');
          this.purcaseForm.get('potype')?.setValue(this.data.potype || '');
          this.purcaseForm.get('purchaseid')?.setValue(this.data.purchaseid || '');
          this.purcaseForm.get('notes')?.setValue(this.data.notes || '');
          this.purcaseForm.get('documents')?.setValue(this.data.documents || '');
          this.purcaseForm.get('vendor')?.setValue(this.data.vendor_id || '');
          this.purcaseForm.get('billingaddress_id')?.setValue(this.data.billingaddress_id);
          this.purcaseForm.get('potrasnporter_id')?.setValue(this.data.transporterid);
          this.purcaseForm.get('state_id')?.setValue(this.data.state_id);
          this.purcaseForm.get('group_id')?.setValue(this.data.group_id);
          this.purcaseForm.get('category_id')?.setValue(this.data.category_id),
            this.purcaseForm.get('subcategory_id')?.setValue(this.data.subcategory_id),
            // this.purcaseForm.get('vendor')?.disable();
            this.purcaseForm.get('agentId')?.disable();
          this.purcaseForm.get('category_id')?.disable();
          this.purcaseForm.get('subcategory_id')?.disable();
          this.purcaseForm.get('group_id').disable();
          this.purcaseForm.get('vendor').disable();
          // console.log(' loading ->', this.vendors, this.purcaseForm.value);
          this.billingList(this.data.billingaddress_id);
          // this.purcaseForm.get('warehouse_id')?.setValue(this.data.warehouse_id || '0');
          this.docArray = this.data?.documents != '' ? this.data?.documents?.split(',') : [];
          if (data.product && data.product.productselectimages) {
            this.productimages = data.product.productselectimages;
          }
        },
        complete: () => {
          this.departmentlist();
        },
        error: () => { }
      });
      this.isId = true;
    } else if (puid && !uuid) {
      /// From Product ////
      // console.log('puid=>', puid);
      this.porderservice.productfind(puid).subscribe({
        next: (data) => {
          if (data) {
            if (!this.data.product) this.data.product = {};

            this.data.product.department_id = data.department_id || '';
            this.data.product_id = data.pid || '';
          }
          if (data.product && data.product.productselectimages) {
            this.productimages = data.product.productselectimages;
          }
        },
        complete: () => {
          //this.departmentlist();
        },
        error: () => { }
      });
    } else {
      // console.log('uuids=>', uuid);
      this.isId = false;
      // console.log('id', this.user.uuid);
      this.purcaseForm.get('department')?.setValue('3');
      //this.changeDepartment();
    }

    this.userservice.getStates().subscribe({
      next: (resp) => {
        this.states = resp.data;
        // console.log(this.states);
      },
      error: (error) => { }
    });

    this.doclist();

    // this.cdr.detectChanges();

    this.purcaseForm.valueChanges.subscribe((formdata: any) => {
      this.totalval = { subtotal: 0, totaldiscount: 0, total: 0, cgsttotal: 0, sgsttotal: 0, igsttotal: 0, grandtotal: 0 };
      if (formdata.itemlist) {
        formdata.itemlist.forEach((selitem: any, i: number) => {
          //console.log("selitem ->", selitem)
          //if (selitem.product) {
          this.purchaseformval[i] = selitem;
          this.purchaseformval[i]['subtotal'] = parseInt(selitem.qty) * parseFloat(selitem.price) || 0;
          this.totalval.subtotal += this.purchaseformval[i]['subtotal'];
          this.purchaseformval[i]['discounttotal'] = 0;
          if (selitem.discounttype == 1) {
            let discounttotal = 0;
            if (selitem.discountoption == 0) discounttotal = selitem.qty * ((selitem.price * selitem.discount) / 100);
            else {
              discounttotal = selitem.qty * selitem.discount;
            }

            this.purchaseformval[i]['discounttotal'] = discounttotal;
          } else if (selitem.discounttype == 2) {
            let discounttotal = selitem.discount;
            if (selitem.discountoption == 0) discounttotal = (selitem.qty * selitem.price * selitem.discount) / 100;
            this.purchaseformval[i]['discounttotal'] = discounttotal;
          }
          this.totalval.totaldiscount += parseFloat(this.purchaseformval[i]['discounttotal']);
          this.purchaseformval[i]['total'] =
            parseFloat(this.purchaseformval[i]['subtotal']) - parseFloat(this.purchaseformval[i]['discounttotal']) || 0;
          this.totalval.total += this.purchaseformval[i]['total'];
          // subtotal += val.value.qty * ((val.value.cgstpercentage * val.value.price)/100)
          this.purchaseformval[i]['igst'] = 0;
          this.purchaseformval[i]['cgst'] = 0;
          this.purchaseformval[i]['sgst'] = 0;
          this.purchaseformval[i]['grandtotal'] = parseFloat(this.purchaseformval[i]['total']);
          let pindexid = this.products.findIndex((selval) => selval.pid == selitem.product);
          //console.log('purcaseform ->', this.purchaseformval)
          if (this.products[pindexid]) {
            if (this.selvendor.taxtype == 1) {
              this.purchaseformval[i]['sgst'] = 0;
              this.purchaseformval[i]['cgst'] = 0;
              if (this.products[pindexid]['percentage']) {
                let igstpercentage = this.products[pindexid]['percentage'] || 0;
                let igstvalue = (parseFloat(this.purchaseformval[i]['total']) * igstpercentage) / 100;
                this.purchaseformval[i]['igst'] = igstvalue;
                this.totalval.igsttotal += igstvalue;
              }
            } else {
              this.purchaseformval[i]['igst'] = 0;
              //if (this.products[pindexid]['ctax']) {
              let taxperc = 0;
              if (this.products[pindexid]['percentage']) {
                let taxpercvalue = this.products[pindexid]['percentage'] || 0;
                taxperc = this.getFloat(taxpercvalue / 2);
              }
              //let cgstpercentage =  this.products[pindexid]['percentage'] || 0;
              let cgstvalue = (parseFloat(this.purchaseformval[i]['total']) * taxperc) / 100;
              this.purchaseformval[i]['cgst'] = cgstvalue;
              this.totalval.cgsttotal += cgstvalue;
              //}
              //if (this.products[pindexid]['stax']) {
              //let sgstpercentage = this.products[pindexid]['percentage'] || 0;
              let sgstvalue = (parseFloat(this.purchaseformval[i]['total']) * taxperc) / 100;
              this.purchaseformval[i]['sgst'] = sgstvalue;
              this.totalval.sgsttotal += sgstvalue;
              //}
            }
            this.purchaseformval[i]['grandtotal'] = parseFloat(
              this.purchaseformval[i]['total'] +
              this.purchaseformval[i]['cgst'] +
              this.purchaseformval[i]['sgst'] +
              this.purchaseformval[i]['igst']
            );
            this.totalval.grandtotal += this.purchaseformval[i]['grandtotal'];
          }
        });
        this.tempPurchaseOrderItems = this.formData().value;
      }
    });

    this.productForm = this.fb.group({
      variant_points: this.fb.array([])
    });

    // this.vendorservice.getAgentbylocation().subscribe({
    //   next: (agent) => {
    //     this.agents = agent.data;
    //     this.purcaseForm.get('agentId').setValue(this.agents[this.agents.length - 1].id);
    //     console.log(this.agents[this.agents.length - 1].id, this.agents);

    //     this.cdr.detectChanges();
    //   },
    //   error: (error) => {
    //     //this.authRedirect.next(error)
    //   }
    // });

    this.cdr.detectChanges();
    // console.log('id', this.user.uuid, this.purcaseForm.get('purchaseid').setValue(this.user.uuid));
    // console.log(this.product_catid);
    //console.log("form =>", this.purcaseForm)

    // this.setState(this.step1, true)
    // this.setState(this.step2, true)

    this.getSelectvalues();

    this.findMe();

    this.list();
    if (this.uuid == null) {
      this.purcaseForm.get('purchaseid').setValue(this.user.id);
    }
  }

  private formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  add_quentity(event: any) {
    // console.log(event.target.value);
    // console.log(this.productForm.value.variant_points);
    this.variantPoint = this.productForm.value.variant_points;
    // console.log(this.variantPoint);
    this.intValue = 0;

    this.variantPoint.forEach((element: any) => {
      // console.log(element.qty, typeof Number(element.qty),this.sum, typeof(this.sum), element);
      this.intValue += Number(element.qty);
      // console.log(this.sum, typeof(this.sum), this.intValue, typeof(this.intValue));
      // console.log(this.intValue)
      // console.log(parseInt(this.sum), typeof(this.sum))
    });
    // if (this.max_count < this.intValue) {
    //   return this.toaster.failure("Maximum count for 50")
    // }
    // console.log('total count =>', this.intValue);
  }
  check_quentity(event: any, index: any = null) {
    let value = parseFloat(this.formDataProduct.get('mrp').value);
    const control = <FormArray>this.productForm.controls['variant_points'];
    // console.log(control.value[index]);
    if (event.target.value > value) {
      //control.getvalue[index].price=0;
      ((this.productForm.get('variant_points') as FormArray).at(index) as FormGroup).get('price').patchValue(0);
      return this.toaster.failure('Price should be Less than MRP');
    }
    // console.log('total count =>', this.intValue);
  }
  getRequestParams(dept: string, cat: string, subcat: string, group: string = null): any {
    let params = { dept: '', cat: '', subcat: '', group: '' };

    if (dept) params['dept'] = dept;
    if (cat) params['cat'] = cat;
    if (subcat) params['subcat'] = subcat;
    // if (group)
    //   params['group'] = group;

    return params;
  }
  async list() {
    let params = this.getRequestParams(
      this.purcaseForm.get('department').value,
      this.purcaseForm.get('category_id').value,
      this.purcaseForm.get('subcategory_id').value,
      this.purcaseForm.get('group_id').value
    );

    await this.productvariantsservice.getAll(params).subscribe({
      next: (productvariants) => {
        this.productvariants = productvariants.datas;
        // console.log(this.productvariants);

        if (productvariants.totalItems) this.count = productvariants.totalItems;
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
  }

  findMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // console.log('latitude', position.coords.latitude);
        // console.log('longitude', position.coords.longitude);
        this.mylatlng.lat = position.coords.latitude;
        this.mylatlng.lng = position.coords.longitude;
        // this.porderservice.getLocation(this.mylatlng.lat,this.mylatlng.lng).subscribe({
        //   next: (resp) => {
        //     console.log('inside2',resp);
        //   },
        //   error: (err) => {
        //     console.log(err);
        //   }
        // });
        this.purcaseForm.get('lat').setValue(this.mylatlng.lat);
        this.purcaseForm.get('long').setValue(this.mylatlng.lng);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  getSubclasses() {
    let did = this.purcaseForm.get('category_id')?.value;
    // console.log('uuid=>', did);
    if (did) {
      this.productservice.getcatlist(did).subscribe({
        next: (data) => {
          this.subcategories = [];
          this.subcategories = data.subcategories;
          // console.log(this.subcategories);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  // ngAfterViewInit(): void {

  // }
  vendorlist(data: any = '') {
    // console.log(this.purcaseForm.get('agentId'));
    // if (this.purcaseForm.get('agentId').value == this.agents[this.agents.length - 1].id) {
    //   this.getvendors('');
    // } else {
    let agentId = 0;
    if (data.target === undefined) {
      agentId = data;
    } else {
      agentId = data.target.value;
    }
    let state_id = this.purcaseForm.get('state_id').value;

    this.porderservice.allvendorAgent(agentId, state_id).subscribe({
      next: (data: any) => {
        this.vendors = [];
        this.vendors = data;
        this.paymentarr = data;
        // console.log(this.paymentarr[0], data);

        if (this.data && this.data.vendor_id) {
          this.purcaseForm.get('vendor')?.setValue(this.data.vendor_id);
          this.productlist('', false);
        }
        this.cdr.detectChanges();
      }
    });
    // console.log('vendot', this.data.paymentterm_id);
    // }
  }
  async getWarehouse() {
    await this.porderservice.getWarehouses().subscribe({
      next: (data) => {
        // console.log(this.purcaseForm.get('billingaddress_id')?.value, 'warehouse', data);
        this.warehouses = data;
        //this.billingList(this.purcaseForm.get('billingaddress_id')?.value);
        this.cdr.detectChanges();
      }
    });
  }
  getallvendors() {
    this.porderservice.allvendor('3').subscribe({
      next: (data) => {
        this.vendors = data;
        this.cdr.detectChanges();
      }
    });
  }
  async getvendors(event: any) {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    // console.log(this.purcaseForm.get('state_id').value);
    let stateId = this.purcaseForm.get('state_id').value;
    if (stateId && stateId != undefined) {
      await this.porderservice.allvendorAgent('1', stateId).subscribe({
        next: (data: any) => {
          this.vendors = data;
          this.cdr.detectChanges();
        }
      });
    }

    if (uuid) {
      await this.porderservice.allvendors().subscribe({
        next: (data) => {
          this.vendors = data;
          // console.log('inside if');
        }
      });
      this.purcaseForm.get('vendor').setValue(this.data.vendor_id);
    }
    // console.log('GBVendor', this.vendors);
  }

  getControls() {
    return (this.purcaseForm.get('itemlist') as FormArray).controls;
  }

  onMRPBlur(mrp: any, price: any) {
    if (mrp > price && price != 0) {
      this.formDataProduct.get('price')?.setErrors(null);
    }
  }

  checkvalue(i: number) {
    let selitem: any = Object.assign({}, this.purcaseForm.get('itemlist')?.value[i]);
    //console.log(selitem.price, selitem.mrp);

    if (selitem.product) {
      if (parseFloat(selitem.price) > parseFloat(selitem.mrp)) {
        this.toaster.failure('Please Enter the Price Less than MRP');
        //console.log('Please enter the price less than mrp');
        this.valid[i] = 1;
        return;
      } else {
        this.valid[i] = 0;
      }

      if (selitem.price && (parseFloat(selitem.price) < 0 || !this.isNumeric(selitem.price * 1))) {
        selitem.price = 0;
        selitem.discount = 0;
        selitem.discounttotal = 0;
        this.formData().at(i).patchValue(selitem);
      }
      if (selitem.qty && (parseFloat(selitem.qty) < 0 || !this.isNumeric(selitem.qty))) {
        selitem.qty = 0;
        this.formData().at(i).patchValue(selitem);
      }
      if (selitem.discounttype == 0 || (selitem.discountoption == 0 && selitem.discount >= 100) || !this.isNumeric(selitem.discount)) {
        selitem.discount = 0;
        selitem.discounttotal = 0;
        this.formData().at(i).patchValue(selitem);
      }
      selitem.discount = parseFloat(selitem.discount);
      ////console.log(selitem.discounttype, selitem.discount, parseFloat(this.purchaseformval[i]['price']))
      ////console.log(selitem.discounttype, selitem.discount, parseFloat(this.purchaseformval[i]['subtotal']))

      if (
        (selitem.discounttype == 1 && selitem.discount >= parseFloat(this.purchaseformval[i]['price'])) ||
        (selitem.discounttype == 2 && selitem.discount >= parseFloat(this.purchaseformval[i]['subtotal']))
      ) {
        selitem.discount = 0;
        selitem.discounttotal = 0;
        this.formData().at(i).patchValue(selitem);
      }
    }
  }
  get form() {
    return this.purcaseForm.controls;
  }
  isNumeric(str: any) {
    return /^-?\d+$/.test(str);
  }
  formData(): FormArray {
    return this.purcaseForm.get('itemlist') as FormArray;
  }
  getitemData() {
    return this.purcaseForm.get('itemlist')?.value;
  }
  removeField(i: number, id: any = '') {
    if (confirm('Are you sure you want to delete this order item ?')) {
      this.formData().removeAt(i);
    }
  }
  clearAll() {
    this.formData().clear();
  }
  addField() {
    return new Promise<void>((resolve, reject) => {
      this.formData().push(this.field());
      this.tempPurchaseOrderItems = this.formData().value;
      resolve();
    });
  }
  field(): FormGroup {
    return this.fb.group(this.fitem);
  }
  departmentlist() {
    this.porderservice.departmentlist().subscribe({
      next: (data) => {
        this.departments = data;
        if (this.data) {
          let department = this.data.department_id;
          this.purcaseForm.get('department')?.setValue(department);
          this.changeDepartment();
        }
      }
    });
  }
  changeDepartment(action = '') {
    this.purcaseForm.get('department')?.setValue('3');
    let seldepart = this.purcaseForm.get('department')?.value;
    // console.log(seldepart, '=<');
    if (seldepart) {
      //this.purcaseForm.get('vendor')?.setValue('');
      // this.clearAll()

      this.products = [];
      //this.vendors = [];
      this.variants = [];
      this.selproductid = '';
    }
  }

  itemSelected($event: any) {
    const groupval = $event;
    this.group = groupval;
    // console.log('new', this.group, groupval.id);
    if (groupval.id) {
      this.formDataProduct.get('department_id')?.setValue(groupval.department_id);
      this.formDataProduct.get('category_id')?.setValue(groupval.category_id);
      this.formDataProduct.get('subcategory_id')?.setValue(groupval.subcategory_id);
      this.formDataProduct.get('group_id')?.setValue(groupval.id);
      this.formDataProduct.get('vendor')?.setValue(this.selvendor.uid);
      this.formDataProduct.get('brand_id')?.setValue(1);
      this.formDataProduct.get('selling_price')?.setValue(0);
      this.purcaseForm.get('category_id').setValue(groupval.category_id);
      // this.purcaseForm.get('category_id').disable();
      this.purcaseForm.get('group_id')?.setValue(groupval.id);
      // console.log('new', groupval, this.purcaseForm.get('group_id').value);
    }
  }

  changeSubcategory() {
    this.groups = [];
    this.selectedGroup = '';
    this.productvariantsservice
      .grouplist(this.purcaseForm.get('department')?.value, this.purcaseForm.get('subcategory_id')?.value)
      .subscribe({
        next: (groups: any) => {
          this.groups = groups;
          // console.log('sub', this.groups);
        }
      });

    this.porderservice.taxlist().subscribe({
      next: (taxes) => {
        this.taxes = taxes;
      }
    });
  }

  patch_catid = '';
  patch_scatid = '';
  patch_groupid = '';
  cat_id: any;
  scat_id: any;
  grp_id: any;
  grps: any;
  isDisabled: boolean = true;
  getgroup(event: any) {
    this.grps = event.target.value;
    // console.log(event.target.value);
    this.purcaseForm.get('group_id').setValue(event.target.value);
  }
  addNewProduct(productContent: any) {
    // this.getSaree();
    // this.getSelectvalues();
    let subcat = this.purcaseForm.get('subcategory_id').value;
    let grp = this.purcaseForm.get('group_id').value;
    // console.log(this.purcaseForm, ' -> ', this.subcategories);
    // Category patch value
    var catid = this.formDataProduct.value.category_id;
    this.cat_id = this.categories.filter(function (data) {
      return data.cid == catid;
    });
    // Subcategory Patch Value
    var scatid = this.formDataProduct.value.subcategory_id;
    // console.log(scatid, typeof scatid);
    this.scat_id = this.subcategories.filter(function (data) {
      return data.id == scatid;
    });
    //this.getSubclasses()
    // console.log('sub', this.subcategories, this.scat_id, subcat);
    this.formDataProduct.get('subcategory_id').setValue(subcat);
    this.formDataProduct.get('group_id')?.setValue(grp);
    this.patch_groupid = this.group.name;
    this.grp_id = this.groups.find((element) => element.id == this.formDataProduct.get('group_id').value);
    // console.log('grp_id', this.grp_id, grp, this.formDataProduct.value);

    this.changeSubcategory();

    this.modelref = this.modalService.open(productContent, { size: 'lg' });
    // this.formDataProduct.get('subcategory_id').disable();
    // this.formDataProduct.get('group_id')?.disable();
    // this.formDataProduct.get('category_id')?.disable();
  }
  taxchange(tax: any) {
    if (tax) {
      ////console.log(tax)
      this.formDataProduct.get('percentage')?.setValue(tax.percentage);
    }
  }

  getSaree(event: Array<any>) {
    this.porderservice.search(Object.values(event)[1]).subscribe((x: any) => {
      // console.log('inside');
      if (x.length > 0) {
        this.searchFailed = false;
        this.silkSareeDetail = x[0];
        this.itemSelected(this.silkSareeDetail);
      } else {
        this.searchFailed = true;
        this.toaster.failure('Try again !');
      }
    });
    this.porderservice.taxlist().subscribe({
      next: (taxes) => {
        this.taxes = taxes;
      }
    });
    this.purcaseForm.get('group_id')?.setValue(Object.values(event)[1]);
  }
  // catlist(): void {
  //   const  = this.utiltiyservice.getRequestParams('3'+'#'+this.search, this.page, this.pageSize)
  //   this.caregoriesservices.getAll(params)
  //     .subscribe({
  //       next: categories => {
  //         this.categories = categories.datas;
  //         if (categories.totalItems)
  //           this.count = categories.totalItems;
  //       }, error: () => {
  //         //this.authRedirect.next(error)
  //       }
  //     })
  // }

  onImageSelection(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      var mimeType = event.target.files[0].type;
      //console.log(mimeType)
      if (!mimeType.match('image.*')) {
        this.toaster.failure('Upload Image only');
        return;
      } else {
        this.addfile = file;
        const formsize: any = new FormData();
        formsize.append('sizechart', this.addfile);
      }
    }
  }
  vendorchange(event: any) {
    // console.log('vendorchange');
    // if (this.data.uuid !== '') {
    //   console.log('vendorchange')
    //   return;
    // } else {
    this.purcaseForm.get('vendor').setValue('');
    // console.log(this.purcaseForm.get('vendor').value);
    // console.log('vendorchange');

    this.changeSubcategory();
    // }
  }
  getDefaultValues() {
    this.formDataProduct.get('vendor_id')?.setValue(this.purcaseForm.get('vendor').value);
    this.formDataProduct.get('brand_id')?.setValue(1);
    this.formDataProduct.get('department_id')?.setValue(this.purcaseForm.get('department').value);
    this.formDataProduct.get('category_id').patchValue(this.purcaseForm.get('category_id').value);
    this.formDataProduct.get('subcategory_id').setValue(this.purcaseForm.get('subcategory_id').value);
    this.formDataProduct.get('group_id').patchValue(this.purcaseForm.get('group_id').value);
    this.purcaseForm.get('paymentterm_id')?.setValue(this.purcaseForm.get('paymentterm_id').value)
    // this.formDataProduct.get('category_id').disable()
    // this.formDataProduct.get('subcategory_id').disable()
    // this.formDataProduct.get('group_id').disable()
  }
  saveProduct() {
    this.formDataProduct.get('image')?.setValue(this.addfile);
    this.formDataProduct.get('department_id')?.setValue(this.purcaseForm.get('department').value);
    this.formDataProduct.get('vendor_id')?.setValue(this.purcaseForm.get('vendor').value);
    this.formDataProduct.get('brand_id')?.setValue(1);
    this.formDataProduct.get('selling_price')?.setValue(0);
    this.submit = true;
    // console.log(
    //   this.purcaseForm,
    //   ' => ',
    //   this.formDataProduct,
    //   ' -> ',
    //   this.purcaseForm.get('category_id').value,
    //   '->',
    //   this.purcaseForm.get('subcategory_id').value
    // );

    if (this.formDataProduct.invalid) {
      //console.log('INVALID', this.formDataProduct.value)
      //this.toaster.failure("please enter all the required fields")
      return;
    } else {
      const formsize: any = new FormData();
      formsize.append('image', this.addfile);
      formsize.append('mrp', this.formDataProduct.get('mrp').value);
      formsize.append('price', this.formDataProduct.get('price').value);

      if (this.isvariant == '') {
        this.varList = { Color: '1', qty: 0, price: 0, vendorproId: '' };
        this.addVariantPoint();
      }
      let inputData = JSON.stringify(this.productForm.get('variant_points').value);
      formsize.append('variant_points', inputData);
      // this.formDataProduct.get('subcategory_id').setValue(this.purcaseForm.get('subcategory_id').value)
      // this.formDataProduct.get('category_id')?.setValue(this.purcaseForm.get('category_id').value);

      // console.log(this.formDataProduct.value, 'Silk process', JSON.stringify(this.productForm.value), inputData);

      this.porderservice.createProduct(this.formDataProduct.value).subscribe({
        next: (resps: any) => {
          let datas: any = resps;
          // if(this.formDataProduct.get('mrp').value > this.formDataProduct.get('price').value){
          //   this.toaster.failure('Please enter the price less than mrp')
          // }else{
          this.porderservice.saveProductImage(formsize, datas.uuid).subscribe({
            next: (resp: any) => {
              // console.log(this.tempPurchaseOrderItems, ' =>', this.purcaseForm.get('itemlist'));
              this.fileName = resp;
              this.toaster.success('Products Created Successfully');

              // this.addField();
              //this.purchaseformval = Object.assign(this.getitemData());
              if (this.tempPurchaseOrderItems == undefined) {
                this.addField();
                // console.log(this.purcaseForm);
              }
              this.venProdlist('', true);
              this.cdr.detectChanges();
              this.modelref.dismiss();
              this.submit = false;
              this.getList = false;
              this.formDataProduct.reset();
              this.getDefaultValues();
            },
            error: (err: any) => {
              if (typeof err == 'string') this.toaster.failure(err);
              else this.toaster.failure(err.error.message);
            }
          });
          // }
        },
        error: (err) => {
          if (typeof err == 'string') this.toaster.failure(err);
          else this.toaster.failure(err.error.message);
        }
      });
    }
    this.cdr.detectChanges();
  }

  checkProductValidation(controlName: string): boolean {
    let ctrl: any = this.formDataProduct.controls[`${controlName}`];
    return this.submit && ctrl.status === 'INVALID';
  }
  productlist(action = '', isNewProductSave = false) {
    let selctvendor: any = this.purcaseForm.get('vendor')?.value;
    // console.log('vendot', selctvendor);
    let catid: any = this.purcaseForm.get('category_id').value;
    let subcatid: any = this.purcaseForm.get('subcategory_id').value;

    // console.log(catid, subcatid);

    let filter_product = this.vendors.filter((a) => a.uid == selctvendor);
    // console.log('filter_prod', filter_product);

    this.newArray = this.vendors.filter(function (el) {
      return el.uid == selctvendor;
    });
    this.purcaseForm.get('paymentterm_id').patchValue(filter_product[0].paymentterm_id);
    // console.log('newarray', this.newArray);
    // this.purcaseForm.get('paymentterm_id')?.setValue(this.newArray[0].paymentterm_id);
    // console.log('filter_product', this.purcaseForm.get('paymentterm_id'), this.newArray);
    // console.log('filter_product', filter_product, this.newArray[0].paymentterm_id);
    // console.log('seler list ->', this.purcaseForm.get('department')?.value);
    let seldepart = this.purcaseForm.get('department')?.value != '' ? this.purcaseForm.get('department')?.value : 3;
    // console.log(seldepart, 'product list ->', selctvendor);
    // console.log('inside pro', selctvendor, seldepart);

    if (selctvendor && seldepart) {
      this.selvendor = this.vendors.find((res) => res.uid == selctvendor) || {};
      // console.log('inside pro', selctvendor, seldepart);
      this.products = [];
      this.variants = [];
      // console.log(catid, subcatid);

      this.porderservice.vendorvarproductlist(selctvendor, seldepart, catid, subcatid).subscribe({
        next: (productdata) => {
          this.products = productdata;
          // console.log('nwq', isNewProductSave);

          if (isNewProductSave) {
            if (
              this.data &&
              this.data.purchaseorderitems &&
              this.tempPurchaseOrderItems &&
              this.data.purchaseorderitems.length < this.tempPurchaseOrderItems.length
            ) {
              // console.log('inside', this.tempPurchaseOrderItems);

              this.data.purchaseorderitems = this.tempPurchaseOrderItems;

              this.data.purchaseorderitems.forEach((val, poindex) => {
                this.changeproductitem(poindex);
                // console.log(this.tempPurchaseOrderItems);
              });
            } else if (this.tempPurchaseOrderItems?.length) {
              this.tempPurchaseOrderItems.forEach((val: any, poindex: any) => {
                this.changeproductitem(this.tempPurchaseOrderItems);
                // console.log(poindex);
              });
            }
            this.cdr.detectChanges();
            return;
          } else {
            this.formData().clear();
          }
          // let variantist: any = [] //this.products[index]['productsmaps'] || []
          // let variantdata: Productvariants[] = []
          if (productdata.length > 0) {
            let fitem: any = {};

            fitem.uuid = [''];
            fitem.product = ['', [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.vendorvariants = [''];
            fitem.name = [''];
            fitem.image = [''];
            fitem.imgpath = [''];
            fitem.qty = [1, [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.price = [0, [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.mrp = [0];
            fitem.discounttype = [0];
            fitem.discount = [0, [Validators.pattern('[0-9]+')]];
            fitem.discountoption = [0];
            fitem.ifigst = [0];
            fitem.cgstpercentage = [0];
            fitem.sgstpercentage = [0];
            fitem.igstpercentage = [0];
            fitem.gst = [0];
            fitem.grandtotal = [0];
            fitem.total = [0];
            fitem.subtotal = [0];
            fitem.discounttotal = 0;

            this.fitem = Object.assign({}, fitem);
            if (this.data && (this.data.purchaseorderitems || this.tempPurchaseOrderItems) && action === '') {
              if (this.tempPurchaseOrderItems && this.data.purchaseorderitems.length < this.tempPurchaseOrderItems.length) {
                this.data.purchaseorderitems = this.tempPurchaseOrderItems;
              }
              this.data.purchaseorderitems.forEach((val, poindex) => {
                this.addField().then(() => {
                  let selproduct = Object.assign({}, this.formData().at(poindex).value);
                  // if(selproduct.product == '6665')
                  //console.log(selproduct)
                  selproduct.uuid = val.uuid;
                  selproduct.product = val.product_id + '' || 0;
                  selproduct.vendorvariants = val.skuid + '--' + val.venvariantmap_id || 0;
                  selproduct.name = selproduct.name + '' || 0;
                  selproduct.image = val.productselectimage_id || 0;
                  selproduct.imgpath = val.productselectimage?.path || '';
                  selproduct.discounttype = val.discounttype || 0;
                  selproduct.discount = val.discount || 0;
                  selproduct.discountoption = val.discountoption || 0;
                  selproduct.qty = val.quantity || 0;
                  selproduct.price = val.price || 0;
                  selproduct.mrp = val.mrp || 0;
                  selproduct.cgstpercentage = val.cgst || 0;
                  selproduct.sgstpercentage = val.sgst || 0;
                  selproduct.igstpercentage = val.igst || 0;
                  selproduct.ifigst = val.ifigst || 0;
                  selproduct.subtotal = val.subtotal || 0;
                  selproduct.total = val.total || 0;
                  selproduct.discounttotal = val.discounttotal || 0;
                  let catid = val.vendorvariantmapping.category_id;
                  let subcatid = val.vendorvariantmapping.subcategory_id;
                  if (val.purchaseitemdetails) {
                    val.purchaseitemdetails.forEach((item) => {
                      let getpovariant = this.variants.find((resvariant) => resvariant.id === item.variant_id);
                      if (getpovariant) {
                        selproduct[getpovariant.id || ''] = item.value_id + '';
                      }
                    });
                  }
                  this.formData().at(poindex).patchValue(selproduct);
                  this.changeproductitem(poindex, 'edit');
                  // console.log(this.tempPurchaseOrderItems);

                  this.catservice.findcatassoc(catid).subscribe({
                    next: (data) => {
                      // this.subcategories = [];
                      // console.log(data);
                      // console.log(this.subcategories);
                      this.getDefaultValues();
                      this.cdr.detectChanges();
                    },
                    error: () => { }
                  });

                  // this.productservice.getcatlist(subcatid).subscribe({
                  //   next: (data) => {
                  //     console.log(data);
                  //     this.subcategories = [];
                  //     // this.subcategories = data.subcategories[0].name;
                  //     console.log(this.subcategories);
                  //     this.cdr.detectChanges();
                  //   },
                  //   error: () => {}
                  // });
                });
                this.purchaseformval = Object.assign(this.getitemData());
              });
            } else {
              this.addField();
              this.purchaseformval = Object.assign(this.getitemData());
            }
          } else {
            let fitem: any = {};

            fitem.uuid = [''];
            fitem.product = ['', [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.vendorvariants = [''];
            fitem.name = [''];
            fitem.image = [''];
            fitem.imgpath = [''];
            fitem.qty = [1, [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.price = [0, [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.mrp = [0];
            fitem.discounttype = [0];
            fitem.discount = [0, [Validators.pattern('[0-9]+')]];
            fitem.discountoption = [0];
            fitem.ifigst = [0];
            fitem.cgstpercentage = [0];
            fitem.sgstpercentage = [0];
            fitem.igstpercentage = [0];
            fitem.gst = [0];
            fitem.grandtotal = [0];
            fitem.total = [0];
            fitem.subtotal = [0];
            fitem.discounttotal = 0;

            this.fitem = Object.assign({}, fitem);
          }
        }
      });
      this.cdr.detectChanges();
    }
  }
  venProdlist(action = '', isNewProductSave = false) {
    let selctvendor: any = this.purcaseForm.get('vendor')?.value;
    let seldepart = this.purcaseForm.get('department')?.value != '' ? this.purcaseForm.get('department')?.value : 3;
    let catid: any = this.purcaseForm.get('category_id').value;
    let subcatid: any = this.purcaseForm.get('subcategory_id').value;
    if (selctvendor) {
      // console.log('inside', selctvendor);
      this.selvendor = this.vendors.find((res) => res.uid == selctvendor) || {};

      this.products = [];
      this.variants = [];
      // this.porderservice.find(uuid).subscribe({
      //   next: (data) => {
      //     this.data = data;
      this.porderservice.vendorvarproductlist(selctvendor, seldepart, catid, subcatid).subscribe({
        next: (productdata) => {
          this.products = productdata;

          // console.log(this.tempPurchaseOrderItems);
          this.data.purchaseorderitems = this.tempPurchaseOrderItems;
          this.data.purchaseorderitems.forEach((val, poindex) => {
            let selproduct: any = Object.assign({}, this.purcaseForm.get('itemlist')?.value[poindex]);
            let prodindex = this.products.findIndex((res) => res.pid + '' === selproduct.product);
            this.variants[poindex] = Object.assign([], this.products[prodindex]['vendorvariantmappings'] || []);
            // console.log(selproduct, ' sel->', prodindex, 'product =>', this.variants);
          });

          if (isNewProductSave) {
            if (
              this.data &&
              this.data.purchaseorderitems &&
              this.tempPurchaseOrderItems &&
              this.data.purchaseorderitems.length < this.tempPurchaseOrderItems.length
            ) {
              this.data.purchaseorderitems = this.tempPurchaseOrderItems;
              this.data.purchaseorderitems.forEach((val, poindex) => {
                this.changeproductitem(poindex);
              });
            } else if (this.tempPurchaseOrderItems?.length) {
              this.tempPurchaseOrderItems.forEach((val: any, poindex: any) => {
                this.changeproductitem(poindex);
              });
            }
            return;
          }
          if (productdata.length > 0) {
            let fitem: any = {};
            fitem.uuid = [''];
            fitem.product = ['', [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.vendorvariants = [''];
            fitem.name = [''];
            fitem.image = [''];
            fitem.imgpath = [''];
            fitem.qty = [1, [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.price = [0, [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.mrp = [0];
            fitem.discounttype = [0];
            fitem.discount = [0, [Validators.pattern('[0-9]+')]];
            fitem.discountoption = [0];
            fitem.ifigst = [0];
            fitem.cgstpercentage = [0];
            fitem.sgstpercentage = [0];
            fitem.igstpercentage = [0];
            fitem.gst = [0];
            fitem.grandtotal = [0];
            fitem.total = [0];
            fitem.subtotal = [0];
            fitem.discounttotal = 0;

            this.fitem = Object.assign({}, fitem);
            if (this.data && (this.data.purchaseorderitems || this.tempPurchaseOrderItems) && action === '') {
              if (this.tempPurchaseOrderItems && this.data.purchaseorderitems.length < this.tempPurchaseOrderItems.length) {
                this.data.purchaseorderitems = this.tempPurchaseOrderItems;
              }
              this.data.purchaseorderitems.forEach((val, poindex) => {
                this.addField().then(() => {
                  let selproduct = Object.assign({}, this.formData().at(poindex).value);
                  // if(selproduct.product == '6665')
                  //console.log(selproduct)
                  selproduct.uuid = val.uuid;
                  selproduct.product = val.product_id + '' || 0;
                  selproduct.vendorvariants = val.skuid + '--' + val.venvariantmap_id || 0;
                  selproduct.name = selproduct.name + '' || 0;
                  selproduct.image = val.productselectimage_id || 0;
                  selproduct.imgpath = val.productselectimage?.path || '';
                  selproduct.discounttype = val.discounttype || 0;
                  selproduct.discount = val.discount || 0;
                  selproduct.discountoption = val.discountoption || 0;
                  selproduct.qty = val.quantity || 0;
                  selproduct.price = val.price || 0;
                  selproduct.mrp = val.mrp || 0;
                  selproduct.cgstpercentage = val.cgst || 0;
                  selproduct.sgstpercentage = val.sgst || 0;
                  selproduct.igstpercentage = val.igst || 0;
                  selproduct.ifigst = val.ifigst || 0;
                  selproduct.subtotal = val.subtotal || 0;
                  selproduct.total = val.total || 0;
                  selproduct.discounttotal = val.discounttotal || 0;
                  if (val.purchaseitemdetails) {
                    val.purchaseitemdetails.forEach((item) => {
                      let getpovariant = this.variants.find((resvariant) => resvariant.id === item.variant_id);
                      if (getpovariant) {
                        selproduct[getpovariant.id || ''] = item.value_id + '';
                      }
                    });
                  }
                  this.formData().at(poindex).patchValue(selproduct);
                  this.changeproductitem(poindex, 'edit');
                });
                this.purchaseformval = Object.assign(this.getitemData());
              });
            } else {
              this.purchaseformval = Object.assign(this.getitemData());
            }
          }
        }
      });
      this.cdr.detectChanges();
    }
  }

  changeproductimage(i: number, poindex: number) {
    let getproduct = this.products[poindex] || {};
    if (getproduct) {
      let setproduct = this.formData().at(i).value;
      setproduct.product = getproduct.pid + '';
      this.formData().at(i).patchValue(setproduct);
      this.changeproductitem(i);
      // console.log(setproduct);
    }
  }

  changevendorvariant(i: number, e: any) {
    let sku = e.target.value.split('--')[0];
    let selectedvariant = this.variants[i].find((x: any) => x.sku == sku);
    let selproduct: any = Object.assign({}, this.purcaseForm.get('itemlist')?.value[i]);
    let prodindex = this.products.findIndex((res) => res.pid + '' === selproduct.product);
    // console.log(prodindex, prodindex >= 0);

    if (prodindex >= 0) {
      if (selectedvariant && selectedvariant.price) {
        selproduct.price = selectedvariant.price;
      }
      if (selectedvariant && selectedvariant.mrp) {
        selproduct.mrp = selectedvariant.mrp;
      }
      if (selectedvariant && selectedvariant.productselectimage_id) {
        selproduct.image = selectedvariant.productselectimage_id;
        selproduct.imgpath = selectedvariant.productselectimage.path;
      }
    }
    this.formData().at(i).patchValue(selproduct);
    // console.log('inside product', this.formData().at(i).patchValue(selproduct));
    return;
  }

  changeproductitem(i: number, etype = '') {
    // console.log(i, this.purcaseForm.get('itemlist')?.value[i]);
    if (this.purcaseForm.get('itemlist')?.value[i].product === undefined) {
      this.formData().push(this.field());
    }

    // console.log(
    //   this.products,
    //   'products',
    //   this.formData(),
    //   this.purcaseForm.get('itemlist'),
    //   this.purcaseForm.get('itemlist')?.value[i].product
    // );

    //let selproduct: any = Object.assign({}, this.products[i])
    let prod = this.products[i];
    let selproduct: any = Object.assign({}, this.purcaseForm.get('itemlist')?.value[i]);
    // console.log(selproduct);


    this.porderservice.getwarehouseTax(this.purcaseForm.get('vendor').value).subscribe({
      next: (res) => {
        this.warehousetaxtype = res
      }
    });


    //let prodindex = 0;
    let prodindex = this.products.findIndex((res) => res.pid + '' === selproduct.product);
    // console.log(
    //   prodindex,
    //   this.products.findIndex((res) => res.pid + '' === selproduct.product)
    // );

    this.variants[i] = Object.assign([], this.products[prodindex]['vendorvariantmappings'] || []);
    // console.log('varient', this.variants[i]);

    //console.log('selproduct', selproduct)

    if (etype != 'edit') {
      selproduct.image = this.variants[i][0].productselectimage_id;
      selproduct.imgpath = this.variants[i][0].productselectimage.path;
      selproduct.vendorvariants = this.variants[i][0].sku + '--' + this.variants[i][0].id || 0;
      selproduct.price = this.variants[i][0].price;
      selproduct.mrp = this.variants[i][0].mrp;
    }
    // this.variants.forEach((val) => {
    //   if (val.id) {
    //     let findex = mapvariantist.findIndex(res => res.id === val.id)
    //     if (findex < 0) {
    //       let vindex: number = +(val.id);
    //       if (vindex in selproduct)
    //         selproduct[vindex] = '-1-'
    //     }
    //   }
    // })
    // this.selproductimages(i)
    if (prodindex >= 0) {
      // if (this.products[prodindex]['productselectimages']) {
      //   let image = this.products[prodindex]['productselectimages'] || []
      //   let seledimage = image.find(res => res.id + '' === selproduct.image + '')
      //   if (seledimage) {
      //     selproduct.image = seledimage.id || '';
      //     selproduct.imgpath = seledimage.path || '';
      //   }
      //   else if (image[0]) {
      //     selproduct.image = image[0].id || '';
      //     selproduct.imgpath = image[0].path || '';
      //   } else {
      //     selproduct.image = '';
      //     selproduct.imgpath = '';
      //   }
      // }
      if (this.products[prodindex]) {
        if (this.products[prodindex]['vendorvariantmappings'] && selproduct.price == 0) {
          let vendormappings = this.products[prodindex]['vendorvariantmappings'] || [];
          if (vendormappings[0] && vendormappings[0]['price']) {
            selproduct.price = vendormappings[0]['price'];
          }
          if (vendormappings[0] && vendormappings[0]['mrp']) {
            selproduct.mrp = vendormappings[0]['mrp'];
          }
        }

        // this.warehousetaxtype== 0 ? this.selvendor.taxtype = 0 : this.selvendor.taxtype = 1



        //selproduct.image = this.products[prodindex]['vendorvariantmappings']
        selproduct.cgstpercentage = 0;
        selproduct.sgstpercentage = 0;
        selproduct.igstpercentage = 0;
        selproduct.ifigst = 0;
        if (this.selvendor.taxtype == 0) {
          let taxperc = 0;
          if (this.products[prodindex]['percentage']) {
            let taxpercvalue = this.products[prodindex]['percentage'] || 0;
            taxperc = this.getFloat(taxpercvalue / 2);
          }
          selproduct.cgstpercentage = taxperc; //this.products[prodindex]['percentage'] || 0;
          selproduct.sgstpercentage = taxperc; // this.products[prodindex]['percentage'] || 0;
        }
        if (this.selvendor.taxtype == 1) {
          selproduct.ifigst = 1;
          selproduct.igstpercentage = this.products[prodindex]['percentage'] || 0;
        }
        selproduct.name = this.products[prodindex] ? this.products[prodindex]['name'] : '';
        //selproduct.ifigst = this.products[prodindex] ? this.products[prodindex]['ifigst'] : 0;
        selproduct.gst = this.products[prodindex]['percentage'];
      }
    }
    // console.log('form =>', selproduct);
    // console.log(selproduct);
    this.tempPurchaseOrderItems = this.formData().value;
    this.formData().at(i).patchValue(selproduct);
    this.cdr.detectChanges();

    return;
  }
  selproductimages(i: number): Productselectimage[] {
    let imagelist: Productselectimage[] = [];
    let prodImg: any = this.getitemData();
    let getproduct: Product = prodImg[i]['product'] || '';
    if (getproduct) {
      let findex = this.products.findIndex((res) => res.pid + '' === getproduct);
      if (findex >= 0) imagelist = this.products[findex]['productselectimages'] || [];
    }
    return imagelist;
  }
  setimage(i: number, image: Productselectimage) {
    let selproduct: any = Object.assign({}, this.purcaseForm.get('itemlist')?.value[i]);
    selproduct.image = image.id;
    selproduct.imgpath = image.path;
    this.formData().at(i).patchValue(selproduct);
  }

  doclist() {
    this.porderservice.documentlist().subscribe({
      next: (data) => {
        this.documentlist = data.filter((x) => x.vendor_id == 0);
        if (this.data.documents != '') {
          let docArray = this.documentlist.filter((r1) => this.docArray.some((r2: any) => r1.id == r2));
          this.docArray = docArray.map((res: any) => res.id);
        }
      }
    });
  }

  paymentermlist() {
    this.porderservice.paymenttermlist().subscribe({
      next: (data) => {
        this.paymentterms = data;
        this.cdr.detectChanges();
      }
    });
  }
  downloadpdf(id: any) {
    this.porderservice.downloadvarpdf(id).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = this.baseurl + this.data.uuid + '.pdf';
        }
      },
      error: (err) => {
        this.toaster.failure('Error while download file : ' + err.error.message);
      }
    });
  }

  //// Save P.O ////
  saveOrder(status: string = 'Draft') {
    if (status !== 'Process') {
      this.currentItem = '0';
    }
    this.submit = true;

    this.purcaseForm.get('potype').setValue('Inventory');

    //this.purcaseForm.get('billing_address').setValue('hello')

    //console.log("status =>", status, " => ", this.purcaseForm, "=>", this.valid)

    let invalid = this.valid.find((i) => i == 1);

    //console.log(invalid)

    if (invalid) {
      this.toaster.failure('Please Enter the Price Less than MRP');
      return;
    }

    if (this.totalval.grandtotal <= 0) {
      //this.toaster.failure('Please ensure that the total is greater than or equal to Zero');
      this.toaster.failure('Please Add Product Items and Enter the Quantity');
      return;
    }

    if (!this.purcaseForm.get('vendor')?.value) {
      if (this.vendors.length == 0) {
        this.toaster.failure('Vendor is not associated with this product');
      } else {
        this.toaster.failure('Select Vendor');
      }
      return;
    }
    // console.log(this.purcaseForm.value);
    // console.log(this.purcaseForm.value.category_id);
    // this.product_catid = this.purcaseForm.value.category_id;
    // console.log(this.purcaseForm.value.subcategory_id);
    // let product_subcatid = this.purcaseForm.value.subcategory_id;
    if (!this.purcaseForm.invalid) {
      this.setState(this.step2, true);
    } else {
      this.setState(this.step2, false);
    }

    let productdata: any = this.purcaseForm.value;

    // productdata.paymentterm_id = productdata.potype == 'SOR' ? 0 : productdata.paymentterm_id;

    productdata.paymentterm_id = productdata.paymentterm_id;
    this.uuid = this.uuid != null && this.uuid != '' ? this.uuid : sessionStorage.getItem('uuid');
    // console.log('save uuid ->', this.uuid);

    if (status === 'Process' || (status === 'Draft' && this.uuid !== null)) {
      let productdata: any = Object.assign({}, this.purcaseForm.value);

      // console.log(this.purcaseForm.value);

      // let productdataitemlist: any = productdata.itemlist || [];

      // productdataitemlist.forEach((item: any, index: number) => {
      //   Object.keys(item).forEach((keyval) => {
      //     if (item[keyval] === '-1-') delete productdataitemlist[index][keyval];
      //   });
      // });

      // productdata.paymentterm_id = productdata.potype == 'SOR' ? 0 : productdata.paymentterm_id;

      productdata.paymentterm_id = productdata.paymentterm_id;

      productdata.uuid =
        this.route.snapshot.paramMap.get('uuid') != null ? this.route.snapshot.paramMap.get('uuid') : sessionStorage.getItem('uuid');

      productdata.status = status;
      // console.log(productdata);
      // // return 1;

      this.porderservice.updatevenvar(productdata).subscribe({
        next: (resp) => {
          //this.toast.success('Order Created Successfully');
          // console.log('inside2');

          let link = sessionStorage.setItem('uuid', resp.uuid);

          this.urlLink = link;

          if (status === 'Process') {
            // this.modalService.open(content, { size: "lg" });
            this.downloadpdf(resp.uuid);
            this.data = {};
            this.toaster.success('PO sent for approval');
            this.purcaseForm.reset();

            sessionStorage.removeItem('uuid');

            this.router.navigate(['/po/view/' + resp.uuid]);
          } else {
            this.currentItem = resp.uuid;
            // console.log(this.currentItem);
          }
          this.tempPurchaseOrderItems = null;
          this.cdr.detectChanges();

          // this.router.navigate(['/app/view/' + resp.uuid]);
        },
        error: (err) => {
          //console.log(err.error.message);
        }
      });
    } else {
      let productdata: any = Object.assign({}, this.purcaseForm.value);

      // console.log(this.purcaseForm.value);

      let productdataitemlist: any = productdata.itemlist || [];

      productdataitemlist.forEach((item: any, index: number) => {
        Object.keys(item).forEach((keyval) => {
          if (item[keyval] === '-1-') delete productdataitemlist[index][keyval];
        });
      });

      productdata.itemlist = productdataitemlist;

      productdata.status = 'Draft';

      let prodservice: any;
      // console.log(productdata, '=> productdata');

      if (status === 'Draft') {
        prodservice = this.porderservice.createvendorvarpo(productdata);
        // console.log('inside1', productdata);

        // this.toaster.success("asdja")
      } else {
        productdata.uuid = sessionStorage.getItem('uuid');
        prodservice = this.porderservice.updatevenvar(productdata);
        this.toaster.success('Your PO Send for Draft');
        this.router.navigate(['/po/po']);
        // console.log(productdata);
      }

      prodservice.subscribe({
        next: (resp: { uuid: string }) => {
          sessionStorage.setItem('uuid', resp.uuid);

          this.currentItem = resp.uuid;

          // this.toaster.success('Order Created Successfully');

          if (status === 'Drafts') {
            // this.modalService.open(content, { size: "lg" });
            // this.toaster.success('Order Created Successfully');

            this.data = {};

            this.purcaseForm.reset();

            sessionStorage.removeItem('uuid');
          }

          this.cdr.detectChanges();
        },
        error: (err: { error: { message: any } }) => {
          //console.log(err.error.message);
        }
      });
    }
  }

  //// Sum Total ///
  valchange(event: any, i: number) {
    if (!Number(event.target.value) && event.target.value != 0) {
      event.target.value = '';
    } else event.target.value = event.target.value;
  }
  getFloat(x: any) {
    let xyz = parseInt(x) === x ? x : parseFloat(x).toFixed(2);
    return Number(xyz);
  }
  getRound(x: any) {
    let xyz = parseFloat(x);
    return Math.round(xyz);
  }
  changeDiscount(event: any) {
    if (!Number(event.target.value)) event.target.value = 0;
    else event.target.value = event.target.value;
  }

  savegst() { }
  viewgst(content: any): void {
    const modelref = this.modalService.open(content, { size: 'md' });
  }

  changeDate(event: any) {
    this.expminDate = event.target.value;
    this.datehint = true;
  }

  download() {
    let selctvendor = this.purcaseForm.get('vendor')?.value;
    let seldepart = this.purcaseForm.get('department')?.value;
    this.porderservice.downloadvenvar(seldepart, selctvendor).subscribe({
      next: (resp) => {
        if (resp.message == 'Success') {
          let link = document.createElement('a');
          link.setAttribute('type', 'hidden');
          link.href = this.baseurl + '/vendorproducts.xlsx';
          link.target = '_self';
          //link.download = path;
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      },
      error: (err) => {
        //console.log("Error while download file : " + err.error.message);
      }
    });
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      var mimeType = event.target.files[0].type;
      this.fileName = file.name;

      let image = event.target.files[0];
      // console.log(`Image size before compressed: ${image.size} bytes.`);

      this.compressImage
        .compress(image)
        .pipe(take(1))
        .subscribe((compressedImage) => {
          image = compressedImage;
          // console.log(`Image size after compressed: ${compressedImage.size} bytes.`);
          // now you can do upload the compressed image
        });

      if (!mimeType.match('image.*')) {
        this.toaster.failure('Upload Image only');
        return;
      } else {
        this.addfile = file;
        const formsize: any = new FormData();
        formsize.append('image', image);
        // console.log(image, image.size);

        // this.porderservice.saveProductImage(formsize).subscribe({
        //   next: (resp: any) => {
        //     this.fileName = resp;
        //     this.toaster.success('Successfully Updated');
        //   }, error: (err: any) => {
        //     if (typeof err == 'string') this.toaster.failure(err);
        //     else this.toaster.failure(err.error.message);
        //   }
        // });
      }
    }

    /*  if (event.target.files.length > 0) {
       const file = event.target.files[0];
       this.addfile = file
       let selctvendor = this.purcaseForm.get('vendor')?.value;
       let seldepart = this.purcaseForm.get('department')?.value;
       const formd: any = new FormData();
       formd.append('image', this.addfile);
 
     } */
  }

  typechange(event: any) {
    if (event.name == 'SOR') {
      this.payment = false;
      this.purcaseForm.get('paymentterm_id')?.clearValidators();
      this.purcaseForm.get('paymentterm_id')?.updateValueAndValidity();
    } else {
      this.payment = true;
      this.purcaseForm.get('paymentterm_id')?.setValidators(Validators.required);
      this.purcaseForm.get('paymentterm_id')?.updateValueAndValidity;
    }
  }

  getItems(i: any) {
    return this.purcaseForm.value['itemlist'][i];
  }

  addReason(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  addVendor(content: any) {
    // this.modelref = this.modalService.open(content, { size: 'lg' });
    this.modalService.open(content, { size: 'lg' });
  }

  stepChange(step: any, num: any = 1) {
    let valid1 =
      this.purcaseForm.get('vendor').value != '' &&
        this.purcaseForm.get('billingaddress_id').value != '' &&
        this.purcaseForm.get('warehouse_id').value != '' &&
        this.purcaseForm.get('deliverydate').value != '' &&
        this.purcaseForm.get('date').value != '' &&
        this.purcaseForm.get('purchaseid').value != '' &&
        this.purcaseForm.get('paymentterm_id').value != '' &&
        this.purcaseForm.get('potrasnporter_id').value != '' &&
        this.purcaseForm.get('state_id').value != '' &&
        this.purcaseForm.get('category_id').value != '' &&
        this.purcaseForm.get('subcategory_id').value != '' &&
        this.purcaseForm.get('group_id').value != ('' || undefined) &&
        this.purcaseForm.get('date').value <= this.purcaseForm.get('deliverydate').value
        ? true
        : false;
    // console.log(valid1, this.purcaseForm.get('vendor').value);
    // console.log(this.purcaseForm.get('billingaddress_id').value);
    // console.log(this.purcaseForm.get('warehouse_id').value);
    // console.log(this.purcaseForm.get('deliverydate').value);
    // console.log(this.purcaseForm.get('date').value);
    // console.log(this.purcaseForm.get('category_id').value);
    // console.log(this.purcaseForm.get('subcategory_id').value, this.purcaseForm.get('group_id').value);
    let purcaseForm_subcatid = this.purcaseForm.get('subcategory_id').value;
    // console.log(purcaseForm_subcatid);
    // console.log(this.subcategories);

    let product_catid = this.purcaseForm.get('category_id').value;
    let product_subcatid = this.purcaseForm.get('subcategory_id').value;
    // console.log(product_catid, product_subcatid, this.subcategories);
    this.formDataProduct.get('category_id').patchValue(this.purcaseForm.get('category_id').value);
    //this.formDataProduct.get('category_id').disable();
    this.formDataProduct.get('subcategory_id').patchValue(this.purcaseForm.get('subcategory_id').value);

    //this.formDataProduct.get('subcategory_id').disable();
    // console.log(this.formDataProduct.get('subcategory_id'));
    if (valid1 === true) {

      this.setState(this.step1, valid1);
    } else {
      if (this.purcaseForm.get('deliverydate').value < this.purcaseForm.get('date').value) {
        this.toaster.failure('Please Enter Valid Date');
      } else {
        this.toaster.failure('Please Enter All the Required Fields');
      }
    }
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.productlist('', false);
    }

    // console.log(step, '=>', this.purcaseForm.get('vendor'), this.purchaseformval);
  }
  setState(control: FormControl, state: boolean) {
    if (!state) {
      control.setErrors({ required: true });
    } else {
      control.reset();
      this.stepper.next();
      this.gobackstep()
    }
  }
  gobackstep() {
    this.purcaseForm.get('paymentterm_id')?.setValue(this.purcaseForm.get('paymentterm_id').value)
    // console.log('this.getDefaultValues', this.purcaseForm.get('paymentterm_id').value, this.payementtermValue);
  }
  async billingList(data: any = '') {
    let billing = 0;
    if (data.target === undefined) {
      billing = data;
    } else {
      billing = data.target.value;
    }
    // console.log('billing ->', billing, this.warehouses);
    if (this.warehouses.length > 0) {
      let address = this.warehouses.filter((e: any) => {
        return Number(billing) === e.id;
      });
      this.billingAddress = address[0].billingaddress;
    }

    // console.log(this.billingAddress);
    this.cdr.detectChanges();
  }

  refreshList(type: any): void {
    if (type == 'cancel') {
      this.modalService.dismissAll();
    } else {
      if (type == 'refresh') this.modalService.dismissAll();
    }
  }

  getSelectvalues() {
    let did = '3';
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (did) {
      this.productservice.getlistall(did).subscribe({
        next: (data) => {
          this.categories = data.categories;
          this.subcategories = data.subcategories;
          // console.log('cata', this.categories);
          // console.log(this.subcategories);
          this.cdr.detectChanges();
        },
        error: () => { }
      });
      if (uuid) {
        this.purcaseForm.get('category_id')?.setValue(this.data.category_id),
          this.purcaseForm.get('subcategory_id')?.setValue(this.data.subcategory_id);
      }
      this.groupService.findall().subscribe({
        next: (resp) => {
          this.groups = resp;
          // console.log(this.groups);
          this.purcaseForm.get('group_id')?.setValue(this.data.group_id);
        }
      });
      this.formDataProduct.get('subcategory_id').setValue(this.purcaseForm.get('subcategory_id').value);
      // console.log('grp', this.formDataProduct.get('subcategory_id').value, this.purcaseForm.get('subcategory_id').value);
    }
  }

  purchaseidfind(event: Event) {
    // console.log(this.purcaseForm.get('purchaseid').value != this.user.uuid, this.purcaseForm.get('purchaseid').value, this.user.id);
    if (this.purcaseForm.get('purchaseid').value != this.user.id) {
      this.toaster.info("You're choosing different Purchaser");
    }
  }

  paymentterm(data: any = '') {
    let paymentterm_id = 0;
    if (data.target === undefined) {
      paymentterm_id = data;
    } else {
      paymentterm_id = data.target.value;
    }
    // console.log('1', this.purcaseForm.get('paymentterm_id').value, paymentterm_id);
    let val = this.purcaseForm.get('paymentterm_id').value;
    if (val != this.newArray[0].paymentterm_id) {
      this.toaster.info("You're choosing different Payment term");
    }
  }
  getSubclass(data: any = '') {
    let category_id = [];
    if (data.target === undefined) {
      category_id = data;
    } else {
      category_id = data.target.value;
    }
    // console.log(typeof category_id, category_id);
    let did = this.purcaseForm.get('category_id').value;

    if (category_id) {
      this.productservice.getcatlist(did).subscribe({
        next: (data) => {
          this.subcategories = data.subcategories;
          // console.log(this.subcategories, data);

          this.cdr.detectChanges();
        },
        error: () => { }
      });
    }
  }

  viewEdit(content: any, i: any): void {
    let selproduct: any = Object.assign({}, this.purcaseForm.get('itemlist')?.value[i]);
    // console.log(this.products);
    // console.log(selproduct.product);
    let sel_product = Number(selproduct.product);
    // let products = this.products;
    let filter_product = this.products.filter((data) => data.pid == sel_product);
    // console.log(i, selproduct, filter_product);
    // console.log(filter_product[0].uuid);
    this.productservice.findp(filter_product[0].uuid).subscribe({
      next: (data) => {
        // console.log(data);
        // console.log(data.group.category.name);
        // console.log(data.group.subcategory.name);
        // console.log('desc=>', data.description);
        this.scdata = data.group.subcategory.name;
        this.cdata = data.group.category.name;
        this.desc = data.description;
      }
    });
    // console.log(filter_product[0].category_id)
    // let filter_catid = Number(filter_product[0].category_id);
    // let filter_subcatid = filter_product[0].subcategory_id;
    // let filter_des = filter_product[0].description;
    // console.log(filter_catid, filter_subcatid, filter_des)

    // this.productservice.getlistall('3').subscribe({
    //   next: (data) => {
    //     this.categories = data.categories;
    //     console.log(this.categories)
    //     let filter_data = this.categories.filter((data) => data.cid == filter_catid)
    //     console.log(filter_data);
    //     this.cdata = filter_data[0].name;
    //     console.log(this.cdata);
    //     let filt_catid: any = filter_data;
    //     this.subcategories = data.subcategories;
    //     console.log(this.subcategories);
    //     let filter_sdata = this.subcategories.filter((data) => data.name == filt_catid)
    //     console.log(filter_sdata);
    //     this.cdr.detectChanges();
    //   },
    //   error: () => { }
    // });

    // this.productservice.getcatlist(filter_catid).subscribe({
    //   next: (data) => {
    //     console.log(data);
    //     console.log(data.subcategories[0].name);
    //     this.scdata = data.subcategories[0].name;
    //     // this.subcategories = [];
    //     // this.subcategories = data.subcategories[0].name;
    //     console.log(this.subcategories);
    //     this.cdr.detectChanges();
    //   },
    //   error: () => { }
    // });

    const modelref = this.modelservice.open(content, { size: 'md' });
  }

  variant_function(value: any) {
    this.max_count = this.formDataProduct.get('mrp').value;
    const control = <FormArray>this.productForm.controls['variant_points'];
    while (control.length > 0) {
      control.removeAt(0);
    }
    this.isvariant = value;
    if (value === 'yes') {
      // console.log(value);

      this.getList = true;
      this.vlist();
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
      this.varList = { Color: '1', qty: 0, price: 0, vendorproId: '' };
      // console.log(value, this.productForm, this.varList);
      this.addVariantPoint();
      //document.getElementById('variant_details').style.display = 'none';
      this.getList = false;
    }
  }

  get variantPoints() {
    return this.productForm.get('variant_points') as FormArray;
  }
  addVariantPoint() {
    this.variantPoints.push(this.fb.group(this.varList));
    // console.log(this.variantPoints);
  }

  setPoints(variant_points: []): FormArray {
    // console.log(variant_points);
    const formArray = new FormArray([]);
    variant_points.forEach((point) => {
      formArray.push(this.fb.group({ point: point }));
    });
    return formArray;
  }

  deleteVariantPoint(index: any) {
    this.variantPoints.removeAt(index);
  }

  async vlist() {
    this.valuelist = [];
    let params = this.getRequestParams(
      this.purcaseForm.get('department').value,
      this.purcaseForm.get('category_id').value,
      this.purcaseForm.get('subcategory_id').value
    );

    // await this.productvariantsservice.getAllVariants(params).subscribe({
    //   next: (productvariants:any) => {
    //     let variant=productvariants.data
    //     this.variantlist = variant?.rows;
    //     console.log(productvariants,this.productvariants);
    //   }, error: error => {
    //     //this.authRedirect.next(error)
    //   }
    // })

    await this.productvariantsservice.getvariantlist(this.purcaseForm.get('subcategory_id').value).subscribe({
      next: (productvariants: any) => {
        //let variant=productvariants.data;
        this.variantlist = productvariants;
        let tempData: any = { price: 0, qty: 0, vendorproId: '' };
        let i = 0;
        for (var index in productvariants) {
          tempData[productvariants[index].name] = 0;
          i++;
        }
        tempData = { ...tempData, price: 0, qty: 0, vendorproId: '' };
        this.varList = tempData;
        this.cdr.detectChanges();
        this.addVariantPoint();
        // console.log(productvariants, this.productvariants);
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
  }

  changeVariant(e: any) {
    this.valuelist = [];
    // console.log(e);
    let id = e.target.value;
    let filter = this.variantlist.findIndex((val: any) => val.id == id);
    // console.log(filter);
    this.valuelist = this.variantlist[filter].productvariantvalues;
  }
  getPath(e: any, content: any, i: any = null) {
    let type = 'Single';
    this.showsingleimg = type == 'Single' ? true : false;
    // console.log(e, this.getitemData()[i]);
    this.editImage = e;
    this.index = i;
    const modelref = this.modalService.open(content, { size: 'xl' });
    this.porderservice.getImageAll(e.product).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        this.images = resp.data;
      },
      error: (err) => {
        this.toaster.failure(err);
      }
    });
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.uploadFiles();

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }

      //setTimeout(this.uploadFiles, 1000)
    }
  }

  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 10, fileName: file.name, color: 'blue' };

    if (file) {
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        let image = file;
        let cimage;
        const filesize = image.size / 1024 / 1024;
        // console.log(`Image size before compressed: ${image.size} bytes.`);

        this.compressImage.compress(image).pipe(take(1))
          .subscribe((compressedImage) => {
            cimage = compressedImage;
            // console.log(compressedImage);
            // console.log(`Image size after compressed: ${compressedImage.size} bytes.`);
            // now you can do upload the compressed image
          });
        // console.log('cimage', cimage);

        //const ratio = ((Number(img.width) / Number(img.height)) + '').slice(0, 3)
        if (filesize > 2) {
          this.progressInfos[idx].msg = 'File not upload.. Please upload below 2 MB file';
          this.progressInfos[idx].color = 'red';
          this.progressInfos[idx].value = 100;
          return;
        }
        // else if (Number(img.width) < 800) {
        //   this.toast.failure('Please upload the image of minimum width 800px');
        //   this.progressInfos[idx].color = 'red';
        //   this.progressInfos[idx].value = 100;
        //   return;
        // }
        // else if (ratio !== '0.6') {
        //   this.progressInfos[idx].msg = 'File not upload.. Image ratio mismatch..'
        //   this.progressInfos[idx].color = 'red';
        //   this.progressInfos[idx].value = 100;
        //   return;
        // }
        else {
          this.progressInfos[idx].value = 50;
          const formd: any = new FormData();
          formd.append('image', image);
          // console.log(image);
          this.porderservice.saveGallery(this.editImage.product, formd).subscribe({
            next: (resp) => {
              this.progressInfos[idx].msg = 'Successfully Upload';
              this.progressInfos[idx].color = 'green';
              this.progressInfos[idx].value = 100;
              this.images.push(resp);
              //this.cdr.detectChanges();
              //this.toast.success('Successfully Updated');
            },
            error: (err) => {
              this.toaster.failure(err);
            },
            complete: () => {
              setTimeout(() => {
                this.progressInfos = [];
              }, 3000);
            }
          });
        }
      };
    }
    setTimeout(() => {
      this.progressInfos = [];
    }, 3000);
  }

  selectimage(i: number) {
    this.images[i].select = false;
    let pageindex = 0;
    if (this.page > 0) {
      pageindex = this.page - 1 * (this.page > 1 ? this.pageSize : 0) + i;
    }

    this.selectedimages = [];
    if (this.images[i]) {
      let selimg = this.images[i];
      this.canproceed(i, selimg);
      // console.log(this.selectedimages);

      // let indexval = this.selectedimages.findIndex((res) => res.id === selimg.id);
      // //console.log(indexval);
      // if (indexval >= 0) {
      //   delete selimg.select;
      //   this.selectedimages.splice(indexval, 1);
      // } else {
      //   selimg.select = true;
      //   this.selectedimages.push(selimg);
      // }
      //console.log(this.selectedimages);
    }
  }
  defimage = '';
  canproceed(i: number, selimg: any) {
    if (this.showsingleimg === true) {
      this.defimage = selimg.path || '';
      this.images.map((imgres) => {
        Object.assign(imgres, { select: false });
      });
      this.images[i]['select'] = this.images[i]['select'] === true ? false : true;
    } else {
      this.images[i]['select'] = this.images[i]['select'] === true ? false : true;
    }
    let indexval = this.selectedimages.findIndex((res) => res.id === selimg.id);
    // console.log(indexval);
    if (indexval >= 0) {
      delete selimg.select;
      this.selectedimages.splice(indexval, 1);
    } else {
      selimg.select = true;
      this.selectedimages.push(selimg);
      // console.log(this.selectedimages);
    }
    // console.log(this.selectedimages, ' => ', this.images[i]);
  }

  submitImage() {
    // console.log(this.selectedimages, ' => ', this.editImage, this.getitemData());
    const myArray = this.editImage.vendorvariants.split('--');
    let datas: any = this.selectedimages[0];
    datas.variant = myArray[0];
    datas.uuid = this.editImage.uuid;
    // console.log(datas, datas.variant, this.editImage.uuid);
    let selitem: any = Object.assign({}, this.purcaseForm.get('itemlist')?.value[this.index]);
    this.porderservice.setImage(datas).subscribe({
      next: (resp: any) => {
        // console.log(
        //   this.purcaseForm.get('itemlist')?.value,
        //   ' => ',
        //   this.variants[this.index],
        //   this.index,
        //   this.getitemData(),
        //   this.variants
        // );
        // this.getitemData().map((e:any)=>{
        //   console.log(selitem,'all ->',e,this.selectedimages)
        //   if (e.uuid==this.editImage.uuid) {
        //     console.log('ifedit ->',e)
        //     e.image=datas.id;
        //     e.imgpath=datas.path
        //     selitem.image=datas.id
        //     selitem.imgpath=datas.path
        //   }
        //   else if (e.sku==datas.variant && e.product_id==resp.product_id) {
        //     console.log('else ->',e)
        //     e.image=datas.id;
        //     e.imgpath=datas.path
        //     selitem.image=datas.id
        //     selitem.imgpath=datas.path
        //   }
        //   return e;
        // })
        this.variants[this.index].map((e: any) => {
          // console.log(e, e.uuid, this.editImage.uuid, resp, datas);
          if (e.sku == datas.variant && e.product_id == datas.product_id) {
            // console.log(e);
            if (resp != null) {
              datas.id = resp.productselectimage_id;
              e.productselectimage = datas;
              e.productselectimage_id = resp.productselectimage_id;
            }

            // console.log('selitem ->', selitem, ' -> ', e);
            this.getitemData().map((e: any) => {
              // console.log(selitem, 'all ->', e, this.selectedimages);
              let str = e.vendorvariants.split('--');
              // if (e.uuid==this.editImage.uuid) {
              //   console.log('ifedit ->',e)
              //   e.image=datas.id;
              //   e.imgpath=datas.path
              //   selitem.image=datas.id
              //   selitem.imgpath=datas.path
              // }
              if (resp && str[0] == datas.variant && e.product == resp.product_id) {
                // console.log('else ->', e);
                // console.log(str[0], ' -> ', datas.variant);
                e.image = datas.id;
                e.imgpath = datas.path;
                selitem.image = datas.id;
                selitem.imgpath = datas.path;
              }
              // console.log(str[0], ' -> ', datas.variant, e.product_id, ' @@ ', resp.product_id);
              return e;
            });
          }
          return e;
        });
        // console.log(this.variants, ' => ', this.purcaseForm.value);
        this.formData().at(this.index).patchValue(selitem)
        this.cdr.detectChanges();
        this.modalService.dismissAll();
      },
      error: (err) => {
        this.toaster.failure(err);
      }
    });
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.list();
  }
  popupclose() {
    this.modalService.dismissAll();
  }
}