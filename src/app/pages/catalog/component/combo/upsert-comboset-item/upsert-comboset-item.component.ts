import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/_helpers/toast.service';
import { BULKORDER } from '../../../models/combo';
import { Department } from '../../../models/department';
import { Group } from '../../../models/groups';
import { Item } from '../../../models/item';
import { Product, Productimage, Productvariants } from '../../../models/product';
import { ComboService } from '../../../services/combo.service';
import { DepartmentsService } from '../../../services/departments.service';
import { ProductsService } from '../../../services/products.service';
import { WebteamService } from '../../../services/webteam.service';

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-upsert-comboset-item',
  templateUrl: './upsert-comboset-item.component.html',
  styleUrls: ['./upsert-comboset-item.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule]
})
export class UpsertCombosetItemComponent implements OnInit {
  hideme: boolean[] = [];
  formData!: FormGroup;
  formDataitem!: FormGroup;
  combo!: BULKORDER.Combo;
  comboSet?: Partial<BULKORDER.ComboSet[]>;
  selectedComboSet?: Partial<BULKORDER.ComboSet>;
  currentComboSet?: Partial<BULKORDER.ComboSet>;
  comboItems: BULKORDER.ComboItem[] = [];
  currentComboItems: BULKORDER.ComboItem[] = [];
  selectedDept = '';
  selectedGroup = '';
  groups: Group[] = [];
  departments: Department[] = []
  skuids: Item[] = [];
  currentComboId!: number;
  currentComboSetID !: number;
  currentComboSetlistuuid !: string;
  model: any;
  searching = false;
  searchFailed = false;
  isValidImage!: boolean;
  product: Product = {}
  currentExpandedIndex = -1;
  comboSetDropDown: any[] = [];
  selectedimages: any[] = [];
  singleSelectDisabled: boolean = true;
  lastselimg: any = {};

  defimage = '';
  selvariantvalue = 0;
  insertedimages: any = { 0: [] };

  selectvariant: Productvariants = {};
  products: Product[] = [];
  page = 1;
  count = 0;
  pageSize = 20;
  pageSizes = [20, 30, 50, 100];
  message: string[] = [];
  showsingleimg = false;
  progressInfos: any[] = [];
  selectedFiles?: FileList;
  previews: string[] = [];
  isClothing = false;
  price!: number;
  mrp!: number;
  offer!: number;
  img!: string;

  images: Productimage[] = [];
  search: OperatorFunction<string, readonly Product[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.comboService.productsearch(term).pipe(
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
  formatter = (x: any) => x.uuid;



  constructor(private formBuilder: FormBuilder, private cdr: ChangeDetectorRef, private productservice: ProductsService, private departmentservice: DepartmentsService, private webteamservice: WebteamService, private modalService: NgbModal, private router: Router, private toast: ToastService, private comboService: ComboService, private route: ActivatedRoute,
  ) { }

  get form() {
    return this.formData.controls;
  }


  ngOnInit(): void {
    let id: any = this.route.snapshot.paramMap.get('id') || '';
    this.currentComboId = id;
    this.formData = this.formBuilder.group({
      combo_id: [id],
      name: ['', [Validators.required, Validators.minLength(1)]],
      title: ['', [Validators.required, Validators.minLength(5)]],
      title_ta: [''],
      description: ['', [Validators.required, Validators.minLength(20)]],
      description_ta: [''],
      // dept: ['', [Validators.required]],
      // group: ['', this.isClothing ? [Validators.required] : '']
    });


    this.formDataitem = this.formBuilder.group({
      id: [''],
      combo_id: [null],
      comboset_id: [null],
      group_id: ['', [Validators.required]],
      product_id: ['', [Validators.required]],
      //itemlist_id: [null],
      itemslist_uuid: [null],
      price: [0, [Validators.required]]
    });

    if (id != '') {
      this.getComboSetItems(id);
    }

    this.departmentservice.findList()
      .subscribe({
        next: data => {
          this.departments = data;
          // this.cdr.detectChanges();
        },
        error: () => {
          this.departments = []
        }
      });
  }


  changeGroup(group: any) {
    if (group) {
      this.selectedGroup = group.id;
    }
    else {
      this.selectedGroup = ''
    }
  }


  getComboSetItems(id: number) {
    this.comboService.getCombo(id).subscribe({
      next: (resp) => {
        if (resp && resp.data) {
          this.combo = resp.data as BULKORDER.Combo;
          this.comboSet = resp.data.combosets as BULKORDER.ComboSet[];
          this.comboSetDropDown = this.formComboSetDropDown(this.comboSet as []) as [];
          this.comboItems = resp.data.combosets.comboitems as BULKORDER.ComboItem[];
          /*      this.formData.controls['name'].setValue(this.comboSet?.name);
               this.formDataitem.controls['combo_id'].setValue(this.comboSet?.id); */
          // this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.toast.failure(err.error.message);
      }
    })
  }

  // Forming Combo Sets dropdown
  formComboSetDropDown(comboSets: BULKORDER.ComboSet[]) {
    return comboSets.map(comboSet => {
      return {
        displayName: comboSet.name,
        value: comboSet.id
      };
    });
  }

  // On combo set dropdown change
  onTypeChange(dropDownWholeModel: any) {
    this.currentComboSetID = dropDownWholeModel.value;
  }

  itemSelected($event: any) {
    const proval = $event.item
    this.product = proval
    this.skuids = [];
    this.formDataitem.controls['itemslist_uuid'].setValue('');// check
    this.price = 0;
    this.mrp = 0;
    this.img = ''
    //this.formDataitem.controls['itemlist_id'].setValue('');
    this.formDataitem.controls['itemslist_uuid'].setValue('');
    this.formDataitem.controls['product_id'].setValue(proval.pid);
    this.formDataitem.controls['group_id'].setValue(proval.group?.id);
    this.comboService.getItemlist(proval.pid).subscribe({
      next: (resp) => {
        if (resp && resp.length) {
          this.skuids = resp
          //this.formDataitem.controls['itemlist_id'].setValue(this.skuids[0].id);// check
          this.formDataitem.controls['itemslist_uuid'].setValue(this.skuids[0].itemslist?.uuid);// check
          this.price = this.skuids[0].price || 0;
          this.mrp = this.skuids[0].mrp || 0;
          this.img = this.skuids[0] && this.skuids[0]?.path && this.skuids[0]?.path || '';
          // this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.toast.failure(err.error.message);
      }
    })
    // let groupids = this.products.map((x: any) => x.id);
    // if (groupids.includes(proval.id) == false) {
    //   this.products.push(proval);
    // }

  }

  changeskuid($event: any) {
    let selectValue = this.formDataitem.get('itemslist_uuid')?.value;
    let finditem = this.skuids.find(res => res.itemslist?.uuid === selectValue)
    //console.log(finditem)
    if (finditem) {
      this.formDataitem.controls['itemslist_uuid'].setValue(finditem?.itemslist?.uuid);// check
      this.price = finditem.price || 0;
      this.mrp = finditem.mrp || 0;
      this.img = finditem && finditem?.path && finditem?.path || '';
    }
  }

  editComboSet(comboSet: any) {
    this.formData.controls['combo_id'].setValue(this.currentComboId);
    this.formData = this.formBuilder.group({
      id: [comboSet.id],
      combo_id: [comboSet.combo_id],
      name: [comboSet.name],
      description: [comboSet?.description],
      title: [comboSet?.title],
      title_ta: [comboSet?.title_ta],
      description_ta: [comboSet?.description_ta],
      // dept: ['', [Validators.required]],
      // group: ['', this.isClothing ? [Validators.required] : '']
    });
  }


  publishComboSet(comboSet: BULKORDER.ComboSet | any, comboSetIndex: number) {
    if (comboSet?.comboitems && comboSet?.comboitems.length < 2) {
      this.toast.failure('Minimum two items are required to publish')
      return;
    }
    this.comboService.publishComboSet(this.currentComboSetID || comboSet?.id).subscribe({
      next: (resp: any) => {
        if (resp && resp.message) {
          this.toast.success(resp.message);
          this.getComboSetItems(this.currentComboId);
        }
        // this.cdr.detectChanges();
      },
      error: (err: any) => {
        if (err && err.error && err.error.message) {
          this.toast.failure(err.error.message);
        } else {
          this.toast.failure('Error Saving Combo Set');
        }
      }
    });
  }


  unpublishComboSet(comboSet: BULKORDER.ComboSet | any, comboSetIndex: number) {

    this.comboService.unpublishComboSet(this.currentComboSetID || comboSet?.id).subscribe({
      next: (resp: any) => {
        if (resp && resp.message) {
          this.toast.success(resp.message);
          this.getComboSetItems(this.currentComboId);
        }
        // this.cdr.detectChanges();
      },
      error: (err: any) => {
        if (err && err.error && err.error.message) {
          this.toast.failure(err.error.message);
        } else {
          this.toast.failure('Error UnPublishing Combo Set');
        }
      }
    });
  }

  saveComboSet() {
    let comboSet: BULKORDER.ComboSet;
    if (this.formData.invalid) {
      //console.log(this.formData);
      return;
    }

    this.formData.controls['combo_id'].setValue(this.currentComboId);// combo id
    this.comboService.createComboSet(this.formData.value).subscribe({
      next: (resp: any) => {
        if (resp && resp.data) {
          this.currentComboSet = resp.data as Partial<BULKORDER.ComboSet>;
          this.formDataitem.controls['combo_id'].setValue(this.currentComboId || this.currentComboSet?.combo_id);// combo id
          this.formDataitem.controls['comboset_id'].setValue(this.currentComboSetID || this.currentComboSet?.id); // combo set id
          this.toast.success('Combo Set Saved Successfully ');
          this.getComboSetItems(this.currentComboId);
          this.formData.reset();
        }
        // this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.toast.failure('Error Saving Combo Set');
      }
    });
  }

  saveComboitem() {
    /*   if (!this.comboSet?.id) {
        this.toast.failure('Save comboitem after adding combo');
        return;
      } */
    if (this.formDataitem.invalid) {
      return;
    }
    this.formDataitem.controls['combo_id'].setValue(this.currentComboId || this.currentComboSet?.combo_id);// combo id
    this.formDataitem.controls['comboset_id'].setValue(this.currentComboSetID || this.currentComboSet?.id); // combo set id

    this.comboService.saveComboSetItem(this.formDataitem.value).subscribe({
      next: (resp: BULKORDER.ComboHttpResponse) => {
        if (resp && resp.data) {
          this.toast.success('Combo Set Item Added Successfully ');
          this.getComboSetItems(this.currentComboId);
        }
        // this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.failure('Failed to add combo set item, Try again!');
      }
    });
  }

  deleteComboItem(itemId: number) {
    this.comboService.deleteComboSetItem(+itemId).subscribe({
      next: (resp: BULKORDER.ComboHttpResponse) => {
        if (resp && resp.data) {
          this.toast.success('Combo Set Item Added Successfully ');
          this.getComboSetItems(this.currentComboId);
        }
        // this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.failure('Failed to add combo set item, Try again!');
      }
    });
  }

  openGallery(content: any, type = '', comboset: any): void {
    this.images = [];
    this.showsingleimg = type == 'Single' ? true : false;
    this.currentComboSetID = comboset.id;
    this.currentComboSetlistuuid = comboset?.itemslist_uuid;
    this.loadExistingImages();
    const modelref = this.modalService.open(content, { size: 'lg' });
  }

  popupclose() {
    this.showsingleimg = false;
    this.modalService.dismissAll()
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.uploadFiles()

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
      img.src = window.URL.createObjectURL(file)
      img.onload = () => {
        const filesize = file.size / 1024 / 1024
        const ratio = ((Number(img.width) / Number(img.height)) + '').slice(0, 3)
        if (filesize > 2) {
          this.progressInfos[idx].msg = 'File not upload.. Please upload below 2 MB file';
          this.progressInfos[idx].color = 'red';
          this.progressInfos[idx].value = 100;
          return;
        }
        else if (Number(img.width) < 800) {
          this.toast.failure('Please upload the image width greater than 800px');
          this.progressInfos[idx].color = 'red';
          this.progressInfos[idx].value = 100;
          return;
        }
        else if (ratio !== '0.6') {
          this.progressInfos[idx].msg = 'File not upload.. Image ratio mismatch..'
          this.progressInfos[idx].color = 'red';
          this.progressInfos[idx].value = 100;
          return;
        }
        else {
          this.progressInfos[idx].value = 50;
          const formd: any = new FormData();
          formd.append('image', file);

          // saveTogallery need to be replaced with new api 
          this.comboService.savetoGallery(this.currentComboSetlistuuid, formd).subscribe({
            next: resp => {
              this.progressInfos[idx].msg = 'Successfully Upload';
              this.progressInfos[idx].color = 'green';
              this.progressInfos[idx].value = 100;
              let lastname = resp.path?.split('/').pop()
              let imgname = lastname?.split('__')
              let imgnam = imgname?.pop() || ''
              resp.name = decodeURIComponent(imgnam);
              this.images.push(resp);
              // this.cdr.detectChanges();
              //this.toast.success('Successfully Updated');
            }, error: err => {
              this.toast.failure(err.error.message);
            }, complete: () => {

              setTimeout(() => {
                this.progressInfos = [];
              }, 3000)
            }
          });
        }
      }
    }
  }

  async selectimage(i: number) {
    let result = null;
    this.singleSelectDisabled = false;
    if (!this.selectedimages[this.selvariantvalue]) {
      this.selectedimages[this.selvariantvalue] = []
    }
    if (this.images[i]) {
      let selimg = this.images[i];
      let selImagePath = selimg.path as string;
      if (selimg) {
        let blob = new Blob()
        /*  let myHeaders = new Headers({
           'Content-Type': 'image/jpg'
         });
         let blob = fetch(selImagePath, { mode: 'cors', headers: myHeaders }).then(res => {
           //console.log(res);
           return res;
         }); */
        let type = selImagePath.slice(selImagePath.lastIndexOf('.') + 1)
        if (type === 'jpg') {
          type = 'jpeg';
        }
        const file = new File([], selImagePath, {
          type: `image/${type}`,
        });
        await this.validateImage(i, file, selimg);
      }


    }
    //this.addstockForm.get('images')?.setValue(this.selectedimages)
  }

  validateImage(idx: number, file: File, selimg: any) {
    this.isValidImage = true;

    this.addImageProcess(file.name, idx).then((img: any) => {
      const filesize = file.size / 1024 / 1024
      const ratio = ((Number(img.width) / Number(img.height)) + '').slice(0, 3)

      if (Number(img.width) < 800) {
        this.toast.failure('Please upload the image width greater than 800px');
        this.isValidImage = false;
        return;
      }
      else if (ratio !== '0.6') {
        this.toast.failure('Image ratio mismatch');
        this.isValidImage = false;
        return;
      } else {
        this.isValidImage = true;
      }
      this.canProceed(idx, selimg);
    })
  }

  canProceed(i: number, selimg: any) {
    if (this.isValidImage) {
      if (this.showsingleimg === true) {
        this.defimage = selimg.path || '';
        this.images.map(imgres => { Object.assign(imgres, { select: false }) })
        this.images[i]['select'] = this.images[i]['select'] === true ? false : true;
      } else {
        this.images[i]['select'] = this.images[i]['select'] === true ? false : true;
        let indexval = this.selectedimages[this.selvariantvalue].findIndex((res: any) => res.id === selimg.id)
        if (indexval >= 0) {
          this.selectedimages[this.selvariantvalue].splice(indexval, 1)
        } else {
          this.selectedimages[this.selvariantvalue].push(Object.assign({ variantvalue_id: this.selvariantvalue }, selimg))
        }
      }
    }
  }

  loadExistingImages() {
    this.comboService.getComboImageList(this.currentComboSetlistuuid).subscribe({
      next: resp => {
        if (resp && resp.data) {
          this.images = [...this.images, ...resp.data];
        }
        // this.cdr.detectChanges();
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    });
  }
  addImageProcess(src: any, index: number) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  removeimage(i: number, imageid = 0) {
    if (confirm('Are you sure you want to delete this image?')) {

      this.webteamservice.removeImage(imageid).subscribe({
        next: resp => {
          this.insertedimages[this.selvariantvalue].splice(i, 1)
          this.toast.success('Successfully removed');
          // this.cdr.detectChanges();
        }
      });
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
          // this.patchValues();
        }
        reader.readAsDataURL(event.target.files[i]);
      }

    }

  }



  // combo image form submit
  formsubmit() {
    //console.log(this.selvariantvalue)
    if (this.showsingleimg === true) {
      this.newimage()
    } else {
      const selectedimages = this.selectedimages[this.selvariantvalue].filter((res: any) => res.select === true)
      const insertitmeimages: any = {}
      insertitmeimages[this.selvariantvalue] = selectedimages
      insertitmeimages.comboset_id = this.currentComboSetID,
        this.comboService.saveitemimages(this.currentComboSetlistuuid, insertitmeimages)
          .subscribe(res => {
            this.toast.success('Successfully Updated');
            this.popupclose()
            //window.location.reload();

            this.getComboSetItems(this.currentComboId)
          })
    }

  }

  newimage() {

    //const formd: any = new FormData();
    ///formd.append('image', this.defimage);
    const imagedata = { comboset_id: this.currentComboSetID, image: this.defimage }
    this.comboService.savedefaultimage(this.currentComboSetlistuuid, imagedata).subscribe({
      next: resp => {
        this.popupclose()
        this.toast.success('Successfully Updated');
        //window.location.reload();
        this.getComboSetItems(this.currentComboId)
        // this.cdr.detectChanges();
      }, error: err => {
        this.toast.failure(err.error.message);
      }
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getComboSetItems(this.currentComboId);
  }
  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getComboSetItems(this.currentComboId);
  }

  /// ADVANCED TABLE ///
  changeValue(i: number) {
    this.hideme[i] = !this.hideme[i];
    this.selectedComboSet = this.comboSet && this.comboSet[i];
    this.currentComboItems = this.selectedComboSet?.comboitems as BULKORDER.ComboItem[];
  }


}
