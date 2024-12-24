import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { DepartmentsService } from 'src/app/pages/catalog/services/departments.service';
import { ProductsService } from 'src/app/pages/catalog/services/products.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { TokenStorageService } from 'src/app/pages/customer-support/services/token-storage.service';
import { Group } from 'src/app/pages/catalog/component/inventory/catalog-product/models/groups';
import { Brands } from 'src/app/pages/catalog/models/brands';
import { Categories, Department, Tax } from 'src/app/pages/catalog/models/purchaseorder';
import { Product } from 'src/app/pages/purchaser/models/product';
import { Subcategories } from 'src/app/pages/catalog/models/subcategories';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewProductComponent implements OnInit {
  units: Array<{ id: number, name: string }> = [{ id: 1, name: 'Box' }, { id: 2, name: 'Pieces' }, { id: 3, name: 'Units' }, { id: 4, name: 'Kilograms' }, { id: 5, name: 'Grams' }];
  statuses: Array<{ id: string, name: string }> = [{ id: 'Draft', name: 'Draft' }, { id: 'Publish', name: 'Publish' }, { id: 'Inactive', name: 'Unpublish' }];
  measures = ['ft', 'inch', 'cm', 'mm'];

  model: any;
  searching = false;
  searchFailed = false;
  group: Group = {}
  formData!: FormGroup;
  brandForm !: FormGroup; gsubmit = false;
  brands: Brands[] = [];
  categories: Categories[] = [];
  data: Product = {};
  brand: Brands = {};
  departments: Department[] = [];
  edit: boolean = false;
  showigst: boolean = false;
  measurement = '';
  subcategories: Subcategories[] = [];
  taxes: Tax[] = [];

  bmodel: any;
  bsearching = false;
  bsearchFailed = false;


  constructor(private productservice: ProductsService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef,
    private departmentservice: DepartmentsService, private route: ActivatedRoute, private router: Router, private toast: ToastService,
    private storage: TokenStorageService, private utiltiyservice: UtilsService, private modelservice: NgbModal
  ) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],//,Validators.pattern('[a-zA-Z0-9]+[a-zA-Z0-9 ]+')
      department_id: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      subcategory_id: ['', [Validators.required]],
      group_id: ['', [Validators.required]],
      brand_id: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      description: [''],
      measure: ['', [Validators.required]],
      selling_price: [''],
      status: ['VenDraft'],
      tax_id: ['', [Validators.required]],
      percentage: ['', [Validators.required]],
      hsncode: ['', [Validators.pattern('[0-9]+'), Validators.required]],
    })

    this.brandForm = this.formBuilder.group({
      uuid: [''],
      name: ['', [Validators.required, Validators.minLength(4)]],
      department_id: ['', [Validators.required]],
      description: [''],
      status: [1]
    })

    this.departmentservice.findList().subscribe({
      next: data => {
        this.departments = data;
        let uuid = this.route.snapshot.paramMap.get('uuid');
        if (uuid) {
          this.productservice.find(uuid, {}).subscribe({
            next: data => {
              this.data = data;
              this.group = data.group
              this.brand = data.brand
              if (data.status != 'VenDraft') {
                if (data.vendormapping?.status != -1) {
                  this.toast.failure('This product is not in draft, so you could not edit this product.');
                  this.router.navigate(['/vendorproducts']);
                }
              }
              this.cd.detectChanges();
              this.edit = true;
              this.showigst = data.ifigst == 0 ? false : true;
              this.measurement = data.measure
              this.data.vendormapping = data.vendormapping;//data.vendormappings?.[0];

              this.formData.setValue({
                name: data.name,
                //sku: data.sku,
                unit: data.unit,
                department_id: data.department_id,
                brand_id: data.brand_id,
                category_id: data.category_id,
                subcategory_id: data.subcategory_id,
                group_id: data.group_id,
                description: data.description || '',
                // width: data.width || '',
                // height: data.height || '',
                // weight: data.weight || '',
                // length: data.length || '',
                measure: data.measure || '',
                //cost_price: data.cost_price || '',
                selling_price: data.selling_price || '',
                //mrp: data.vendormapping?.mrp || '',
                status: this.data.status || 'Draft',
                //vendorproId: data.vendormapping?.vendorproId,
                // ctax_id: data.ctax_id,
                // stax_id: data.stax_id,
                tax_id: data.tax_id,
                percentage: data.percentage,
                hsncode: data.hsncode || '',
                // ifigst: data.ifigst || ''
              });
              this.getSelectvalues('edit')
              this.getSubclass('edit')
              // console.log(this.formData.value);
              this.cd.detectChanges();
            },
            error: () => {
            }
          })
        }
      },
      error: () => {
        this.departments = []
      }
    });
    this.productservice.taxlist().subscribe({
      next: taxes => {
        this.taxes = taxes;
        this.cd.detectChanges();
      }
    })
  }

  get form() {
    return this.formData.controls;
  }

  get brandform() {
    return this.brandForm.controls;
  }

  getSubclass(edit = '') {
    let did = (this.formData.get('category_id')?.value)
    if (did) {
      this.productservice.getcatlist(did).subscribe({
        next: data => {
          this.subcategories = data.subcategories

          let subcatid = '';
          if (edit === 'edit') {
            subcatid = this.data.subcategory_id || '';
            this.formData.get("subcategory_id")?.setValue(subcatid);
            // console.log(this.formData.get("subcategory_id"), subcatid);

          }
          else
            this.formData.get("subcategory_id")?.setValue('');
          this.cd.detectChanges();
        },
        error: () => {
          //this.departments = []
        }
      });
    }
  }

  search: OperatorFunction<string, readonly Group[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.productservice.search(term).pipe(
          map((x: any) => {
            if (x.length > 0) {
              this.searchFailed = false;
              return x;
            } else {
              this.searchFailed = true;
              return ["No Results Found"];
            }
          }),
          tap(() => this.searching = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    );
  formatter = (x: any) => x.name;

  bsearch: OperatorFunction<string, readonly Brands[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.bsearching = true),
      switchMap(term =>
        this.productservice.bsearch(term, this.formData.value.department_id
        ).pipe(
          map((x: any) => {
            if (x.length > 0) {
              this.bsearchFailed = false;
              return x;
            } else {
              this.bsearchFailed = true;
              return ["No Results Found"];
            }
          }),
          tap(() => this.bsearching = false),
          catchError(() => {
            this.bsearchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.bsearching = false)
    );
  bformatter = (x: any) => x.name;


  itemSelected($event: any) {
    const groupval = $event.item
    // console.log(groupval.id);

    this.group = groupval
    if (groupval.id) {
      this.formData.get("department_id")?.setValue(groupval.department_id);
      this.formData.get("category_id")?.setValue(groupval.category_id);
      this.formData.get("subcategory_id")?.setValue(groupval.subcategory_id);
      this.formData.get("group_id")?.setValue(groupval.id);

      this.brandForm.get("department_id")?.setValue(groupval.department_id);

      this.getSelectvalues()
    }
  }

  cat_id: any;
  sub_cat: any;
  getSelectvalues(edit = '') {
    let did = (this.formData.get('department_id')?.value)
    // console.log(did);
    if (did) {
      this.productservice.getlistall(did).subscribe({
        next: data => {
          this.brands = data.brands;
          // console.log(data);
          // console.log(data.categories, data.subcategories, data.group);
          // console.log(this.formData.value);
          // console.log(this.formData.value.category_id);
          // console.log(this.categories);
          let cat_id = data.categories.filter((d: any) => d.cid == this.formData.value.category_id);
          // console.log(cat_id);
          this.cat_id = cat_id[0].name;
          this.formData.get("category_id")?.patchValue(this.cat_id);

          // Subcategory
          let sub_cat = data.subcategories.filter((d: any) => d.id == this.formData.value.subcategory_id);
          // console.log(sub_cat);
          this.sub_cat = sub_cat[0].name;
          this.formData.get("subcategory_id")?.patchValue(this.formData.value.subcategory_id);

          // let bid = this.brands.find((e) => e.bid == this.data.brand_id)
          // this.formData.get("brand_id")?.setValue(bid?.bid);

          let brandid = '';
          let cateid = '';
          let subcatid = '';
          if (edit === 'edit') {
            brandid = this.data.brand_id || '';
            cateid = this.data.category_id || '';
            this.brandForm.get("department_id")?.setValue(this.group.department_id);
            this.formData.get("brand_id")?.setValue(this.brand.bid);
            //subcatid = this.data.subcategory_id || '';
          }
          this.cd.detectChanges();
        }
      })
    }
  }


  submit: boolean = false;
  saveProduct() {
    this.submit = true;
    // console.log(this.formData.value);
    if (this.formData.invalid) {
      // console.log(this.formData.value);
      if (this.data.uuid !== '') {
        return
      }
      else {
        if (this.formData.value.brand_id == '' || this.formData.value.brand_id == null)
          this.toast.failure('Select Brand');
      }
      return;
    }
    else if (this.formData.value.measure == '' && (this.formData.value.length != '' || this.formData.value.height != '' || this.formData.value.width != '')) {
      // console.log(this.formData.value);
      this.toast.failure('Please select the metric');
      return;
    }
    if (this.data.uuid != null) {
      // console.log(this.formData.value);
      let productdata = this.formData.value;
      productdata.uuid = this.data.uuid;
      this.productservice.update(productdata).subscribe({
        next: resp => {
          this.toast.success('Product Updated Successfully');
          this.data = {};
          this.formData.reset();
          this.submit = false;
          this.router.navigate(['/vendor/vendorproducts/mapping/' + resp.uuid]);

          this.cd.detectChanges();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
    else {
      // console.log('error inside');

      this.productservice.create(this.formData.value).subscribe({
        next: resp => {
          // console.log(resp);
          this.toast.success('Products Created Successfully');
          this.data = {}
          this.formData.reset();
          this.submit = false;
          this.router.navigate(['/vendor/vendorproducts/mapping/' + resp.uuid]);

          this.cd.detectChanges();
        }, error: err => {
          this.toast.failure(err.error.message);
        }
      })
    }
  }

  bitemSelected($event: any) {
    const bval = $event.item
    this.brand = bval
    if (bval.bid) {
      this.formData.get("brand_id")?.setValue(bval.bid);
    }
  }

  taxchange(tax: any) {
    if (tax) {
      //console.log(tax)
      this.formData.get("percentage")?.setValue(tax.percentage);
    }
  }

  changemetric($event: any) {
    this.measurement = $event.target.value;
  }

  savebrand() {
    this.gsubmit = true;
    if (this.brandForm.invalid) {
      // console.log(this.brandForm);
      return;
    }
    this.productservice.createBrand(this.brandForm.value).subscribe({
      next: resp => {
        this.toast.success('Brands Created Successfully');
        this.modelservice.dismissAll();
        //this.formData.get("brand_id")?.setValue(resp.data.bid);
        this.brands = [...this.brands, resp.data]
        this.brandForm.reset();
        this.brandForm.get("department_id")?.setValue(this.group.department_id);
        this.gsubmit = false;

        this.cd.detectChanges();
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    })

  }

}
