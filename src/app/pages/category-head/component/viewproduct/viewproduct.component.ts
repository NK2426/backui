import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { environment } from 'src/environments/environment';
import { Product, Productimage, Productmap, Productmapparam } from '../../models/product';
import { Productvariants } from '../../models/productvariants';
import { Vendormapping } from '../../models/vendor';
import { VENDOR_VARIANT } from '../../models/vendorvariant';
import { ProductsService } from '../../services/products.service';
import { MapvariantComponent } from '../mapvariant/mapvariant.component';
import { VendormappingComponent } from '../vendormapping/vendormapping.component';

@Component({
  selector: 'app-viewproduct',
  templateUrl: './viewproduct.component.html',
  styleUrls: ['./viewproduct.component.scss'],
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
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewproductComponent implements OnInit {
  public user = JSON.parse(sessionStorage.getItem('auth_user') || '{}');

  baseurl = '';
  viewvendor: Product = {};
  productId!: string;
  uuid!: string;
  canShow = true;
  vendorVariants!: VENDOR_VARIANT.vendorVariant[];
  productmapparams: Productmapparam[] = [];
  productmapvariants: Productmap[] = [];
  productgrpvariants: Productvariants[] = [];
  productimages: Productimage[] = [];
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
  vendorMappings: Vendormapping[] = [];
  reason = '';
  count = 0;
  selvariantkey: any = [];
  selectedvariantvalues: any = [];
  productVariantHeader: Productvariants[] = [];
  productVariantCellValue: any = [];

  vendorMappingForms!: FormArray; // created this since for every row we need to submit
  productVariantOptions!: FormArray;

  nosizechart = false;
  fileName: any = '';
  addfile: string = '';
  disableNewVendorMapping: boolean = true;
  isEditable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productservice: ProductsService,
    private fb: FormBuilder,
    private env: EnvService,
    private toast: ToastService,
    private modelservice: NgbModal,
    private ref: ChangeDetectorRef
  ) {
    this.vendorMappingForms = this.fb.array([]);
  }

  ngOnInit(): void {
    this.baseurl = environment.CATEGORY_HEAD_SITE_URL;

    let uuid = this.route.snapshot.paramMap.get('uuid');
    this.productId = uuid || '';
    if (uuid) {
      this.productVariantHeader = [];
      this.productservice.find(uuid, {}).subscribe({
        next: (data) => {
          this.viewvendor = data;
          
          this.productmapparams = data.productmapparams.filter((x: any) => x.value_id > 0);
          // console.log('product map params =>', data.productmapparams);
          if (data.vendormapping != null) {
            this.vendorMappings[0] = data.vendormapping;
            // this.reason = data.vendormapping.reason;
          }
          
          this.productmapvariants = data.productsmaps; //.filter((x:any) => x.vendor_id == data.modifiedBy);
          this.productimages = data.productselectimages;
          // console.log(this.productimages);
          
          this.productmapvariants?.map((element: any, index) => {
            this.selectedvariantvalues[element.productvariant_id] = [];
            let values = element?.variantvalues.split(',').map(Number);
            values.forEach((val: any) => {
              let selprovariant = element?.productvariant?.productvariantvalues.find((x: any) => x.id == val);
              this.selectedvariantvalues[element.productvariant_id].push(selprovariant);
            });
          });
          this.ref.detectChanges()
          //Product group variants list
          this.productservice.getvariantlist(data.subcategory_id).subscribe({
            next: (resp) => {
              this.productVariantHeader = resp;
              //form grp variant values
              this.productVariantHeader?.map((element: any, outerIndex) => {
                //let productVar = element.productvariant; // product variant
                let productVariantID = element.id; // product variant id
                let productVarVal = element.productvariantvalues as []; // extract id and name
                this.productVariantCellValue[outerIndex] = [];
                productVarVal.forEach((element: any, innerIndex) => {
                  const { id, value } = element;
                  const productvarKeyVal = { [productVariantID]: id };
                  this.productVariantCellValue[outerIndex].push({
                    value: productvarKeyVal,
                    displayName: value
                  });
                });
              });
              this.getVendorVariantMapping();
              // this.ref.detectChanges();
            },
            error: (err) => {
              this.toast.failure(err.error.message);
            }
          });
          // this.ref.detectChanges();
        }
      });
    }
  }

  getUnits(id: any) {
    let item = this.units.find((x) => x.id == id);
    return item?.name;
  }

  getStatus(id: any) {
    let item = this.statuses.find((x) => x.id == id);
    return item?.name;
  }

  sizechart(event: any) {
    this.nosizechart = event.target.checked;
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      var mimeType = event.target.files[0].type;
      if (!mimeType.match('image.*')) {
        this.toast.failure('Upload Image only');
        return;
      } else {
        this.addfile = file;
        const formsize: any = new FormData();
        formsize.append('sizechart', this.addfile);
        this.productservice.savesizechart(this.viewvendor.uuid, formsize).subscribe({
          next: (resp) => {
            this.fileName = resp;
            this.toast.success('Successfully Updated');
          },
          error: (err) => {
            this.toast.failure(err.error.message);
          }
        });
      }
    }
  }

  reject() {
    if (confirm('Are you sure you want to Reject ?')) {
      if (this.reason == '') {
        this.toast.failure('Please enter remarks for rejection');
        return;
      }
      this.viewvendor.reqstatus = -1;
      this.viewvendor.reason = this.reason;
      this.productservice.addprice(this.viewvendor).subscribe({
        next: (resp) => {
          this.toast.success('Rejected Successfully');
          this.router.navigate(['/category-head/products']);
        },
        error: (err: any) => {
          this.toast.failure(err.error.message);
        }
      });
    }
  }

  accept() {
    if (this.reason == '') {
      this.toast.failure('Please enter remarks');
      return;
    } else {
      this.viewvendor.reqstatus = 1;
      this.productservice.addprice(this.viewvendor).subscribe({
        next: (resp) => {
          this.toast.success('Accepted Successfully');
          this.router.navigate(['/category-head/products']);
        },
        error: (err: any) => {
          this.toast.failure(err.error.message);
        }
      });
    }
  }

  getStatuses(id: any) {
    if (id == 1) return 'Accepted';
    else if (id == 0) return 'Waiting for Approval';
    else return 'Rejected';
  }

  getColor(id: any) {
    if (id == 1) return 'green';
    else if (id == 0) return 'blue';
    else return 'red';
  }

  newVendorVariantMapping(createOnIndex: number) {
    this.disableNewVendorMapping = true;
    if (createOnIndex) {
      createOnIndex = this.vendorVariants.length;
    }
    this.addVendorVariantMapping();
    this.productVariantHeader.map((header: any) => {
      this.addProductVariantOptions(createOnIndex);
    });
  }

  getVendorVariantMapping() {
    // below api needs to be replaced with actual api
    this.productservice.getProductVariantsList(this.productId).subscribe({
      next: (resp) => {
        this.canShow = true;
        this.vendorVariants = resp && resp.data;
        if (this.vendorVariants && this.vendorVariants.length === 0) {
          // this need to be revisited add === 0 in this condition to make it work properly for add and update
          // this.disableNewVendorMapping = true;
          // this.newVendorVariantMapping(0);
        } else {
          // this.addIsEditable();
          this.vendorMappingForms.reset();
          this.disableNewVendorMapping = false;
          (this.vendorVariants as []).forEach((row: any, index: number) => {
            this.vendorMappingForms.push(
              this.fb.group({
                id: [row.id],
                mrp: [row.mrp, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
                price: [row.price, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
                length: [row.length, [Validators.min(1), Validators.pattern('[0-9]+')]],
                width: [row.width, [Validators.min(1), Validators.pattern('[0-9]+')]],
                weight: [row.weight, [Validators.min(1), Validators.pattern('[0-9]+')]],
                height: [row.height, [Validators.min(1), Validators.pattern('[0-9]+')]],
                description: [row.description],
                isEditable: [false],
                productselectimage_id: [row.productselectimage_id, [Validators.required]],
                path: [row['productselectimage.path']],
                vendorproId: [row.vendorproId, [Validators.required]],
                productVariantOptions: this.fb.array([])
              })
            );
            //adding dropdown in each row based on table data response
            this.productVariantHeader.map((header: any) => {
              //this.addProductVariantOptions(index);
              this.getProductVariantOptions(index);
            });
          });
          // this.ref.detectChanges();
        }
      },
      error: (err: any) => {
        this.toast.failure('Error getting list, try again!');
      }
    });
  }

  addVendorVariantMapping() {
    this.vendorMappingForms.push(
      this.fb.group({
        id: [0],
        mrp: [0, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
        price: [0, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
        length: [0, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
        width: [0, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
        weight: [0, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
        height: [0, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
        description: [''],
        isEditable: [false],
        productVariantOptions: this.fb.array([])
      })
    );
  }
  /*  enableInput() {
     this.isEditable = true;
   } */

  recordSubmit(fg: FormGroup) {
    this.isEditable = false;
    this.disableNewVendorMapping = false;
    if (parseInt(fg.value.mrp) <= parseInt(fg.value.price)) {
      this.toast.failure('Price must be less than MRP');
      return;
    }
    if (fg.value.id == 0) {
      let individualVariants = fg.value?.productVariantOptions;
      let payload = Object.assign({}, ...individualVariants);
      fg.value.productVariantOptions = payload;
      this.productservice.postVendorVariantMap(fg.value, this.viewvendor.uuid || '').subscribe((res: any) => {
        this.toast.success('Added Successfully');
        this.vendorVariants = [];
        this.canShow = false;
        fg.reset();
        window.location.reload();
      });
    } else {
      //console.log(fg.value);
      this.productservice.putVendorVariantMap(fg.value, this.productId, this.uuid).subscribe((res: any) => {
        this.toast.success('Updated Successfully');
        window.location.reload();
      });
    }
  }

  enableEdit(fg: any, index: number) {
    fg.controls.isEditable.value = true;
    this.uuid = this.vendorVariants[index].uuid;
    this.disableNewVendorMapping = true;
  }

  onDelete(id: any, i: any) {
    this.disableNewVendorMapping = false;
    if (id == 0) this.vendorMappingForms.removeAt(i);
    else if (confirm('Are you sure to delete this record ?'))
      //  this.vendorMappingForms.removeAt(i); // this need to removed after api integration
      this.productservice.deleteVendorVariantMap(id).subscribe({
        // currently delete api doenst work
        next: (resp: any) => {
          if (resp.status == 200) {
            this.vendorMappingForms.removeAt(i);
            this.toast.success(resp.message);
          } else {
            this.toast.failure(resp.message);
          }
        },
        error: (err: any) => {
          this.toast.failure(err.error.message);
        }
      });
  }

  // Used to get a strongly typed formarray
  getByIndex(index: number): FormArray {
    // //console.log(this.vendorMappingForms.controls)
    return this.vendorMappingForms.controls[index] as FormArray;
  }
  removeimage() {
    if (confirm('Are you sure you want to delete this sizechart?')) {
      const formpath = { path: '' };
      this.productservice.removesizechart(this.viewvendor.uuid, formpath).subscribe({
        next: (resp) => {
          this.fileName = resp;
          this.toast.success('Successfully Deleted');
          this.ngOnInit();
        },
        error: (err) => {
          this.toast.failure(err.error.message);
        }
      });
    }
  }

  getProductVariantOptions(index: number): FormArray {
    return this.getByIndex(index).get('productVariantOptions') as FormArray;
  }

  // dynamic insert form control in to form array
  addProductVariantOptions(index: number) {
    this.getProductVariantOptions(index).push(this.fb.control('', [Validators.required]));
  }
}
