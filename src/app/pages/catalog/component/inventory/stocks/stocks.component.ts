import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { environment } from 'src/environments/environment';
import { Group } from '../../../models/inventory';
import { Item, Itemlist, Itemmoredetails } from '../../../models/item';
import { Product, Productimage, Productmapparam } from '../../../models/product';
import { Productvariants } from '../../../models/productvariants';
import { WebteamService } from '../../../services/webteam.service';
import { InventoryService } from '../../../services/inventory.service';
import { Store } from '../../../models/store';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, NgSelectModule, NgIf, NgFor, RouterModule, NgbPaginationModule]
})
export class StocksComponent implements OnInit {
  item: Item = {};
  itemlist: Itemlist = {};

  submit: boolean = false;
  gsubmit: boolean = false;
  groupForm!: FormGroup;
  variants: Productvariants[] = [];
  varinatupdate: any = {};
  variantslist: Productvariants[] = [];
  selectvariant: Productvariants = {};
  isValidImage!: boolean;
  selvariantvalue = 0;
  parameters: Productmapparam[] = [];
  groups: Group[] = [];
  images: Productimage[] = [];
  refimages: Productimage[] = [];
  insertedimages: any = { 0: [] };
  selectedimages: any = { 0: [] };
  addimage: string = '';
  defimage = '';
  baseurl: string = '';
  qcgroupid = '';
  department = '';
  product: Product = {};
  itemlists: Itemlist[] = [];
  itemMoredetails: Itemmoredetails[] = [];
  showsingleimg = false;

  allvariants: Array<{ id: string; name: string }> = [];
  statuses = ['Active', 'Inactive'];
  //allvariants= new Map<number, Productimage[]>();

  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];

  step: number = 1;

  addstockForm: any;

  //Newly Added//
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 50;
  pageSizes = [10, 30, 50, 100];
  imageload: boolean = false;
  uploadimages: string[] = [];
  myForm: any;
  videos: any;
  vcount: number;
  insertedvideo: any = { 0: [] };
  selectedvideo: any = { 0: [] };
  video: any;
  selectVideos: string = '';
  selectedPath: string = '';
  warehouse: Store[] = []

  show_type: Array<{ id: string; name: string }> = [
    { id: 'Web', name: 'Web' },
    { id: 'Mobile', name: 'Mobile' },
    { id: 'Both', name: 'Both' }
  ];
  productslist: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private webteamservice: WebteamService,
    private toast: ToastService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private utlis: UtilsService,
    private inventory: InventoryService,

  ) { }

  ngOnInit(): void {
    this.baseurl = environment.CATALOG_URL;
    this.groupForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      tags: [''],
      department_id: ['']
    });
    this.addstockForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      name_ta: [''],
      qty: [''],
      description_ta: [''],
      show_type: [''],
      store_id: [''],
      slug: ['', [Validators.required]]
      // group: ['', [Validators.required]],
      // variantlist: this.fb.array([]),
      // variantgroup_id: [0],
      // keywords: ['', [Validators.required]],
      // status: ['', [Validators.required]],
      // moredetails: this.fb.array([]),
      // images: this.fb.array([]),
      // defualtimage: [{}]
    });
    this.myForm = new FormGroup({
      productid: new FormControl('', [Validators.required]),
      fileSource: new FormControl()
    });
    this.view();
    this.webteamservice.getWarehouses().subscribe({
      next: (data) => {

        this.warehouse = data;

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
        // console.log(this.selectedFiles[i]);
        if (this.selectedFiles[i].type === 'video/mp4') {
          this.uploadVideo(i, this.selectedFiles[i]);
        } else {
          this.upload(i, this.selectedFiles[i]);
        }
      }
    }
  }

  getqty(event: any) {
    this.addstockForm.get('qty').setValue(event)
  }
  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 10, fileName: file.name, color: 'blue' };
    this.progressInfos[idx].value = 50;
    const formd: any = new FormData();
    formd.append('image', file);
    this.webteamservice.savetoGallery(this.qcgroupid, formd).subscribe({
      next: (resp) => {
        this.progressInfos[idx].msg = 'Successfully Upload';
        this.progressInfos[idx].color = 'green';
        this.progressInfos[idx].value = 100;
        let lastname = resp.path?.split('/').pop();
        let imgname = lastname?.split('__');
        let imgnam = imgname?.pop() || '';
        resp.name = decodeURIComponent(imgnam);
        this.images.push(resp);
        this.cdr.detectChanges();
        // this.imageload = true;
        //this.toast.success('Successfully Updated');
      },
      error: (err) => {
        this.toast.failure(err.error.message);
      },
      complete: () => {
        setTimeout(() => {
          this.progressInfos = [];
        }, 3000);
      }
    });
    return;
    if (file) {
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const filesize = file.size / 1024 / 1024;
        const ratio = (Number(img.width) / Number(img.height) + '').slice(0, 3);
        if (filesize > 2) {
          this.progressInfos[idx].msg = 'File not upload.. Please upload below 2 MB file';
          this.progressInfos[idx].color = 'red';
          this.progressInfos[idx].value = 100;
          return;
        } else if (Number(img.width) < 800) {
          this.toast.failure('Please upload the image width greater than 800px');
          this.progressInfos[idx].color = 'red';
          this.progressInfos[idx].value = 100;
          return;
        } else if (ratio !== '0.6') {
          this.progressInfos[idx].msg = 'File not upload.. Image ratio mismatch..';
          this.progressInfos[idx].color = 'red';
          this.progressInfos[idx].value = 100;
          return;
        } else {
          this.progressInfos[idx].value = 50;
          const formd: any = new FormData();
          formd.append('image', file);
          this.webteamservice.savetoGallery(this.qcgroupid, formd).subscribe({
            next: (resp) => {
              this.progressInfos[idx].msg = 'Successfully Upload';
              this.progressInfos[idx].color = 'green';
              this.progressInfos[idx].value = 100;
              let lastname = resp.path?.split('/').pop();
              let imgname = lastname?.split('__');
              let imgnam = imgname?.pop() || '';
              resp.name = decodeURIComponent(imgnam);
              this.images.push(resp);
              //this.toast.success('Successfully Updated');
            },
            error: (err) => {
              this.toast.failure(err.error.message);
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
  }
  uploadVideo(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 10, fileName: file.name, color: 'blue' };
    if (file) {
      this.progressInfos[idx].value = 50;
      const formd: any = new FormData();
      formd.append('video', file);
      this.webteamservice.savetovGallery(this.qcgroupid, formd).subscribe({
        next: (resp) => {
          this.progressInfos[idx].msg = 'Successfully Upload';
          this.progressInfos[idx].color = 'green';
          this.progressInfos[idx].value = 100;
          let lastname = resp.path?.split('/').pop();
          let imgname = lastname?.split('__');
          let imgnam = imgname?.pop() || '';
          resp.name = decodeURIComponent(imgnam);
          this.videos.push(resp);
          this.cdr.detectChanges();
          //this.toast.success('Successfully Updated');
        },
        error: (err) => {
          this.toast.failure(err.error.message);
        },
        complete: () => {
          setTimeout(() => {
            this.progressInfos = [];
          }, 3000);
        }
      });
    }
  }

  addImageProcess(src: any, index: number) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  validateImage(idx: number, file: File, selimg: any) {
    this.isValidImage = true;
    // let img = document.createElement('img');
    // img.src = URL.createObjectURL(file);
    this.addImageProcess(file.name, idx).then((img: any) => {
      const filesize = file.size / 1024 / 1024;
      const ratio = (Number(img.width) / Number(img.height) + '').slice(0, 3);
      /* if (filesize > 2) {
        this.progressInfos[idx].msg = 'File not upload.. Please upload below 2 MB file';
        this.progressInfos[idx].color = 'red';
        this.progressInfos[idx].value = 100;
        isValidImage = false;
        return;
      }
      else  */
      if (Number(img.width) < 800) {
        this.toast.failure('Please upload the image width greater than 800px');
        this.isValidImage = false;
        return;
      } else if (ratio !== '0.6') {
        this.toast.failure('Image ratio mismatch');
        this.isValidImage = false;
        return;
      } else {
        this.isValidImage = true;
      }
      this.canProceed(idx, selimg);
    });
  }

  view() {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (!uuid) {
      this.router.navigate(['/catalog/stocks/:uuid']);
    } else {
      this.qcgroupid = uuid;
      this.webteamservice.finditemlist(uuid).subscribe({
        next: (items) => {
          this.productslist = items.product

          this.addstockForm.get('show_type')?.setValue(this.productslist.show_type);
          this.addstockForm.get('store_id')?.setValue(this.productslist.store_id);
          this.addstockForm.get('slug')?.setValue(items.slug);
          this.item = items.item || {};
          this.itemlist = items.itemlist || {};
          this.addstockForm.get('qty').setValue(this.itemlist.quantity)

          this.department = this.item.department_id + '';
          this.refimages = items.refproductimages || [];
          this.product = items.product || {};
          this.itemMoredetails = items.itemmoredetails || [];
          this.variantslist = items.variantlist;
          // this.cdr.detectChanges();
          ///.map((val: any) => { return val.productvariant })
          //this.variantslist.unshift({ id: 0, name: 'No Group', productvariantvalues: [{}] })
          let availablevariant: any[] = [];
          if (items.itemlist && items.itemlist.sku) {
            availablevariant = items.itemlist.sku.split('_');
          }
          //console.log(availablevariant)
          if (items.variantlist && items.variantlist.length > 0) {
            this.variants = items.variantlist;
            items.variantlist.map((val: any) => {
              if (val.showtype == 'Image') {
                val.productvariantvalues.map((pvalue: any) => {
                  if (availablevariant.indexOf(pvalue.id + '') >= 0) this.selvariantvalue = pvalue.id;
                });
              }

              // this.varinatupdate[val.id] = { name: val.name }
              // return val.productvariantvalues.map((pvalue: any) => {
              //   if (availablevariant.indexOf(pvalue.value)) {
              //     this.varinatupdate[val.id]['value'] = pvalue.value
              //   }
              //   return (pvalue.value)
              // })
            });
          }
          if (items.productimages) {
            this.images = items.productimages; //.datas || []
            this.images.map((imgobj) => {
              let lastname = imgobj.path?.split('/').pop();
              let imgname = lastname?.split('__');
              let imgnam = imgname?.pop() || '';
              imgobj.name = decodeURIComponent(imgnam);
            });
            this.count = 0; //items.images.totalItems;
          }
          if (items.parameterlist && items.parameterlist.length > 0) {
            this.parameters = items.parameterlist;
          }
          // if (items.itemlist && items.itemlist.length > 0) {
          //   this.itemlists = items.itemlist
          //   items.itemlist.forEach((val: any, key: number) => {
          //     //this.variantfield(val.id, val.mrp, val.price)
          //     this.itemlists[key]['variantvalue'] = (val.sku).split('_').map((val: any) => (val.replace('-', ' ')).toUpperCase())
          //   });
          // }
          // if (items.itemmoredetails && items.itemmoredetails.length > 0) {
          //   items.itemmoredetails.forEach((val: any, key: number) => {
          //     this.moredatafield(val.item_id, val.title, val.description)
          //   });
          // }
          if (items.videolist) {
            this.videos = items.videolist; //.datas || []
            this.videos.map((vobj: any) => {
              let vlastname = vobj.path?.split('/').pop();
              let vname = vlastname?.split('__');
              let vnam = vname?.pop() || '';
              vobj.name = decodeURIComponent(vnam);
            });
            this.vcount = 0;
          }
          if (this.item.id) {
            this.addstockForm.get('id')?.setValue(this.item.id);
            this.addstockForm.get('name')?.setValue(this.item.name || '');
            this.addstockForm.get('description')?.setValue(this.item.description || '');
            this.addstockForm.get('name_ta')?.setValue(this.item.name_ta || '');
            this.addstockForm.get('description_ta')?.setValue(this.item.description_ta || '');
            this.addstockForm.get('qty')?.setValue(this.item.quantity || '');
            this.addstockForm.get('show_type')?.setValue(this.productslist.show_type || this.item.show_type);
            this.addstockForm.get('store_id')?.setValue(this.item.store_id || this.productslist.store_id);
            this.addstockForm.get('slug')?.setValue(this.item.slug);
            // this.addstockForm.get('keywords')?.setValue(this.item.keywords || '')
            // this.addstockForm.get('group')?.setValue(this.item.group_id || '')
            // this.addstockForm.get('status')?.setValue(this.item.status || '')
            // this.addstockForm.get('variantgroup_id')?.setValue(this.item.variantgroup_id || 0)
            this.defimage = this.item.path || '';
            //this.defimage.id = this.item.image_id || 0
            if (items.itemimagelist) {
              //if(this.selectedimages[0].length == 0)
              //{}
              items.itemimagelist.forEach((val: any) => {
                if (!this.insertedimages[val.variantvalue_id]) {
                  this.insertedimages[val.variantvalue_id] = [];
                }

                this.insertedimages[val.variantvalue_id].push({
                  iimid: val.id,
                  id: val.image_id,
                  variantvalue_id: val.variantvalue_id,
                  path: val.path
                });
                this.selvariantvalue = val.variantvalue_id
              });

              this.cdr.detectChanges()
              // console.log('this.insertedimages', this.insertedimages,  this.selvariantvalue)
            }
          }
          if (this.item.vpath != '') {
            let vlastname = this.item.vpath?.split('/').pop();
            let vname = vlastname?.split('__');
            let vnam = vname?.pop() || '';
            this.selectVideos = decodeURIComponent(vnam);
            this.selectedPath = this.item.vpath;
            // console.log('sel=>', this.selectedPath);
          }
          //this.moredatafield()
          this.selectedVariants();
        },
        error: (err) => {
          let msg = err.error.message ? err.error.message : 'Item not found';
          this.item = {};
          this.toast.failure(msg);
          this.router.navigate(['/app']);
        }
      });
    }
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      //this.stockapprove.image = file
    }
  }

  onSelectedImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          // Push Base64 string
          this.images.push(event.target.result);
          this.patchValues();
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }

    /*var reader = new FileReader();
    //Read the contents of Image File.
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let img = new Image()
      img.src = window.URL.createObjectURL(file)
      img.onload = () => {
        const filesize = file.size / 1024 / 1024
        if (filesize > 1) {
          this.toast.failure('File not upload.. Please upload below 1 MB file');
          return;
        }
        else if (Number(img.width) < 1100 || Number(img.height) < 1100) {
          this.toast.failure('Please upload the image Ratio Pixel Size (Width x Height) greater than 1100px');
          return;
        }
        else {
          this.addimage = file
          this.newimage()
        }
      }
    } */
  }

  patchValues() {
    this.myForm.patchValue({
      fileSource: this.uploadimages
    });
  }
  formsubmit() {
    //console.log(this.selvariantvalue)
    if (this.showsingleimg === true) {
      this.newimage();
    } else {
      if (this.selectedimages.length <= 0) {
        this.toast.info('dslkdjl');
      } else {
        // console.log(this.selectedimages.length);

        const selectedimages = this.selectedimages[this.selvariantvalue].filter((res: any) => res.select === true);
        const insertitmeimages: any = {};
        insertitmeimages[this.selvariantvalue] = selectedimages;
        // console.log(this.qcgroupid, insertitmeimages);
        this.webteamservice.saveitemimages(this.qcgroupid, insertitmeimages).subscribe((res) => {
          this.toast.success('Successfully Updated');
          this.popupclose();
          window.location.reload();
          // this.view()
        });
      }
    }
  }
  /*newimage() {
    const formd: any = new FormData();
    formd.append('image', this.addimage);
    this.webteamservice.savetoGallery(this.itemlistuuid, formd).subscribe({
      next: resp => {
        this.addimage = '';
        if (this.showsingleimg === true) {
          this.defimage = resp;
        } else {
          //resp.variantvalue_id = this.selvariantvalue;
          //this.selectedimages[this.itemlistuuid].push(Object.assign({ variantvalue_id: this.selvariantvalue }, resp))
        }
        this.images.push(resp)
        this.toast.success('Successfully Updated');
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    });
  }
  onSelectedImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addimage = file
      this.newimage()
    }
  }*/

  newimage() {
    //const formd: any = new FormData();
    ///formd.append('image', this.defimage);
    const imagedata = { image: this.defimage };
    this.webteamservice.savedefaultimage(this.qcgroupid, imagedata).subscribe({
      next: (resp) => {
        this.addimage = '';
        this.view();
        this.popupclose();
        this.toast.success('Successfully Updated');
        // this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.failure(err.error.message);
      }
    });
  }
  popupclose() {
    this.showsingleimg = false;
    this.modalService.dismissAll();
  }

  viewGroup(content: any): void {
    const modelref = this.modalService.open(content, { size: 'lg' });
  }
  openGallery(content: any, type = ''): void {
    this.showsingleimg = type == 'Single' ? true : false;

    const modelref = this.modalService.open(content, { size: 'lg' });
  }
  variantGallery(content: any, variantvalueid = 0): void {
    //this.selvariantvalue = variantvalueid;
    // console.log(this.imageload);
    // if (this.imageload) {
    const modelref = this.modalService.open(content, { size: 'lg' });
    // } 
    // else {
    //   this.toast.failure('Please add Image');
    // }
  }
  videoGallery(content: any, variantvalueid = 0): void {
    //this.selvariantvalue = variantvalueid;
    const modelref = this.modalService.open(content, { size: 'md' });
  }
  get form() {
    return this.groupForm.controls;
  }
  // variantdata(): FormArray {
  //   return this.addstockForm.get('variantlist') as FormArray;
  // }
  // variantfield(id: number, mrp: number, price: number) {
  //   this.variantdata().push(
  //     this.fb.group(
  //       {
  //         id: [id],
  //         mrp: [mrp, [Validators.required, Validators.pattern('[0-9]*[.]?[0-9]+')]],
  //         price: [price, [Validators.required, Validators.pattern('[0-9]*[.]?[0-9]+')]]
  //       })
  //   )
  // }
  // moredetaildata(): FormArray {
  //   return this.addstockForm.get('moredetails') as FormArray;
  // }
  // moredatafield(id = '', title = '', description = '') {
  //   this.moredetaildata().push(
  //     this.fb.group(
  //       {
  //         id: [id],
  //         title: [title],
  //         description: [description]
  //       })
  //   )
  // }

  cancelAction(): void {
    this.modalService.dismissAll();
  }
  get stockform() {
    return this.addstockForm.controls;
  }
  // saveGroup() {
  //   this.gsubmit = true;
  //   if (this.groupForm.invalid) {
  //     return;
  //   }
  //   this.groupForm.get('department_id')?.setValue(this.department)
  //   this.webteamservice.creategroup(this.groupForm.value).subscribe({
  //     next: resp => {
  //       this.toast.success('Group Created Successfully');
  //       this.groupForm.reset();
  //       //this.variantdata().clear();
  //       //this.parameterdata().clear();
  //       this.modalService.dismissAll();
  //       this.groups = [...this.groups, resp]
  //       this.addstockForm.get('group')?.setValue((resp?.id) + '')
  //     }, error: (err: any) => {
  //       this.toast.failure(err.error.message);
  //     }
  //   })
  // }
  saveStock() {
    // console.log("slug",this.addstockForm.value);

    this.submit = true;
    if (this.addstockForm.invalid) {
      return;

    }
    let item = Object.assign({}, this.addstockForm.value);
    //item.defualtimage = this.defimage
    // let selectimages: any = []
    // Object.keys(this.selectedimages).forEach((variantid: any, key: number) => {
    //   if ((this.selectedimages[variantid]).length > 0) {
    //     selectimages.push(...this.selectedimages[variantid])
    //   }
    // })
    //item.images = selectimages;
    this.webteamservice.saveitemstock(item, this.qcgroupid).subscribe({
      next: (resp) => {
        this.toast.success('Stock added successfully');
        this.groupForm.reset();
        this.modalService.dismissAll();
        window.location.reload()
        // this.cdr.detectChanges();
        //this.addstockForm.reset()
        //this.router.navigate(['/app/stocks']);
      },
      error: (err: any) => {
        // console.log(err);
        this.toast.failure("Something Went Wrong");
      }
    });
  }
  findgroupname() {
    let group = this.groups.find((res) => res.id + '' === this.groupForm.get('group')?.value + '');
    return group?.name;
  }
  async selectimage(i: number) {
    let result = null;
    if (!this.selectedimages[this.selvariantvalue]) {
      this.selectedimages[this.selvariantvalue] = [];
    }
    if (this.images[i]) {
      let selimg = this.images[i];
      let selImagePath = selimg.path as string;
      if (selimg) {
        let blob = new Blob();
        /*  let myHeaders = new Headers({
           'Content-Type': 'image/jpg'
         });
         let blob = fetch(selImagePath, { mode: 'cors', headers: myHeaders }).then(res => {
           //console.log(res);
           return res;
         }); */
        let type = selImagePath.slice(selImagePath.lastIndexOf('.') + 1);
        if (type === 'jpg') {
          type = 'jpeg';
        }
        const file = new File([], selImagePath, {
          type: `image/${type}`
        });
        await this.validateImage(i, file, selimg);
      }
    }
    //this.addstockForm.get('images')?.setValue(this.selectedimages)
  }

  async selectvideo(i: number) {
    // console.log(i);
  }

  canProceed(i: number, selimg: any) {
    if (this.isValidImage) {
      if (this.showsingleimg === true) {
        this.defimage = selimg.path || '';
        this.images.map((imgres) => {
          Object.assign(imgres, { select: false });
        });
        this.images[i]['select'] = this.images[i]['select'] === true ? false : true;
      } else {
        this.images[i]['select'] = this.images[i]['select'] === true ? false : true;
        let indexval = this.selectedimages[this.selvariantvalue].findIndex((res: any) => res.id === selimg.id);
        if (indexval >= 0) {
          this.selectedimages[this.selvariantvalue].splice(indexval, 1);
        } else {
          this.selectedimages[this.selvariantvalue].push(Object.assign({ variantvalue_id: this.selvariantvalue }, selimg));
        }
      }
    }
  }
  removeimage(i: number, imageid = 0) {
    if (confirm('Are you sure you want to delete this image?')) {
      this.webteamservice.removeImage(imageid).subscribe({
        next: (resp) => {
          this.insertedimages[this.selvariantvalue].splice(i, 1);
          this.toast.success('Successfully removed');
          // this.cdr.detectChanges();
        }
      });
    }
  }

  // removeMoreField(i: number) {
  //   if (confirm('Are you sure you want to delete this element?')) {
  //     this.moredetaildata().removeAt(i);
  //   }
  // }
  next(i: number) {
    this.step = i;
  }

  // Newly Added //
  handlePageChange(event: number): void {
    this.page = event;
    this.view();
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.view();
  }
  selectedVariants() {
    let variantgroup = this.addstockForm.get('variantgroup_id')?.value || 0;
    let resp: Productvariants = this.variantslist.find((res) => res.id === variantgroup) || {};
    this.selectvariant = resp;
  }
  videosubmit() {
    // console.log(this.selvariantvalue,this.videos)
    // const selectedvideo = this.videos.filter((res: any) => res.path === this.video)
    // const insertitmevideo: any = {}
    // insertitmevideo[this.selvariantvalue] = selectedvideo
    // console.log(this.qcgroupid, " => ", insertitmevideo)
    const videodata = { video: this.video };
    // console.log(videodata.video);
    this.webteamservice.savedefaultvideo(this.qcgroupid, videodata).subscribe({
      next: (resp) => {
        //this.view()
        this.popupclose();
        this.toast.success('Successfully Updated');
        this.listrefresh();
        // this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.failure(err.error.message);
      }
    });
  }
  onChange(e: any) {
    this.video = e.target.value;
  }
  listrefresh() {
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (!uuid) {
      this.router.navigate(['/catalog/stocks/:uuid']);
    } else {
      this.qcgroupid = uuid;
      this.webteamservice.finditemlist(uuid).subscribe({
        next: (items) => {
          // console.log('path items =>', items.item);

          if (items.videolist) {
            this.videos = items.videolist; //.datas || []
            this.videos.map((vobj: any) => {
              let vlastname = vobj.path?.split('/').pop();
              let vname = vlastname?.split('__');
              let vnam = vname?.pop() || '';
              vobj.name = decodeURIComponent(vnam);
            });
            this.vcount = 0;
            // this.cdr.detectChanges();
          }

          if (items.item.vpath != '') {
            let vlastname = items.item.vpath.split('/').pop();
            let vname = vlastname?.split('__');
            let vnam = vname?.pop() || '';
            this.selectVideos = decodeURIComponent(vnam);
            this.selectedPath = items.item.vpath;
          }
          // this.cdr.detectChanges();
        },
        error: (err) => {
          let msg = err.error.message ? err.error.message : 'Item not found';
          this.item = {};
          this.toast.failure(msg);
          this.router.navigate(['/app']);
        }
      });
    }
  }
}
