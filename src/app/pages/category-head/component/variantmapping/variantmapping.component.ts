import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { EnvService } from 'src/app/_helpers/env.service';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Product, Productimage } from '../../models/product';
import { Productparameters } from '../../models/productparameters';
import { Productvariants } from '../../models/productvariants';
import { Vendor } from '../../models/purchaseorder';
import { ProductsService } from '../../services/products.service';
import { ProductvariantsService } from '../../services/productvariants.service';
@Component({
  selector: 'app-variantmapping',
  templateUrl: './variantmapping.component.html',
  styleUrls: ['./variantmapping.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VariantmappingComponent implements OnInit {
  selproduct: Product = {};
  uuid: string = '';
  checkedvariants: Array<any> = [];
  productvariants: Productvariants[] = [];
  myForm!: FormGroup;
  selvendors!: string;
  selvariants!: string;
  vendors: Vendor[] = [];
  parameters: Productparameters[] = [];
  allimages: Productimage[] = [];
  images: Productimage[] = [];
  selectedimages: any[] = [];
  medselectedimages: any[] = [];
  addimage: string = '';
  stockapprove = { status: '', comments: '', image: '' };
  baseurl: string = '';
  selparameterkey: any = [];
  selparameter: any = [];

  countries: Array<{ id: string; name: string }> = [
    { id: 'India', name: 'India' },
    { id: 'China', name: 'China' },
    { id: 'Korea', name: 'Korea' },
    { id: 'Australia', name: 'Australia' },
    { id: 'Austria', name: 'Austria' },
    { id: 'Belgium', name: 'Belgium' },
    { id: 'Brazil', name: 'Brazil' },
    { id: 'Canada', name: 'Canada' },
    { id: 'Denmark', name: 'Denmark' },
    { id: 'France', name: 'France' },
    { id: 'Germany', name: 'Germany' },
    { id: 'Indonesia', name: 'Indonesia' },
    { id: 'Ireland', name: 'Ireland' },
    { id: 'Italy', name: 'Italy' },
    { id: 'Japan', name: 'Japan' },
    { id: 'Jordan', name: 'Jordan' },
    { id: 'Malaysia', name: 'Malaysia' },
    { id: 'Mexico', name: 'Mexico' },
    { id: 'Norway', name: 'Norway' },
    { id: 'Portugal', name: 'Portugal' },
    { id: 'Russia', name: 'Russia' },
    { id: 'Saudi Arabia', name: 'Saudi Arabia' },
    { id: 'Singapore', name: 'Singapore' },
    { id: 'South Africa', name: 'South Africa' },
    { id: 'United Kingdom', name: 'United Kingdom' },
    { id: 'United States', name: 'United States' }
  ];
  nosizechart = false;
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 30, 50, 100];

  showsingleimg = false;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];
  previews: string[] = [];

  addfile: string = '';
  fileName: any = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productservice: ProductsService,
    private toast: ToastService,
    private formBuilder: FormBuilder,
    private productvariantservice: ProductvariantsService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private env: EnvService,
    private utils: UtilsService
  ) { }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('uuid') || '';
    const productID = this.route.snapshot.paramMap.get('uuid');
    if (productID) {
      this.productservice.find(productID, {}).subscribe({
        next: (data) => {
          this.selproduct = data;
          
          //console.log(this.selproduct.country, data);

          this.fileName = data?.sizechart || '';
          if (data?.sizechart != '' && this.selproduct?.department_id == '3') this.nosizechart = false;
          if (data.productsmaps) {
            this.selvariants = data.productsmaps.map((res: any) => res.productvariant_id);
          }
          // if(data.vendormappings){
          //   this.selvendors = data.vendormappings.map((res:any) => res.vendor_id)
          // }
          if (this.selproduct.department_id) {
            this.productservice.variantlist(this.selproduct.department_id).subscribe({
              next: (data) => {
                this.productvariants = data;
                // this.cdr.detectChanges();
              }
            });
            // this.productservice.vendorlist().subscribe({
            //   next: vendors => {
            //     this.vendors = vendors
            //   }
            // })
            this.productservice.parameterlist(this.selproduct.subcategory_id).subscribe({
              next: (parameters) => {
                this.parameters = parameters;
                parameters.map((val: any, i) => {
                  this.selparameter[val.id] = '';
                  this.selparameterkey[val.id] = val.id;
                  //if(data.productmapparams[i]){
                  let selparam = data.productmapparams.find((x: any) => x.productparameter_id == val.id);
                  if (selparam) this.selparameter[val.id] = selparam.value_id || '';
                  //}
                });
                this.cdr.detectChanges();
              }
            });
          }

          if (data.productselectimages) {
            //this.selectedimages = data.productselectimages;
            data.productselectimages.map((insimg: any) => {
              let selimg = { id: insimg.image_id, path: insimg.path };
              this.selectedimages.push(selimg);
            });
          }
          //this.cdr.detectChanges();
        },
        error: () => {
          this.router.navigate(['/category-head/products']);
        }
      });
      this.list();
    }
  }

  list() {
    const productID: any = this.route.snapshot.paramMap.get('uuid');
    const params = this.utils.getRequestParams(this.search, this.page, this.pageSize);
    this.productservice.find(productID, params).subscribe({
      next: (data) => {
        if (data.imagelist) {
          this.images = data.imagelist.datas || [];
          this.count = data.imagelist.totalItems;
        }
        if (data.productselectimages) {
          //this.selectedimages = data.productselectimages;

          this.selectedimages.map((insimg: any) => {
            let findex = this.images.findIndex((res) => res.id == insimg.id);

            if (findex >= 0) {
              this.images[findex]['select'] = true;
            }
          });
        }
        //this.cdr.detectChanges();
      },
      error: () => {
        this.router.navigate(['/category-head/products']);
      }
    });
  }

  get f() {
    return this.myForm.controls;
  }

  submit() {
    let allow: boolean = true;
    let insertvariant: any = {}
    if (this.selectedimages.length < 1) {
      allow = false;
      this.toast.failure('Please upload the image');
      return;
    }
    if (this.fileName == '' && this.selproduct.department_id == '3' && !this.nosizechart) {
      allow = false;
      this.toast.failure('Please upload the sizechart');
      return;
    }
    if (this.selproduct.country == undefined || this.selproduct.country == '') {
      allow = false;
      this.toast.failure('Please select the country');
      return;
    }
    if (allow == true) {
      const modalRef = this.modalService.open(ConfirmAlert);
      modalRef.componentInstance.confirmationBoxTitle = 'Product Publish Confirmation';
      modalRef.componentInstance.confirmationMessage =
        'After publishing, the product will be sent to vendor for approval, Do you want to do?';
      modalRef.result.then(
        (parameterResponse) => {
          if (this.selproduct.vendormapping == null || this.selproduct.vendormapping.status == -1) {
            this.toast.failure('Please map the vendor & publish the product');
            return;
          }

          let insertparameter: any = {};
          this.selparameterkey.forEach((val: any, index: number) => {
            insertparameter[val] = this.selparameter[index];
          });
          //vendors: this.selvendors,

          let formdata = {

            variants: this.selvariants,
            country: this.selproduct.country,
            parameters: insertparameter,
            images: this.selectedimages,
            status: 'Publish'
          };
          this.productservice.mapping(formdata, this.uuid).subscribe({
            next: (resp) => {
              if (resp) this.toast.success('Successfully Product Mapped');
              this.router.navigate(['/category-head/products']);
              //this.cdr.detectChanges();
              //this.router.navigate(['/category-head/products/mapping/'+this.uuid]);
            },
            error: (err) => {
              this.toast.failure(err);
            }
          });
        },
        (err) => {
          //this.toast.failure('Something went wrong.. Product does not delete.');
        }
      );
    }
  }

  reqdraft() {
    let insertparameter: any = {};
    this.selparameterkey.forEach((val: any, index: number) => {
      insertparameter[val] = this.selparameter[index];
    });

    if (this.selproduct.country == undefined) {
      this.toast.failure('Please select the country');
      return;
    }
    //vendors: this.selvendors,
    let formdata = {
      variants: this.selvariants,
      country: this.selproduct.country,
      parameters: insertparameter,
      images: this.selectedimages,
      status: 'Draft'
    };
    this.productservice.mapping(formdata, this.uuid).subscribe({
      next: (resp) => {
        if (resp) this.toast.success('Successfully Product Mapped');
        // this.router.navigate([]).then(result => { window.open('/admin/category-head/view/' + this.uuid, '_blank'); });
        //console.log(this.uuid);
        this.router.navigate(['/category-head/view/' + this.uuid]);
        //this.cdr.detectChanges();
        //this.router.navigate(['/category-head/products/mapping/'+this.uuid]);
      },
      error: (err) => {
        this.toast.failure(err);
      }
    });
  }

  getVariants() {
    let did = this.selproduct.department_id;
    this.productvariantservice.findList(did).subscribe({
      next: (data) => {
        this.selproduct = data;
        this.getVariants();
        //this.cdr.detectChanges();
      },
      error: () => {
        this.selproduct = {};
      }
    });
  }
  openGallery(content: any): void {
    //this.showsingleimg = type == 'Single' ? true : false;
    const modelref = this.modalService.open(content, { size: 'xl' });
  }

  onSelectedImage(event: any) {
    var reader = new FileReader();

    //Read the contents of Image File.
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        if (Number(img.width) < 800) {
          this.toast.failure('Please upload the image of minimum width 800px');
          return;
        } else {
          this.addimage = file;
          this.newimage();
        }
      };
    }
  }

  newimage() {
    const formd: any = new FormData();
    formd.append('image', this.addimage);
    this.productservice.saveGallery(this.selproduct.uuid, formd).subscribe({
      next: (resp) => {
        this.addimage = '';
        this.images.push(resp);
        resp.select = true;
        this.selectedimages.push(resp);
        this.toast.success('Successfully Updated');
        //this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.failure(err);
      }
    });
  }
  popupclose() {
    this.showsingleimg = false;
    this.modalService.dismissAll();
  }

  selectimage(i: number) {
    let pageindex = 0;
    if (this.page > 0) {
      pageindex = this.page - 1 * (this.page > 1 ? this.pageSize : 0) + i;
    }
    if (this.images[i]) {
      let selimg = this.images[i];

      //console.log(this.selectedimages);

      let indexval = this.selectedimages.findIndex((res) => res.id === selimg.id);
      //console.log(indexval);
      if (indexval >= 0) {
        delete selimg.select;
        this.selectedimages.splice(indexval, 1);
      } else {
        selimg.select = true;
        this.selectedimages.push(selimg);
      }
      //console.log(this.selectedimages);
    }
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
        const filesize = file.size / 1024 / 1024;
        //const ratio = ((Number(img.width) / Number(img.height)) + '').slice(0, 3)
        if (filesize > 2) {
          this.progressInfos[idx].msg = 'File not upload.. Please upload below 2 MB file';
          this.progressInfos[idx].color = 'red';
          this.progressInfos[idx].value = 100;
          return;
        } else if (Number(img.width) < 800) {
          this.toast.failure('Please upload the image of minimum width 800px');
          this.progressInfos[idx].color = 'red';
          this.progressInfos[idx].value = 100;
          return;
        }
        // else if (ratio !== '0.6') {
        //   this.progressInfos[idx].msg = 'File not upload.. Image ratio mismatch..'
        //   this.progressInfos[idx].color = 'red';
        //   this.progressInfos[idx].value = 100;
        //   return;
        // }
        else {
          this.progressInfos[idx].value = 50;
          const formd: any = new FormData();
          formd.append('image', file);
          this.productservice.saveGallery(this.selproduct.uuid, formd).subscribe({
            next: (resp) => {
              this.progressInfos[idx].msg = 'Successfully Upload';
              this.progressInfos[idx].color = 'green';
              this.progressInfos[idx].value = 100;
              this.images.push(resp);
              //this.cdr.detectChanges();
              //this.toast.success('Successfully Updated');
            },
            error: (err) => {
              this.toast.failure(err);
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

  // formsubmit() {
  //   ////console.log(this.selvariantvalue)
  //   if (this.showsingleimg === true) {
  //     this.newimage()
  //   } else {
  //     const selectedimages = this.selectedimages[this.selvariantvalue].filter((res: any) => res.select === true)
  //     const insertitmeimages: any = {}
  //     insertitmeimages[this.selvariantvalue] = selectedimages
  //     this.webteamservice.saveitemimages(this.qcgroupid, insertitmeimages)
  //       .subscribe(res => {
  //         this.toast.success('Successfully Updated');
  //         this.popupclose()
  //         this.view()
  //       })
  //   }

  // }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      var mimeType = event.target.files[0].type;
      //console.log(mimeType);
      if (!mimeType.match('image.*')) {
        this.toast.failure('Upload Image only');
        return;
      } else {
        this.addfile = file;
        const formsize: any = new FormData();
        formsize.append('sizechart', this.addfile);
        this.productservice.savesizechart(this.selproduct.uuid, formsize).subscribe({
          next: (resp) => {
            this.fileName = resp;
            this.toast.success('Successfully Updated');
            //this.cdr.detectChanges();
          },
          error: (err) => {
            this.toast.failure(err);
          }
        });
      }
    }
  }

  sizechart(event: any) {
    this.nosizechart = event.target.checked;
  }
}
