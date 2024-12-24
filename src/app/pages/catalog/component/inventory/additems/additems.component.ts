import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Group } from '../../../models/inventory';
import { Item, Itemimage, Itemlist, Itemmoredetails } from '../../../models/item';
import { Product, Productimage, Productmapparam } from '../../../models/product';
import { Productvariants } from '../../../models/productvariants';
import { WebteamService } from '../../../services/webteam.service';

import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { TAGS } from '../../../models/tag';

import { SortableDirective, SortEvent } from 'src/app/_helpers/directives/advance-sortable.directive';
import { environment } from 'src/environments/environment';
import { MRPPriceValidatorDirective } from '../mrp-price-validator.directive';
import { PriceMRPValidatorDirective } from '../price-validator.directive';
import { SharedModule } from 'src/app/_themes/shared/shared.module';

@Component({
  selector: 'app-additems',
  templateUrl: './additems.component.html',
  styleUrls: ['./additems.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, NgbPaginationModule, SharedModule, PriceMRPValidatorDirective, MRPPriceValidatorDirective]
})
export class AdditemsComponent implements OnInit {
  public Editor: any;
  itemlists: Itemlist[] = [];
  items: Item[] = [];
  item: Item = {};
  submit: boolean = false;
  gsubmit: boolean = false;
  groupForm!: FormGroup;
  variants: Productvariants[] = [];
  variantvalues: any = {};
  variantslist: Productvariants[] = [];
  selectvariant: Productvariants = {};
  selvariantvalue = 0;
  parameters: Productmapparam[] = [];
  groups: Group[] = [];
  images: Productimage[] = [];
  refimages: Productimage[] = [];
  itemimages: Itemimage[] = [];
  selectedimages: any = { 0: [] };
  addimage: string = '';
  defimage: Productimage = {};
  baseurl: string = '';
  itemlistuuid = '';
  itemid = '';
  department = '';
  product: Product = {};
  itemMoredetails: Itemmoredetails[] = [];
  showsingleimg = false;
  copycheck: string[] = [];
  copyfrom: Array<{ key: string; value: string }> = [];
  @ViewChildren(SortableDirective) headers!: QueryList<SortableDirective>;
  priceupdate: Array<{ uuid: string; mrp: number; price: number; show: boolean }> = [];
  variantValue: any = [];
  selcopyfrom = '';
  variantgroupid = '';
  status = '';
  checked: boolean = false;

  allvariants: Array<{ id: string; name: string }> = [];
  statuses = [
    { name: 'Active', value: 'Active' },
    { name: 'Inactive', value: 'Inactive' }
  ];

  copytype = '';
  supercoins: Array<{ key: number; value: number }> = [];

  copyoptions = [
    { name: '0', value: 'Copy Only Images' },
    { name: '1', value: 'Copy Only Content' },
    { name: '4', value: 'Copy Images and Content' },
    { name: '2', value: 'Copy Only Price' },
    { name: '3', value: 'Update Status' },
  ];

  returns = [
    { name: '1', value: '1 Day' },
    { name: '2', value: '2 Days' },
    { name: '3', value: '3 Days' },
    { name: '4', value: '4 Days' },
    { name: '5', value: '5 Days' },
    { name: '6', value: '6 Days' },
    { name: '7', value: '7 Days' }
  ];
  terms = [
    { name: '1', value: 'fashionwrap Policy' },
    { name: '2', value: 'Brand/manufacturer Policy' }
  ];
  //allvariants= new Map<number, Productimage[]>();
  step: number = 1;
  addstockForm: any;
  //Newly Added//
  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 50;
  pageSizes = [10, 30, 50, 100];

  //Multiselect Tags
  model: any;
  searching = false;
  searchFailed = false;
  tag?: TAGS.Tag;
  tags: TAGS.Tag[] = [];

  tagsearch: OperatorFunction<string, readonly TAGS.Tag[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.webteamservice.search(term).pipe(
          map((x: any) => {
            if (x.length > 0) {
              this.searchFailed = false;
              return x;
            } else {
              this.searchFailed = true;
              return ['No Results Found'];
            }
          }),
          tap(() => (this.searching = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );
  formatter = (x: any) => x.name;

  public user = JSON.parse(sessionStorage.getItem('auth_user') || '{}');
  selectedPath: any = '';
  selectVideos: string = '';

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private webteamservice: WebteamService,
    private toast: ToastService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private utlis: UtilsService
  ) { }

  ngOnInit(): void {
    this.baseurl = environment.CATALOG_URL;
    this.addstockForm = this.fb.group({
      cod: [1],
      returnable: [0],
      returntime: [0],
      terms: [0],
      freeship: [1],
      supercoins: [0],
      description: [''],
      keywords: [''],
      tags: this.fb.array([])
    });
    this.groupForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      mrp: [0, [Validators.required]],
      price: [0, [Validators.required]],
      status: ['', [Validators.required]]
    });
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (!uuid) {
      this.router.navigate(['/catalog/products']);
    } else {
      this.webteamservice.checkproduct(uuid).subscribe({
        next: (items) => {
          this.view();
          // this.cdr.detectChanges();
        }
      });
    }

    if (this.user.role == 7)
      this.copyoptions = [
        ...this.copyoptions,
        ...[
          { name: '2', value: 'Copy Only Price' },
          { name: '3', value: 'Update Status' }
        ]
      ];

    for (let coins = 0; coins <= 3.1; coins = coins + 0.1) {
      this.supercoins.push({ key: coins, value: this.toFloat(coins) });
    }
    // this.cdr.detectChanges();
  }
  toFloat(x: any) {
    let xyz = parseInt(x) === x ? x : parseFloat(x).toFixed(2);
    return Number(xyz);
  }
  saveprice(i: number) {
    this.priceupdate[i]['show'] = true;
    this.submit = true;

    if (
      isNaN(this.priceupdate[i]['mrp']) ||
      isNaN(this.priceupdate[i]['price']) ||
      this.priceupdate[i]['mrp'] <= 0 ||
      this.priceupdate[i]['price'] <= 0
    ) {
      this.toast.failure('Invalid MRP or Price');
      return;
    }
    if (Number(this.priceupdate[i]['mrp']) < Number(this.priceupdate[i]['price'])) {
      this.toast.failure('Price must be less than mrp');
      return;
    }

    let item = Object.assign({}, this.addstockForm.value);
    this.webteamservice.priceupdate(this.priceupdate[i], this.priceupdate[i]['uuid']).subscribe({
      next: (resp) => {
        this.priceupdate[i]['show'] = false;

        this.toast.success('Price updated successfully');
        this.view();
        // this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.toast.failure(err);
      }
    });
  }

  view() {
    this.priceupdate = Object.assign([], []);
    this.copyfrom = Object.assign([], []);
    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (!uuid) {
      this.router.navigate(['/catalog/products']);
    } else {
      this.webteamservice.findproduct(uuid).subscribe({
        next: (items) => {
          this.items = items.items || [];
          this.refimages = items.productimages || [];
          this.product = items.product || {};
          this.itemMoredetails = items.itemmoredetails || [];
          this.variantslist = items.variantlist || [];
          this.variants = items.variants || [];
          // console.log(this.variants, items.variantlist);

          this.itemlists = items.itemlist || [];
          this.department = items.product.department_id + '';
          this.itemimages = items.itemimagelist || [];
          this.checked = false;
          this.tags = items.tags;

          //this.variantslist.unshift({ id: 0, name: 'No Group', productvariantvalues: [{}] })
          if (items.variantlist && items.variantlist.length > 0) {

            //this.variantvalues = items.variantlist.map((val: any) => (val.productvariantvalues))
            items.variantlist.forEach((variant: any) => {
              if (variant.productvariantvalues) {
                variant.productvariantvalues.forEach((variantvalue: any) => {
                  this.variantvalues[variantvalue.id] = variantvalue;
                });
              }
            });
          }
          if (items.images) {
            this.images = items.images;
          }
          if (items.parameterlist && items.parameterlist.length > 0) {
            this.parameters = items.parameterlist;
          }

          if (this.itemlists && this.itemlists.length > 0) {

            // this.itemlists = items.itemlist
            this.itemlists.forEach((val: Itemlist, listindex: number) => {
              this.itemlists[listindex]['checked'] = false;
              let itemindex = this.items.findIndex((res) => res.itemslist_uuid == val.uuid);
              if (itemindex >= 0 && this.items[itemindex]) {
                this.itemlists[listindex]['item'] = this.items[itemindex];
                //console.log(this.itemlists[listindex]);
              }
              let rprice = '';
              this.itemlists[listindex]['mrp'] = this.itemlists[listindex]['mrp'] || 0;

              // if (items.poitem.price) {
              //   let rrprice =
              //     parseFloat(items.poitem.price) +
              //     (parseFloat(items.poitem.price) *
              //       parseFloat(items.poitem.ctax) *
              //       parseFloat(items.poitem.stax) *
              //       parseFloat(items.poitem.itax)) /
              //     100;
              //   rrprice += (parseFloat(items.poitem.price) * parseFloat(items.poitem.ctax)) / 100;
              //   rrprice += (parseFloat(items.poitem.price) * parseFloat(items.poitem.stax)) / 100;
              //   rrprice += (parseFloat(items.poitem.price) * parseFloat(items.poitem.itax)) / 100;
              //   rrprice += rrprice + (rrprice * 50) / 100;
              //   rprice = rrprice + '';

              //   if (this.itemlists[listindex]['mrp'] == 0) this.itemlists[listindex]['mrp'] = items.poitem.mrp;
              // }
              this.itemlists[listindex]['rprice'] = rprice;

              let itemimages = this.itemimages.filter((res) => res.itemslist_uuid == val.uuid);
              this.itemlists[listindex]['itemimages'] = itemimages || [];

              let concatskuvalue = '';
              if (val.sku && val.sku != '') {
                let variantsplitarr = val.sku.split('_');
                this.itemlists[listindex]['skulist'] = variantsplitarr;
                variantsplitarr.forEach((skuvalue) => {
                  let variantvalue = this.variantvalues[skuvalue] || {};
                  if (!this.itemlists[listindex]['variantlist']) this.itemlists[listindex]['variantlist'] = {};
                  this.itemlists[listindex]['variantlist'][skuvalue] = variantvalue;
                  concatskuvalue += variantvalue.value + ' ';
                });
              }
              let valname = this.itemlists[listindex]['description'] || concatskuvalue;
              if (this.items[itemindex] && val.uuid) {
                //valname = (this.items[itemindex]['name'] || valname) + ' (' + concatskuvalue + ')';
                this.copyfrom = [...this.copyfrom, { key: val.uuid, value: valname }];
              }

              this.priceupdate = [...this.priceupdate, { uuid: val.uuid || '', mrp: val.mrp || 0, price: val.price || 0, show: false }];

              //this.variantfield(val.id, val.mrp, val.price)
              //this.itemlists[key]['variantvalue'] = (val.sku).split('_').map((val: any) => (val.replace('-', ' ')).toUpperCase())
            });
          }
          this.addstockForm.get('cod')?.setValue(this.product.cod || 0);
          this.addstockForm.get('returnable')?.setValue(this.product.returnable || 0);
          this.addstockForm.get('freeship')?.setValue(this.product.freeship || 0);
          this.addstockForm.get('returntime')?.setValue(this.product.returntime || 0);
          this.addstockForm.get('terms')?.setValue(this.product.terms || 0);
          this.addstockForm.get('supercoins')?.setValue(this.product.supercoins || 0);
          this.addstockForm.get('keywords')?.setValue(this.product.keywords || '');
          this.addstockForm.get('description')?.setValue(this.product.description || '');
          this.addstockForm.get('tags')?.setValue(this.tags || []);

          // if (items.items && items.items.length > 0) {
          //   // this.itemlists = items.itemlist
          //   items.items.forEach((val: Item, key: number) => {
          //     let itemindex = this.itemlists.findIndex(res => res.uuid == val.itemslist_uuid)
          //     if(itemindex >= 0 && this.itemlists[itemindex]){
          //       this.itemlists[itemindex]['item'] = val;
          //     }
          //     //this.variantfield(val.id, val.mrp, val.price)
          //     //this.itemlists[key]['variantvalue'] = (val.sku).split('_').map((val: any) => (val.replace('-', ' ')).toUpperCase())
          //   });
          // }
          // if (items.itemmoredetails && items.itemmoredetails.length > 0) {
          //   items.itemmoredetails.forEach((val: any, key: number) => {
          //     this.moredatafield(val.item_id, val.title, val.description)
          //   });
          // }
          //this.moredatafield()
          //this.selectedVariants()
          // this.cdr.detectChanges();
        },
        error: (err) => {
          let msg = err.error.message ? err.error.message : 'Item not found';
          this.item = {};
          this.toast.failure(msg);
          this.router.navigate(['/catalog/products']);
        }
      });
    }
  }
  clonedata() {
    const copyfor = this.itemlists.filter((res) => res.checked).map((res) => res.uuid);

    if (!this.copytype) {
      this.toast.failure('Select Copy Type');
      return;
    }
    if (copyfor.length <= 0) {
      this.toast.failure('Check atleast one checkbox Copy For');
      return;
    }
    if (this.copytype !== '3') {
      if (!this.selcopyfrom) {
        this.toast.failure('Select Copy From');
        return;
      }
    } else {
      if (!this.status) {
        this.toast.failure('Select status');
        return;
      }
    }

    const data = { copytype: this.copytype, copyfor: copyfor, status: this.status };

    if (this.copytype === '3') {
      this.webteamservice.updatestatus(data).subscribe({
        next: (resp) => {
          this.toast.success('Status Updated Successfully');
          this.view();
          // this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.toast.failure(err);
        }
      });
    } else {
      this.webteamservice.updateclondedata(data, this.selcopyfrom).subscribe({
        next: (resp) => {
          this.toast.success('Item Successfully');
          this.view();
          // this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.toast.failure(err.error.message);
        }
      });
    }
  }
  saveimage() {
    let selectimages: any = [];
    if (this.showsingleimg === true) {
      this.webteamservice.savedefaultimage(this.itemlistuuid, { image: this.defimage }).subscribe({
        next: (resp) => {
          this.view();
          this.modalService.dismissAll();
          // this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.toast.failure(err.error.message);
        }
      });
    } else {
      Object.keys(this.selectedimages).forEach((variantid: any, key: number) => {
        if (this.selectedimages[variantid].length > 0) {
          selectimages.push(...this.selectedimages[variantid]);
        }
      });
      if (selectimages.length > 0) {
        let getvariant = this.itemlists.find((res) => res.uuid === this.itemlistuuid);
        this.webteamservice
          .saveitemimages(this.itemlistuuid, { skuid: getvariant?.sku || '', image: selectimages, variant: getvariant?.variantlist || {} })
          .subscribe({
            next: (resp) => {
              this.view();
              this.modalService.dismissAll();
              // this.cdr.detectChanges();
            },
            error: (err: any) => {
              this.toast.failure(err.error.message);
            }
          });
      } else {
        this.modalService.dismissAll();
      }
    }
    // item.images = selectimages;
    // this.webteamservice.createwebstock(item, this.itemlistuuid).subscribe({
    //   next: resp => {
    //     this.toast.success('Stock added successfully');
    //     this.groupForm.reset();
    //     this.modalService.dismissAll();
    //     this.addstockForm.reset()
    //     this.router.navigate(['/app/stocks']);
    //   }, error: (err: any) => {
    //     this.toast.failure(err.error.message);
    //   }
    // })
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      //this.stockapprove.image = file
    }
  }

  onSelectedImage(event: any) {
    var reader = new FileReader();

    //Read the contents of Image File.
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const filesize = file.size / 1024 / 1024;

        // if (filesize > 1) {
        //   this.toast.failure('File not upload.. Please upload below 1 MB file');
        //   return;
        // }
        // else if (Number(img.width) != 1400 || Number(img.height) != 1600) {
        //   this.toast.failure('Please upload the image Ratio Pixel Size (Width x Height) 1400px x 1600px');
        //   return;
        // }
        // else {
        this.addimage = file;
        this.newimage();
        //}
      };
    }
  }

  newimage() {
    // console.log("indo");
    const formd: any = new FormData();
    formd.append('image', this.addimage);
    this.webteamservice.savetoGallery(this.itemlistuuid, formd).subscribe({
      next: (resp) => {
        this.addimage = '';
        if (this.showsingleimg === true) {
          this.defimage = resp;
        } else {
          //resp.variantvalue_id = this.selvariantvalue;
          //this.selectedimages[this.itemlistuuid].push(Object.assign({ variantvalue_id: this.selvariantvalue }, resp))
        }
        this.images.push(resp);
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

  viewGroup(content: any, itemlistuuid = '', itemid = ''): void {
    const modelref = this.modalService.open(content, { size: 'lg' });
    this.itemlistuuid = itemlistuuid;
    this.itemid = itemid || '';
    let itemlist = this.itemlists.find((res) => res.uuid === itemlistuuid);
    if (itemlist) {
      if (itemlist.item) {
        this.groupForm.get('id')?.setValue(itemlist.item.id || '');
        this.groupForm.get('name')?.setValue(itemlist.item.name || '');
        this.groupForm.get('description')?.setValue(itemlist.item.description || '');
        this.groupForm.get('status')?.setValue(itemlist.item.status || 'Inactive');
      }
      this.groupForm.get('mrp')?.setValue(itemlist.mrp || 0);
      this.groupForm.get('price')?.setValue(itemlist.price || 0);
    }
  }
  openGallery(content: any, type = '', itemlistuuid = '', itemid = ''): void {
    if (itemlistuuid !== '') {
      this.showsingleimg = type == 'Single' ? true : false;
      const modelref = this.modalService.open(content, { size: 'lg' });
      this.itemlistuuid = itemlistuuid;
      this.itemid = itemid || '';
    }
  }
  variantGallery(content: any, variantvalueid = 0): void {
    this.selvariantvalue = variantvalueid;
    const modelref = this.modalService.open(content, { size: 'md' });
    this.selectedPath = this.items[variantvalueid];
    let vlastname = this.selectedPath.vpath.split('/').pop()
    let vname = vlastname?.split('__')
    let vnam = vname?.pop() || ''
    this.selectVideos = decodeURIComponent(vnam);
    // this.cdr.detectChanges();
  }
  get form() {
    return this.groupForm.controls;
  }
  // variantdata(): FormArray {
  //   //return this.addstockForm.get('variantlist') as FormArray;
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
  saveGroup() {
    this.gsubmit = true;
    if (this.groupForm.invalid) {
      return;
    }
    this.webteamservice.saveitemstock(this.groupForm.value, this.itemlistuuid).subscribe({
      next: (resp) => {
        this.toast.success('Item Successfully');
        this.groupForm.reset();
        //this.variantdata().clear();
        //this.parameterdata().clear();
        this.modalService.dismissAll();
        this.view();
        // this.cdr.detectChanges();
        //this.groups = [...this.groups, resp]
        //this.addstockForm.get('group')?.setValue((resp?.id) + '')
      },
      error: (err: any) => {
        this.toast.failure(err.error.message);
      }
    });
  }
  saveProductdetail() {
    this.submit = true;
    if (this.addstockForm.invalid) {
      return;
    }
    let item = Object.assign({}, this.addstockForm.value);
    item.cod = item.cod ? 1 : 0;
    item.returnable = item.returnable ? 1 : 0;
    item.freeship = item.freeship ? 1 : 0;
    item.tags = this.tags;
    this.webteamservice.updateProduct(item, this.product.uuid).subscribe({
      next: (resp) => {
        this.toast.success('Stock added successfully');
        this.groupForm.reset();
        this.modalService.dismissAll();
        this.addstockForm.reset();
        this.view();
        // this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.toast.failure(err.error.message);
      }
    });
  }
  findgroupname() {
    let group = this.groups.find((res) => res.id + '' === this.groupForm.get('group')?.value + '');
    return group?.name;
  }
  selectimage(i: number) {
    if (!this.selectedimages[this.itemlistuuid]) {
      this.selectedimages[this.selvariantvalue] = [];
    }
    if (this.images[i]) {
      let selimg = this.images[i];
      if (this.showsingleimg === true) {
        this.defimage = selimg;
      } else {
        this.images[i]['select'] = true;

        this.selectedimages[this.itemlistuuid] = this.selectedimages[this.itemlistuuid] || [];

        let indexval = this.selectedimages[this.itemlistuuid].findIndex((res: any) => res.id === selimg.id);
        if (indexval >= 0) {
          this.images[i]['select'] = false;
          this.selectedimages[this.itemlistuuid].splice(indexval, 1);
        } else {
          this.selectedimages[this.itemlistuuid].push(Object.assign(selimg, { item_id: this.itemid }));
        }
      }
    }
    //this.addstockForm.get('images')?.setValue(this.selectedimages)
  }
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
  checkall(event: any) {
    this.itemlists.map((checkitem, index) => {
      if (event.target.checked == true) {
        this.itemlists[index]['checked'] = true;
      } else {
        this.itemlists[index]['checked'] = false;
      }
    });
  }
  // selectedVariants() {
  //   let variantgroup = this.addstockForm.get('variantgroup_id')?.value || 0
  //   let resp: Productvariants = this.variantslist.find(res => res.id === variantgroup) || {}
  //   this.selectvariant = resp
  // }

  itemSelected($event: any) {
    const tagval = $event.item;
    this.tag = tagval;

    let tagids = this.tags.map((x: any) => x.id);
    if (tagids.includes(tagval.id) == false) {
      this.tags.push(tagval);
    }
  }

  clear(i: any) {
    this.tags.splice(i, 1);
  }

  onSort({ column, direction }: SortEvent | any) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    if (this.itemlists) {
      this.itemlists = this.sortProduct(this.itemlists, column, direction);
    }
  }

  sortProduct(products: Product[], column: string, direction: string): Product[] {
    if (direction === '' || column === '') {
      return products;
    } else {
      let res: number;
      return [...products].sort((a: any, b: any) => {
        if (column.indexOf('.') != -1) {
          let arrayType = column.split('.');
          if (arrayType.length === 2) {
            // for depth 2 . Need to write condition for depth 3
            res = this.compare(`${a[arrayType[0]][arrayType[1]]}`, `${b[arrayType[0]][arrayType[1]]}`);
          }
        } else {
          res = this.compare(`${a[column]}`, `${b[column]}`);
        }
        return direction === 'asc' ? res : -res;
      });
    }
  }

  compare(v1: string | number, v2: string | number): any {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  getVariantValues(variant: any) {
    var variantsary = Object.values(variant);
    var variantValue: any = [];

    this.variants.map((variant: any) => {
      var findVariantAry: any = variantsary.find((item: any) => item.variant_id == variant.id)
      if (findVariantAry) {
        variantValue.push(findVariantAry.value)
      }
      else {
        variantValue.push("-")
      }
    })
    return variantValue;
  }
}
