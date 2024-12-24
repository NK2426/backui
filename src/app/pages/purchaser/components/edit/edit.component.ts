import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Documents } from 'src/app/pages/purchaser/models/documents';
import { Product, Productmapparam, Productselectimage } from 'src/app/pages/purchaser/models/product';
import { Department, Paymentterm, Purchaseorder, Vendor, Warehouse } from 'src/app/pages/purchaser/models/purchaseorder';
import { EnvService } from 'src/app/_helpers/env.service';
import { environment } from 'src/environments/environment';
import { PurchaseorderService } from '../../services/purchaseorder.service';
// import { UtilsService } from 'src/app/_helpers/utils.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  submit: boolean = false;
  breadCrumbItems: Array<{}> = [];
  departments: Department[] = [];
  products: Product[] = [];
  vendors: Vendor[] = [];
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
  baseurl: any = '';
  documentlist: Documents[] = [];
  gsubmit = false;
  symbol = '';
  valid = [{}];
  disvalid = true;
  distypevalid = true;
  totalvalid = true;
  docArray: any = [];
  state = '';
  mappedvaiants: any = {};
  setvalue = '-1-';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private porderservice: PurchaseorderService,
    private fb: FormBuilder,
    private env: EnvService,
    private modalService: NgbModal,
    private datepipe: DatePipe // private toast: ToastService
  ) {}

  purcaseForm: FormGroup;

  potypes: Array<{ name: string }> = [{ name: 'Inventory' }, { name: 'SOR' }];
  paymentterms: Paymentterm[] = [];
  purchaseformval: any | undefined = [];
  totalval = { subtotal: 0, totaldiscount: 0, total: 0, cgsttotal: 0, sgsttotal: 0, igsttotal: 0, grandtotal: 0 };

  minDate: any = '';
  expminDate: any = '';
  payment = false;
  warehouses: Warehouse[] = [];

  ngOnInit(): void {
    this.baseurl = environment.PDF_BASE_URL;
    this.purcaseForm = this.fb.group({
      uuid: [''],
      department: [''],
      //product: [''],
      category_id: [''],
      subcategory_id: [''],
      vendor: [''],
      warehouse_id: [''],
      //discountype: [''],
      //discount: ['', [Validators.pattern('[0-9]+')]],
      date: [''],
      deliverydate: [''],
      paymentterm_id: [''],
      potype: [''],
      notes: [''],
      documents: [''],
      itemlist: this.fb.array([])
    });

    this.minDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.expminDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

    this.state = history.state.clone || '';

    this.baseurl = this.env.httpOptionsparams;
    ///// Edit P.O
    let uuid = this.route.snapshot.paramMap.get('uuid');
    let puid = history.state.puid;
    //console.log(uuid);

    this.porderservice.getWarehouses().subscribe({
      next: (data) => {
        this.warehouses = data;
      }
    });

    if (uuid) {
      this.porderservice.find(uuid).subscribe({
        next: (data) => {
          this.data = data;
          //console.log(data);
          if (this.state == '' && this.data.status != 'Draft' && this.data.status != 'Revise' && this.data.status != 'Vendor_revise') {
            this.router.navigate(['/po/view/' + this.data.uuid]);
          }
          this.purcaseForm.get('category_id').setValue(this.data.category_id || '');
          this.purcaseForm.get('subcategory_id').setValue(this.data.subcategory_id || '');
          this.purcaseForm.get('date')?.setValue(this.data.date || '');
          this.purcaseForm.get('deliverydate')?.setValue(this.data.deliverydate || '');
          // this.purcaseForm.get('paymentterm_id')?.setValue(this.data.paymentterm_id || 0);
          // this.purcaseForm.get('warehouse_id')?.setValue(this.data.warehouse_id || 0);
          this.purcaseForm.get('potype')?.setValue(this.data.potype || '');
          this.purcaseForm.get('notes')?.setValue(this.data.notes || '');
          this.purcaseForm.get('documents')?.setValue(this.data.documents || '');
          // this.purcaseForm.get('vendor')?.setValue(this.data.vendor_id);
          this.docArray = this.data?.documents != '' ? this.data?.documents?.split(',') : [];
          //console.log(this.purcaseForm);

          if (data.product && data.product.productselectimages) {
            this.productimages = data.product.productselectimages;
          }
        },
        complete: () => {
          this.departmentlist();
        },
        error: () => {}
      });
    } else if (puid && !uuid) {
      /// From Product ////
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
          this.departmentlist();
        },
        error: () => {}
      });
    } else {
      this.departmentlist();
    }
    this.doclist();
    this.paymentermlist();

    this.purcaseForm.valueChanges.subscribe((formdata: any) => {
      this.totalval = { subtotal: 0, totaldiscount: 0, total: 0, cgsttotal: 0, sgsttotal: 0, igsttotal: 0, grandtotal: 0 };
      if (formdata.itemlist) {
        formdata.itemlist.forEach((selitem: any, i: number) => {
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
          ////console.log(selitem)
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
      }
    });
    //console.log("purcaseform =>", this.purcaseForm)
  }

  checkvalue(i: number) {
    let selitem: any = Object.assign({}, this.purcaseForm.get('itemlist')?.value[i]);
    if (selitem.product) {
      if (parseFloat(selitem.price) > parseFloat(selitem.mrp)) {
        // this.toast.failure('Please enter the price less than mrp');
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
    let val: any | undefined;
    val = this.purcaseForm.get('itemlist')?.value;

    return val;
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
          let department: any = this.data.department_id;
          this.purcaseForm.get('department')?.setValue(department);
          this.changeDepartment();
        }
      }
    });
  }
  changeDepartment(action = '') {
    let seldepart = this.purcaseForm.get('department')?.value;
    if (seldepart) {
      this.purcaseForm.get('vendor')?.setValue('');
      this.clearAll();

      this.products = [];
      this.vendors = [];
      this.variants = [];
      this.selproductid = '';

      this.porderservice.allvendor(seldepart).subscribe({
        next: (data) => {
          this.vendors = data;
          if (this.data && this.data.vendor_id && action === '') {
            this.purcaseForm.get('vendor')?.setValue(this.data.vendor_id);
            this.productlist();
          }
        }
      });
    }
  }
  productlist(action = '') {
    this.formData().clear();
    let selctvendor = this.purcaseForm.get('vendor')?.value;
    let seldepart: any = this.purcaseForm.get('department')?.value;
    let catid = this.purcaseForm.get('category_id').value;
    let subcatid = this.purcaseForm.get('subcategory_id').value;
    if (selctvendor) {
      this.selvendor = this.vendors.find((res) => res.uid == selctvendor) || {};

      // this.selvendor = this.vendors.find(res => res.uid == selctvendor) || {}

      this.products = [];
      this.variants = [];

      this.porderservice.vendorvarproductlist(selctvendor, seldepart,catid,subcatid).subscribe({
        next: (productdata) => {
          this.products = productdata;
          // let variantist: any = [] //this.products[index]['productsmaps'] || []
          // let variantdata: Productvariants[] = []
          if (productdata.length > 0) {
            let fitem: any = {};
            // productdata.forEach((findvariantdata) => {

            //   let productsmaps = findvariantdata['productvariants'] || [];
            //   productsmaps.forEach((val: any) => {
            //     if (val.id) {
            //       let checkvariant = variantdata.findIndex(res => res.id === val.id)

            //       if (checkvariant < 0 && val.productvariantvalues.length > 0) {
            //         fitem[val.id + ''] = ['', [Validators.required]];

            //         let vaiantvalue = (val.productvariantvalues || []).sort((a: any, b: any) => {
            //           return parseInt(a.ordering) - parseInt(b.ordering);
            //         })

            //         variantdata.push({ id: val.id, name: val.name, productvariantvalues: vaiantvalue })
            //       }
            //       let pid = findvariantdata.pid || 0;
            //       if (!this.mappedvaiants[pid])
            //         this.mappedvaiants[pid] = {}
            //       this.mappedvaiants[pid][val.id] = true;
            //     }
            //     //this.variants = variantdata;
            //   })

            // })

            fitem.uuid = [''];
            fitem.product = ['', [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.vendorvariants = ['', [Validators.required]];
            fitem.name = [''];
            fitem.image = [''];
            fitem.imgpath = [''];
            fitem.qty = [0, [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.price = [0, [Validators.pattern('[0-9]+'), Validators.required]];
            fitem.mrp = [0];
            fitem.discounttype = [0];
            fitem.discount = [0, [Validators.pattern('[0-9]+')]];
            fitem.discountoption = [0];
            fitem.ifigst = [0];
            fitem.cgstpercentage = [0];
            fitem.sgstpercentage = [0];
            fitem.igstpercentage = [0];

            this.fitem = Object.assign({}, fitem);
            if (this.data && this.data.purchaseorderitems && action === '') {
              this.data.purchaseorderitems.forEach((val, poindex) => {
                this.addField().then(() => {
                  let selproduct = Object.assign({}, this.formData().at(poindex).value);
                  // if(selproduct.product == '6665')
                  //console.log(selproduct);
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
              this.addField();
              this.purchaseformval = Object.assign(this.getitemData());
            }
          }
        }
      });
    }
  }

  changeproductimage(i: number, poindex: number) {
    let getproduct = this.products[poindex] || {};
    if (getproduct) {
      let setproduct = this.formData().at(i).value;
      setproduct.product = getproduct.pid + '';
      this.formData().at(i).patchValue(setproduct);
      this.changeproductitem(i);
    }
  }

  changevendorvariant(i: number, e: any) {
    let sku = e.target.value.split('--')[0];
    let selectedvariant = this.variants[i].find((x: any) => x.sku == sku);
    let selproduct: any = Object.assign({}, this.purcaseForm.get('itemlist')?.value[i]);
    let prodindex = this.products.findIndex((res) => res.pid + '' === selproduct.product);
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
    return;
  }

  changeproductitem(i: number, etype = '') {
    let selproduct: any = Object.assign({}, this.purcaseForm.get('itemlist')?.value[i]);

    let prodindex = this.products.findIndex((res) => res.pid + '' === selproduct.product);

    this.variants[i] = Object.assign([], this.products[prodindex]['vendorvariantmappings'] || []);

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
      }
    }
    this.formData().at(i).patchValue(selproduct);
    return;
  }
  selproductimages(i: number): Productselectimage[] {
    let imagelist: Productselectimage[] = [];
    let getproduct: Product = this.getitemData()[i]['product'] || '';
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
      }
    });
  }
  //// Save P.O ////
  saveOrder(status: string = 'Draft') {
    this.submit = true;

    if (this.purcaseForm.invalid) {
      // this.toast.failure('Please enter the appropriate value in the form and item list');
      //console.log(this.purcaseForm);
      return;
    }
    let invalid = this.valid.find((i) => i == 1);
    //console.log(invalid);
    if (invalid) {
      // this.toast.failure('Please enter the price less than mrp');
      return;
    }
    if (this.totalval.grandtotal <= 0) {
      // this.toast.failure('Please ensure that the total is greater than or equal to Zero');
      return;
    }
    // if (!this.purcaseForm.get('vendor')?.value) {
    // if (this.vendors.length == 0)
    // this.toast.failure('Vendor is not associated with this product');
    // else
    //   this.toast.failure('Select Vendor');
    // return;
    // }

    if (this.data && this.data.uuid != null) {
      let productdata: any = this.purcaseForm.value;
      productdata.paymentterm_id = productdata.potype == 'SOR' ? 0 : productdata.paymentterm_id;
      ////console.log(productdata)
      if (this.state == 'clone') {
        productdata.id = '';
        productdata.uuid = '';
        productdata.status = 'Draft';
        //console.log(productdata);
        this.porderservice.createvendorvarpo(productdata).subscribe({
          next: (resp) => {
            // this.toast.success('Order Created Successfully');
            this.data = {};
            this.purcaseForm.reset();
            this.router.navigate(['/app/view/' + resp.uuid]);
          },
          error: (err) => {
            // this.toast.failure(err.error.message);
          }
        });
      } else {
        productdata.uuid = this.data.uuid;
        productdata.status = status;
        this.porderservice.updatevenvar(productdata).subscribe({
          next: (resp) => {
            // this.toast.success('Order Updated Successfully');
            this.data = {};
            this.purcaseForm.reset();
            this.submit = false;
            this.router.navigate(['/app/view/' + resp.uuid]);
          },
          error: (err) => {
            // this.toast.failure(err.error.message);
          }
        });
      }
    } else {
      let productdata: any = Object.assign({}, this.purcaseForm.value);
      ////console.log(this.purcaseForm.value)
      let productdataitemlist: any = productdata.itemlist || [];
      productdataitemlist.forEach((item: any, index: number) => {
        Object.keys(item).forEach((keyval) => {
          if (item[keyval] === '-1-') delete productdataitemlist[index][keyval];
        });
      });
      productdata.itemlist = productdataitemlist;
      productdata.status = status;
      this.porderservice.createvendorvarpo(productdata).subscribe({
        next: (resp) => {
          // this.toast.success('Order Created Successfully');
          this.data = {};
          this.purcaseForm.reset();
          this.router.navigate(['/app/view/' + resp.uuid]);
        },
        error: (err) => {
          // this.toast.failure(err.error.message);
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

  savegst() {}
  viewgst(content: any): void {
    const modelref = this.modalService.open(content, { size: 'md' });
  }

  changeDate(event: any) {
    this.expminDate = event.target.value;
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
        // this.toast.failure("Error while download file : " + err.error.message);
      }
    });
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addfile = file;
      let selctvendor = this.purcaseForm.get('vendor')?.value;
      let seldepart = this.purcaseForm.get('department')?.value;
      const formd: any = new FormData();
      formd.append('path', this.addfile);
      formd.append('vendor', selctvendor);
      formd.append('department', seldepart);
      this.porderservice.importvenvar(formd).subscribe({
        next: (importdata) => {
          let data = importdata.data || [];
          var fieldAdd = new Promise((resolve, reject) => {
            this.formData().clear();
            data.forEach((val: any, i: number) => {
              let prodindex = this.products.findIndex((res) => res.pid + '' === val.pid + '');
              let getproduct = this.products[prodindex] || {};
              if (getproduct) {
                this.addField().then(() => {
                  this.changeproductimage(i, prodindex);
                  //this.formData().at(poindex).patchValue(getproduct)
                  //     this.changeproductitem(poindex)
                });
              }
              //this.purchaseformval = Object.assign(this.getitemData());
              if (i === data.length - 1) resolve(true);
            });
          });

          fieldAdd.then(() => {
            data.forEach((val: any, i: number) => {
              let selproduct: any = Object.assign({}, this.purcaseForm.get('itemlist')?.value[i]);
              selproduct.image = val.image;
              selproduct.imgpath = val.imgpath;
              selproduct.price = val.price || selproduct.price;
              selproduct.mrp = val.mrp || selproduct.mrp;
              selproduct.qty = val.qty || 0;
              if (selproduct.price > selproduct.discount) {
                selproduct.discount = val.discount;
                selproduct.discountoption = 1;
                selproduct.discounttype = 1;
                selproduct.vendorvariants = val.variant;
                // //console.log(val.variant)
                // if (val.variant && val.variant.length > 0)
                //   val.variant.forEach((variant: any, i: number) => {
                //     let variantID = parseInt(variant.id)
                //     if (variantID in selproduct) {
                //       selproduct[variant.id] = variant.value
                //     }
                //   })
              }
              this.formData().at(i).patchValue(selproduct);
            });
          });
        },
        error: (err) => {
          this.submit = false;
          // this.toast.failure(err.error.message);
        }
      });
    }
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
}
