import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule, NgbHighlight, NgbModal, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Brands } from '../..//models/brands';
import { Categories } from '../..//models/categories';
import { Department } from '../..//models/department';
import { Group } from '../..//models/groups';
import { Product, Tax } from '../../models/product';
import { Subcategories } from '../../models/subcategories';
import { BrandsService } from '../../services/brands.service';
import { DepartmentsService } from '../../services/departments.service';

import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Vendor } from '../..//models/vendor';
import { ProductsService } from '../../services/products.service';
import { MapvariantComponent } from '../mapvariant/mapvariant.component';
import { VendormappingComponent } from '../vendormapping/vendormapping.component';
import { GroupService } from '../../services/groups.service';
import { ProductvariantsService } from '../../services/productvariants.service';

const states = ['Alabama', 'Alaska'];

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    CommonModule,
    RouterModule,
    MapvariantComponent,
    VendormappingComponent,
    NgSelectModule,
    ReactiveFormsModule,
    NgbHighlight,
    NgbTypeaheadModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddproductComponent implements OnInit {
  formData!: FormGroup;
  data: Product = {};
  units: Array<{ id: number; name: string }> = [
    { id: 1, name: 'Box' },
    { id: 2, name: 'Pieces' },
    { id: 3, name: 'Units' },
    { id: 4, name: 'Kilograms' },
    { id: 5, name: 'Grams' }
  ];
  statuses: Array<{ id: string; name: string }> = [
    { id: 'Draft', name: 'Draft' },
    { id: 'Publish', name: 'Publish' },
    { id: 'Inactive', name: 'Unpublish' }
  ];
  measures = ['ft', 'inch', 'cm', 'mm'];
  active = 1;
  submit: boolean = false;
  breadCrumbItems: Array<{}> = [];
  edit: boolean = false;
  departments: Department[] = [];
  categories: Categories[] = [];
  brands: Brands[] = [];
  groups: Group[] = [];
  grupsdata: Group[] = [];
  subcategories: Subcategories[] = [];
  taxes: Tax[] = [];
  showigst: boolean = false;
  measurement = '';
  silkSareeDetail: any;
  model: any;
  searching = false;
  searchFailed = false;
  group: Group = {};

  vmodel: any;
  vsearching = false;
  vsearchFailed = false;
  vendor: Vendor = {};

  brandForm!: FormGroup;
  gsubmit = false;

  vendors: Vendor[] = [];

  formatter = (x: any) => x.name;

  vsearch: OperatorFunction<string, readonly Vendor[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.vsearching = true)),
      switchMap((term) =>
        this.productservice.vsearch(term).pipe(
          map((x: any) => {
            if (x.length > 0) {
              this.vsearchFailed = false;
              return x;
            } else {
              this.vsearchFailed = true;
              return ['No Results Found'];
            }
          }),
          tap(() => (this.vsearching = false)),
          catchError(() => {
            this.vsearchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.vsearching = false))
    );
  vformatter = (x: any) => x.name;
  subcat: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productservice: ProductsService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private departmentservice: DepartmentsService,
    private modelservice: NgbModal,
    private brandservice: BrandsService,
    private groupService: GroupService,
    private productvariantsservice: ProductvariantsService
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      name: [this.data.name, [Validators.required, Validators.minLength(3)]],
      department_id: [this.data.department_id, [Validators.required]],
      category_id: [this.data.category_id, [Validators.required]],
      subcategory_id: [this.data.subcategory_id, [Validators.required]],
      group_id: [this.data.group_id, [Validators.required]],
      brand_id: [this.data.brand_id, [Validators.required]],
      unit: [this.data.unit, [Validators.required]],
      description: [this.data.description],
      width: [this.data.width, [Validators.pattern('[0-9]+')]],
      height: [this.data.height, [Validators.pattern('[0-9]+')]],
      length: [this.data.length, [Validators.pattern('[0-9]+')]],
      measure: [this.data.measure],
      weight: [this.data.weight, [Validators.pattern('[0-9]+')]],
      selling_price: [this.data.selling_price],
      status: ['1'],
      vendor_id: [this.data?.vendormapping?.vendor_id, [Validators.required]],
      tax_id: [this.data.tax_id, [Validators.required]],
      percentage: [this.data.percentage, [Validators.required]],
      hsncode: ['', [Validators.pattern('[0-9]+'), Validators.required]]
    });

    this.brandForm = this.formBuilder.group({
      uuid: [this.data.uuid],
      name: [this.data.name, [Validators.required, Validators.minLength(3)]],
      department_id: [this.data.department_id],
      createdBy: [this.data.createdBy],
      description: [this.data.description],
      status: [1]
    });
    // this.getSaree();
    this.departmentservice.findList().subscribe({
      next: (data) => {
        this.departments = data;
        let uuid = this.route.snapshot.paramMap.get('uuid');
        this.formData.get('department_id').setValue('3');

        if (uuid) {
          this.productservice.find(uuid, {}).subscribe({
            next: (data) => {
              if (data.poproduct != null) {
                this.toast.failure('This product already associated to P.O, so you could not edit this product.');
                this.router.navigate(['/category-head/products']);
              }
              this.data = data;
              this.group = data.group;
              this.vendor = data?.vendormapping?.user;
              //console.log(data, "=>", data.vendormappings)
              this.edit = true;
              this.measurement = data.measure;
              this.formData.setValue({
                name: data.name,
                //sku: data.sku,
                unit: data.unit,
                department_id: data.department_id,
                brand_id: data.brand_id,
                vendor_id: data?.vendormapping?.vendor_id,
                category_id: data.category_id,
                subcategory_id: data.subcategory_id,
                group_id: data.group_id,
                description: data.description || '',
                width: data.width || '',
                height: data.height || '',
                weight: data.weight || '',
                length: data.length || '',
                measure: data.measure || '',
                //cost_price: data.cost_price || '',
                selling_price: data.selling_price || '',
                status: this.data.status || '',
                // ctax_id: data.ctax_id,
                // stax_id: data.stax_id,
                tax_id: data.tax_id,
                percentage: data.percentage,
                hsncode: data.hsncode || ''
                //ifigst: data.ifigst || ''
              });
              this.formData.get('vendor_id').setErrors(null);
              this.getSelectvalues('edit');
              //this.getSubclass('edit')
              this.cd.detectChanges();
            },
            error: () => { }
          });
        }
        this.getSelectvalues();
      },
      error: () => {
        this.departments = [];
      }
    });
    this.productservice.taxlist().subscribe({
      next: (taxes) => {
        this.taxes = taxes;
        this.cd.detectChanges();
      }
    });
    this.productservice.vendorlist().subscribe({
      next: (vendors) => {
        this.vendors = vendors;
        this.cd.detectChanges();
      }
    });
    this.groupService.findall().subscribe({
      next: (resp) => {
        this.grupsdata = resp;
      }
    });
  }

  // getSaree(event: Array<any>) {
  //   console.log(event, typeof event, Object.values(event)[1]);
  //   this.productservice.search(Object.values(event)[1]).subscribe((x: any) => {
  //     if (x.length > 0) {
  //       this.searchFailed = false;
  //       this.silkSareeDetail = x[0];
  //       console.log(this.silkSareeDetail);

  //       // this.itemSelected(this.silkSareeDetail);
  //     } else {
  //       this.searchFailed = true;
  //       this.toast.failure('Try again !');
  //     }
  //   });
  // }
  // itemSelected($event: any) {
  //   const groupval = $event;
  //   this.group = groupval;
  //   if (groupval.id) {
  //     this.formData.get('department_id')?.setValue(groupval.department_id);
  //     this.formData.get('category_id')?.setValue(groupval.category_id);
  //     this.formData.get('subcategory_id')?.setValue(groupval.subcategory_id);
  //     this.formData.get('group_id')?.setValue(groupval.id);

  //     this.brandForm.get('department_id')?.setValue(groupval.department_id);
  //     if (this.data.uuid) this.getSelectvalues('edit');
  //     else this.getSelectvalues();
  //   }
  // }

  vitemSelected($event: any) {
    const vval = $event.item;
    this.vendor = vval;

    if (vval.uid) {
      // console.log(this.vendor, this.formData);
      this.vmodel = vval.uid;
      this.formData.controls['vendor_id'].patchValue(null || '');
      // console.log(this.formData);
      this.formData.get('vendor_id')?.setValue(vval.uid);
    }
    this.cd.detectChanges();
    // console.log(this.vendor, this.formData);
  }

  get form() {
    return this.formData.controls;
  }

  get brandform() {
    return this.brandForm.controls;
  }

  sub_catid: any;
  sub_cat_value: any;
  group_id: any;
  group_id_value: any;
  getSelectvalues(edit = '') {
    // let did = this.formData.get('department_id')?.value;
    let did = '3';
    let brandid = '';
    let cateid = '';
    let subcatid = '';
    if (edit === 'edit') {
      brandid = this.data.brand_id || '';
      cateid = this.data.category_id || '';
      this.brandForm.get('department_id')?.setValue(this.group.department_id);

      this.groupService.findall().subscribe({
        next: (resp) => {
          this.grupsdata = resp;
        }
      });
    }

    if (did) {
      this.productservice.getlistall(did).subscribe({
        next: (data) => {
          this.brands = data.brands;
          setTimeout(() => {
            this.categories = data.categories;
            // console.log(this.categories);
          }, 1);
          this.categories = data.categories;
          // console.log(this.categories, this.categories[0].name);
          this.subcategories = data.subcategories;
          this.subcat = data.subcategories;
          this.groups = data.group;
          // console.log(this.categories, this.subcategories, this.grupsdata);
          // console.log(this.group.subcategory_id, this.group.name)

          this.sub_catid = this.subcategories.filter((d: any) => d.id == this.group.subcategory_id);
          // console.log(this.sub_catid, this.subcategories);
          this.sub_cat_value = this.sub_catid[0].name;
          // console.log(this.sub_cat_value);

          this.group_id = this.grupsdata.filter((d: any) => d.name == this.group.name);
          // console.log(this.group_id);
          this.group_id_value = this.group_id[0].name;
          // console.log(this.group_id_value);
          this.formData.get('group_id')?.setValue(this.group_id);
          this.formData.get('group_id')?.setValue(this.group.id);
          this.formData.get('vendor_id')?.setValue(this.vendor.uid);
          this.formData.get('subcategory_id')?.setValue(this.sub_cat_value);

          this.formData.get('vendor_id').setErrors(null);
          this.formData.get('brand_id')?.setValue(brandid);
          this.cd.detectChanges();
        },
        error: () => { }
      });
    }
  }

  getSubclass(edit = '') {
    let did = this.formData.get('category_id')?.value;
    if (did) {
      this.productservice.getcatlist(did).subscribe({
        next: (data) => {
          this.subcategories = [];
          this.subcategories = data.subcategories;

          // console.log(this.subcategories);
          this.cd.detectChanges();
          if (this.data.uuid) {
            this.formData.get('group_id')?.setValue('');
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

    // this.groupService.findall().subscribe({
    //   next: (resp) => {
    //     this.grupsdata = resp;
    //   }
    // });
  }
  getGroup(event: any) {
    if (this.data.uuid) {
      this.grupsdata = [];
      this.formData.get('group_id').setValue('');
      // if (event.id == undefined) {
      this.productvariantsservice
        .grouplist(this.formData.get('department_id')?.value, this.formData.get('subcategory_id')?.value)
        .subscribe({
          next: (groups: any) => {
            this.grupsdata = groups;
          }
        });
      // }
    } else {
      // console.log(event.id);
      this.productvariantsservice.grouplist(this.formData.get('department_id')?.value, event.id).subscribe({
        next: (groups: any) => {
          this.grupsdata = groups;
        }
      });
    }
  }
  viewBrand(content: any): void {
    const modelref = this.modelservice.open(content, { size: 'md' });
  }

  savebrand() {
    this.gsubmit = true;
    if (this.brandForm.invalid) {
      return;
    }
    this.brandservice.create(this.brandForm.value).subscribe({
      next: (resp) => {
        this.toast.success('Brand Created Successfully');
        this.modelservice.dismissAll();
        this.brands = [...this.brands, resp.data];
        this.brandForm.reset();
        this.brandForm.get('department_id')?.setValue(this.group.department_id);
        this.gsubmit = false;
      },
      error: (err) => {
        this.toast.failure(err.error.message);
      }
    });
  }

  saveProduct() {
    this.submit = true;
    this.formData.get('vendor_id').valueChanges.subscribe((checked) => {
      // console.log(checked, this.formData.get('vendor_id').valueChanges);

      this.formData.updateValueAndValidity();
    });

    if (this.edit == true) {

      if (!this.sub_catid) {
        this.formData.get('subcategory_id')?.setValue(this.formData.get('subcategory_id').value);
      } else {
        this.sub_catid = this.subcat.find((subcategory: { id: any }) => subcategory.id === this.data.subcategory_id);

        if (this.sub_catid.id == this.data.subcategory_id) {
          this.formData.get('subcategory_id')?.setValue(this.data.subcategory_id);
        }
      }
    }



    if (this.formData.invalid) {
      // this.toast.failure("Please Enter all the required fields");
      return;
    }
    // console.log(this.formData.get('vendor_id').setErrors(null));
    let validform =
      this.formData.get('category_id')?.value != '' &&
        this.formData.get('subcategory_id').value != '' &&
        this.formData.get('name').value != '' &&
        this.formData.get('hsncode').value != '' &&
        this.formData.get('vendor_id').value != '' &&
        this.formData.get('brand_id').value != '' &&
        this.formData.get('unit').value != '' &&
        this.formData.get('tax_id').value != '' &&
        this.formData.get('measure').value != ''
        ? true
        : false;

    // else if (this.formData.value.measure == '' && (this.formData.value.length != '' || this.formData.value.height != '' || this.formData.value.width != '')) {
    //   this.toast.failure('Please select the metric');
    //   return;
    // }
    // else if(!Number(this.formData.value.ctax_id) && !Number(this.formData.value.stax_id ) && !Number(this.formData.value.itax_id))
    // {
    //   if(this.showigst)
    //   this.toast.failure('Please enter the IGST');
    //   else
    //   this.toast.failure('Please enter the CGST and SGST');
    //   return;
    // }
    // else if(Number(this.formData.value.ctax_id) && !Number(this.formData.value.stax_id))
    // {
    //   this.toast.failure('Please enter the SGST');
    //   return;
    // }
    // else if(!Number(this.formData.value.ctax_id) && Number(this.formData.value.stax_id))
    // {
    //   this.toast.failure('Please enter the CGST');
    //   return;
    // }
    let arr = [];
    arr = Object.values(this.formData.get('vendor_id').value);
    // console.log(arr[0]);
    this.formData.get('vendor_id').setValue(arr[0]);
    // console.log(this.formData.get('vendor_id').statusChanges);
    // console.log(this.formData.value);
    if (this.data.uuid != null) {
      let productdata = this.formData.value;
      productdata.uuid = this.data.uuid;
      this.productservice.update(productdata).subscribe({
        next: (resp) => {
          this.toast.success('Product Updated Successfully');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          this.router.navigate(['/category-head/mappingparams/' + resp.uuid]);
        },
        error: (err) => {
          this.toast.failure(err);
        }
      });
    } else {
      if (validform == true) {
        this.productservice.create(this.formData.value).subscribe({
          next: (resp) => {
            // console.log('inside resp');
            // if (validform === true) {
            // console.log('inside true');
            this.toast.success('Products Created Successfully');
            this.data = {};
            this.formData.reset();
            this.router.navigate(['/category-head/mappingparams/' + resp.uuid]);
            // }
            // else {
            //   console.log("inside else")
            //   this.toast.failure('Please Enter all the required fields')
            // }
          },
          error: (err) => {
            // console.log('inside error');
            this.toast.failure(err);
          }
        });
      } else {
        // console.log('else invalid');
        this.toast.failure('invalid data');
      }
    }
  }

  // cstaxchange(cstax:any)
  // {
  //   if(cstax)
  //   this.formData.get("itax_id")?.setValue('');
  // }

  // i
  taxchange(tax: any) {
    if (tax) {
      ////console.log(tax)
      this.formData.get('percentage')?.setValue(tax.percentage);
    }
  }

  // ifigst(igst:any)
  // {
  //     this.showigst = igst.target.checked;
  //     if(this.showigst)
  //     {
  //       this.formData.get("ctax_id")?.setValue('');
  //       this.formData.get("stax_id")?.setValue('');
  //     }
  //     else
  //     {
  //       this.formData.get("itax_id")?.setValue('');
  //     }
  // }

  changemetric($event: any) {
    this.measurement = $event.target.value;
  }
}
