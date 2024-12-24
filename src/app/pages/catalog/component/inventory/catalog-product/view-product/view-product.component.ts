import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Product, Productmap, Productmapparam } from 'src/app/pages/category-head/models/product';
import { Productvariants } from 'src/app/pages/category-head/models/productvariants';
import { Productselectimages } from 'src/app/pages/category-head/models/purchaseorder';
import { Vendormapping } from 'src/app/pages/category-head/models/vendor';
import { VENDOR_VARIANT } from 'src/app/pages/category-head/models/vendorvariant';
import { ProductsService } from 'src/app/pages/category-head/services/products.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewProductComponent implements OnInit {
  data!: Product;
  vendorproduct?: Vendormapping[] = [];
  productimages?: Productselectimages[] = [];
  productmapparams?: Productmapparam[] = [];
  productmaps?: Productmap[] = [];
  baseurl: string = '';
  units: Array<{ id: number; name: string }> = [
    { id: 1, name: 'Box' },
    { id: 2, name: 'Pieces' },
    { id: 3, name: 'Units' },
    { id: 4, name: 'Kilograms' },
    { id: 5, name: 'Grams' }
  ];
  vendormapdata?: Vendormapping;

  submit = false;
  priceForm!: FormGroup;
  status: Array<{ id: string }> = [];

  measures = ['ft', 'inch', 'cm', 'mm'];
  measurement = '';

  selectedvariantvalues: any = [];
  productvariants: Productvariants[] = [];
  selvariantkey: any = [];
  selvariant: any = [];

  public user = JSON.parse(sessionStorage.getItem('token') || '{}');

  //Added for venvariant mapping
  productId!: string;
  uuid: string = '';
  canShow = true;
  vendorVariants!: VENDOR_VARIANT.vendorVariant[];
  productVariantHeader: Productvariants[];
  viewData: any = [];

  productVariantCellValue: any = [];
  vendorMappingForms: FormArray; // created this since for every row we need to submit
  productVariantOptions!: FormArray;
  disableNewVendorMapping: boolean = true;
  isEditable: boolean = false;
  selectvariantmap = { name: '', description: '', qty: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productservice: ProductsService,
    private toast: ToastService,
    private modelservice: NgbModal,
    private env: EnvService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.baseurl = this.env.SITE_URL;
    this.priceForm = this.fb.group({
      reason: ['']
    });

    this.vendorMappingForms = this.fb.array([]);
    let uuid = this.route.snapshot.paramMap.get('uuid');
    this.productId = uuid || '';

    // this.uuid = this.route.snapshot.paramMap.get('uuid') || '';
    // const productID = this.route.snapshot.paramMap.get('uuid');
    // console.log(productID, this.uuid);

    if (uuid) {
      this.productservice.find(uuid, {}).subscribe({
        next: (data) => {
          // console.log(data);
          this.data = data;
          // this.viewData.push(data);
          // this.viewData = data;
          this.productmapparams = this.data.productmapparams?.filter((x) => x.value_id > 0);
          this.productmaps = this.data.productsmaps;
          this.data.productsmaps?.map((element: any, index) => {
            this.selectedvariantvalues[element.productvariant_id] = [];
            let values = element?.variantvalues.split(',').map(Number);
            values.forEach((val: any) => {
              let selprovariant = element?.productvariant?.productvariantvalues.find((x: any) => x.id == val);
              this.selectedvariantvalues[element.productvariant_id].push(selprovariant);
            });
          });

          this.productimages = this.data.productselectimages;
          let vendormapping = this.data.vendormapping;
          let vendormapdata = vendormapping; //vendormapping?.find(x=>x.vendor_id == this.user.id);
          this.vendormapdata = vendormapdata;
          this.measurement = data.measure;

          this.priceForm.get('reason')?.setValue('');
          this.productservice.variantlist(this.data.subcategory_id).subscribe({
            next: (variants) => {
              if (variants.length == 0) {
                this.toast.info('Please add variant');
              } else {
                this.productvariants = variants;
                variants.forEach((val, i) => {
                  if (val.id) {
                    let selvardata = data?.productsmaps?.find((x: any) => x.productvariant_id == val.id);
                    this.selvariant[i] = selvardata?.variantvalues?.split(',').map(Number) || '';
                    this.selvariantkey[i] = val.id;
                  }
                  // if(data.productsmaps[i]){
                  //   this.selvariant[i] = data.productsmaps[i]['variantvalues'].split(',').map( Number ) || []
                  // }
                });
              }
              //console.log(this.productvariants);
            }
          });

          //Product group variants list
          this.productservice.getvariantlist(data.subcategory_id).subscribe({
            next: (resp) => {
              this.productVariantHeader = resp;
              // console.log('head=>', this.productVariantHeader);

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
                  this.cd.detectChanges();
                });
              });
              this.getVendorVariantMapping();
              // console.log('product variant values', this.productVariantCellValue);
            },
            error: (err) => {
              //this.toast.failure(err.error.message);
            }
          });
          this.cd.detectChanges();
        },
        error: () => { }
      });
    }
  }

  getVendorVariantMapping() {
    // below api needs to be replaced with actual api
    this.productservice.getProductVariantsList(this.productId).subscribe({
      next: (resp) => {
        this.canShow = true;
        this.vendorVariants = resp && resp.data;
        // console.log(resp, 'vendor variant =>', this.vendorVariants);
        this.cd.detectChanges();

        if (this.vendorVariants && this.vendorVariants.length === 0) {
          // this need to be revisited add === 0 in this condition to make it work properly for add and update
          this.disableNewVendorMapping = true;
          this.newVendorVariantMapping(0);
        } else {
          // this.addIsEditable();
          this.vendorMappingForms.reset();
          this.disableNewVendorMapping = false;
          (this.vendorVariants as []).forEach((row: any, index: number) => {
            this.vendorMappingForms.push(
              this.fb.group({
                id: [row.id],
                name: [row.name],
                // mrp: [row.mrp, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
                // price: [row.price, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
                // length: [row.length, [Validators.min(1), Validators.pattern('[0-9]+')]],
                // width: [row.width, [Validators.min(1), Validators.pattern('[0-9]+')]],
                // weight: [row.weight, [Validators.min(1), Validators.pattern('[0-9]+')]],
                qty: [row.item, [Validators.min(1), Validators.pattern('[0-9]+')]],

                description: [row.description],
                isEditable: [false],
                productselectimage_id: [row.productselectimage_id, [Validators.required]],
                path: [row['productselectimage.path']],
                // vendorproId: [row.vendorproId, [Validators.required]],
                productVariantOptions: this.fb.array([])
              })
            );
            this.selectvariantmap = {
              qty: row.qty,
              name: row.name,
              description: row.description
              // length: row.length,
              // height: row.height,
              // weight: row.weight,
              // vendorproId: row.vendorproId
            };
            //adding dropdown in each row based on table data response
            this.productVariantHeader.map((header: any) => {
              //this.addProductVariantOptions(index);
              this.getProductVariantOptions(index);
            });
          });
          this.cd.detectChanges();
        }
        this.cd.detectChanges();
      },
      error: (err: any) => {
        //this.toast.failure('Error getting list, try again!');
      }
    });
  }

  newVendorVariantMapping(createOnIndex: number) {
    let len = this.vendorMappingForms.controls.length;
    this.disableNewVendorMapping = true;
    if (createOnIndex) {
      createOnIndex = this.vendorVariants.length;
    }
    // console.log(this.vendorMappingForms.controls.length, createOnIndex);
    if (createOnIndex >= len) {
      this.addVendorVariantMapping();
      this.productVariantHeader.map((header: any) => {
        this.addProductVariantOptions(createOnIndex);
      });
    } else {
      // console.log('else');
      this.toast.failure('Please save and map new varient');
    }
  }

  // Used to get a strongly typed formarray
  getByIndex(index: number): FormArray {
    return this.vendorMappingForms.controls[index] as FormArray;
  }

  getProductVariantOptions(index: number): FormArray {
    return this.getByIndex(index).get('productVariantOptions') as FormArray;
  }

  // dynamic insert form control in to form array
  addProductVariantOptions(index: number) {
    this.getProductVariantOptions(index).push(this.fb.control('', [Validators.required]));
  }

  addVendorVariantMapping() {
    this.selectvariantmap.qty = 0;
    this.selectvariantmap.name = '';
    this.selectvariantmap.description = '';
    // this.selectvariantmap.width = 0;
    // this.selectvariantmap.weight = 0;
    // this.selectvariantmap.height = 0;
    // this.selectvariantmap.vendorproId = '';

    this.vendorMappingForms.push(
      this.fb.group({
        id: [0],
        qty: [this.selectvariantmap.qty, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
        name: [this.selectvariantmap.name],
        description: [this.selectvariantmap.description],
        // width: [this.selectvariantmap.width, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
        // weight: [this.selectvariantmap.weight, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
        // qty: [this.selectvariantmap.weight, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
        // height: [this.selectvariantmap.height, [Validators.min(1), Validators.required, Validators.pattern('[0-9]+')]],
        // description: [''],
        isEditable: [false],
        productselectimage_id: ['assets/media/avatars/blank.png', [Validators.required]],
        // vendorproId: [this.selectvariantmap.vendorproId, [Validators.required]],
        path: [''],
        productVariantOptions: this.fb.array([])
      })
    );
  }

  recordSubmit(fg: FormGroup) {
    this.isEditable = false;
    this.disableNewVendorMapping = false;
    if (parseInt(fg.value.mrp) < parseInt(fg.value.price)) {
      this.toast.failure('Price must be less than MRP');
      return;
    }
    if (fg.value.id == 0) {
      let individualVariants = fg.value?.productVariantOptions;
      let payload = Object.assign({}, ...individualVariants);
      fg.value.productVariantOptions = payload;
      this.productservice.postVendorVariantMap(fg.value, this.data.uuid || '').subscribe({
        next: (resp: any) => {
          this.toast.success('Added Successfully');
          this.vendorMappingForms.controls = [];
          this.getVendorVariantMapping();
          //this.canShow = false;
          //this.disableNewVendorMapping = true;
          //this.newVendorVariantMapping(0);
          //window.location.reload();
        },
        error: (err: any) => {
          this.toast.failure(err);
        }
      });
    } else {
      this.productservice.putVendorVariantMap(fg.value, this.productId, this.uuid).subscribe((res: any) => {
        this.toast.success('Updated Successfully');
        this.vendorMappingForms.controls = [];
        this.getVendorVariantMapping();
        //fg.reset();
        //window.location.reload();
      });
    }
  }

  enableEdit(fg: any, index: number) {
    // console.log(fg);
    let uuid = this.route.snapshot.paramMap.get('uuid');
    this.router.navigate(['/catalog/editproduct/' + uuid]);
    fg.controls.isEditable.value = true;
    this.uuid = this.vendorVariants[index].uuid;
    this.disableNewVendorMapping = true;
  }

  setimage(fg: any, image: Productselectimages) {
    // let selproduct = Object.assign({}, this.purcaseForm.get('itemlist')?.value[i])
    // selproduct.image = image.id;
    // selproduct.imgpath = image.path;
    // this.formData().at(i).patchValue(selproduct)
    // this.vendorMappingForms.controls[i].value.productselectimage_id = image.id
    // this.vendorMappingForms.controls[i].value.path = image.path

    fg.get('path')?.setValue(image.path);
    fg.get('productselectimage_id')?.setValue(image.id);
  }

  onDelete(id: any, i: any) {
    this.disableNewVendorMapping = false;
    if (id == 0) this.vendorMappingForms.removeAt(i);
    //  this.vendorMappingForms.removeAt(i); // this need to removed after api integration
    else {
      this.productservice.confirmVariantMap(id).subscribe({
        next: (resp: any) => {
          if (resp.status == 200) {
            this.vendorMappingForms.removeAt(i);

            if (confirm(resp.message)) {
              this.productservice.deleteVendorVariantMap(id).subscribe({
                next: (resp: any) => {
                  if (resp.status == 200) {
                    this.vendorMappingForms.removeAt(i);
                    this.toast.success(resp.message);
                    this.vendorMappingForms.controls = [];
                    this.getVendorVariantMapping();
                    //window.location.reload();
                  } else {
                    this.toast.failure(resp.message);
                    this.vendorMappingForms.controls = [];
                    this.getVendorVariantMapping();
                  }
                },
                error: (err: any) => {
                  this.toast.failure(err);
                }
              });
            } else {
              // this.toast.failure(resp.message);
              this.vendorMappingForms.controls = [];
              this.getVendorVariantMapping();
            }
          } else {
            this.toast.failure(resp.message);
            this.vendorMappingForms.controls = [];
            this.getVendorVariantMapping();
          }
        },
        error: (err: any) => {
          this.toast.failure(err);
        }
      });
    }
  }

  reqapproval(status: any) {
    let allow: boolean = true;
    if (this.data.productselectimages && this.data.productselectimages?.length < 1) {
      allow = false;
      this.toast.failure('Please upload the image');
      return;
    }

    if (this.data.country == '') {
      allow = false;
      this.toast.failure('Please select the country');
      return;
    }

    if (this.vendorVariants.length == 0) {
      allow = false;
      this.toast.failure('Please add atleast one variant');
      return;
    }

    if (allow == true) {
      const modalRef = this.modelservice.open(ConfirmAlert);
      modalRef.componentInstance.confirmationBoxTitle = 'Product Approval Request Confirmation';
      modalRef.componentInstance.confirmationMessage = 'After approval request, you cannot edit this product, Do you want to do?';
      modalRef.result.then(
        (parameterResponse) => {
          let formdata = { status: status };
          this.productservice.reqapproval(formdata, this.productId).subscribe({
            next: (resp) => {
              if (resp) this.toast.success('Successfully Send for Approval');
              this.router.navigate(['/vendor/vendorproducts']);
              //this.router.navigate(['/app/products/mapping/'+this.uuid]);
            },
            error: (err) => {
              this.toast.failure(err.error.message);
            }
          });
        },
        (err) => {
          //this.toast.failure('Something went wrong.. Product does not delete.');
        }
      );
    }
  }

  saveprice() {
    this.submit = true;
    if (this.priceForm.invalid) {
      return;
    }
    if (this.vendorVariants.length == 0) {
      this.toast.failure('Please add atleast one variant');
      return;
    }
    if (this.priceForm.value.reason == undefined || this.priceForm.value.reason == '') {
      this.toast.failure('Please enter remarks');
      return;
    }
    this.priceForm.value.status = 1;
    this.priceForm.value.id = this.vendormapdata?.id;
    this.priceForm.value.uuid = this.data.uuid;
    this.productservice.addprice(this.priceForm.value).subscribe({
      next: (resp) => {
        this.toast.success('Product Accepted Successfully');
        // this.data = {};
        // this.priceForm.reset();
        // this.submit = false;
        // this.ngOnInit();
        window.location.reload();
      },

      error: (err: any) => {
        this.toast.failure(err.error.message);
      }
    });
  }

  reject() {
    if (this.priceForm.value.reason == undefined || this.priceForm.value.reason == '') {
      this.toast.failure('Please enter remarks for rejection');
      return;
    }
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Reject Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to reject?';
    modalRef.result.then(
      (parameterResponse) => {
        // console.log(this.priceForm.value);
        this.priceForm.value.price = 0;
        this.priceForm.value.mrp = 0;
        this.priceForm.value.status = -1;
        this.priceForm.value.id = this.vendormapdata?.id;
        this.priceForm.value.uuid = this.data.uuid;
        //this.priceForm.value.reason=this.vendormapdata?.reason;
        this.productservice.addprice(this.priceForm.value).subscribe({
          next: (resp) => {
            this.toast.success('Rejected Successfully');
            this.router.navigate(['/vendorproducts']);
          },
          error: (err: any) => {
            this.toast.failure(err.error.message);
          }
        });
        this.cd.detectChanges();
      },
      (err) => {
        //this.toast.failure('Something went wrong.. Product does not delete.');
      }
    );
  }
}
