import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BarcodeFormat } from '@zxing/library';
import { BehaviorSubject, startWith, map, Observable, take } from 'rxjs';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { ProductsService } from 'src/app/pages/category-head/services/products.service';
import { ProductvariantsService } from 'src/app/pages/category-head/services/productvariants.service';
import { CompressImageService } from 'src/app/pages/purchaser/services/compress-image.service';
import { environment } from 'src/environments/environment';
import { BarCode } from '../../models/barcode';
import { Group } from '../../models/inventory';
import { Inwarditem, Product, Productmapparam } from '../../models/product';
import { Productvariants } from '../../models/productvariants';
import { Purchaseorder, Department, Categories, Subcategories, Vendor, Brands } from '../../models/purchaseorder';
import { BarCodeService } from '../../services/barcode.service';
import { BrandsService } from '../../services/brands.service';
import { DepartmentsService } from '../../services/departments.service';
import { InventoryService } from '../../services/inventory.service';
import { PurchaseorderService } from '../../services/purchaseorder.service';
import { BarCodeServiceweb } from '../../services/barcodeweb.service';

@Component({
  selector: 'app-stockbarcode-web',
  templateUrl: './stockbarcode-web.component.html',
  styleUrls: ['./stockbarcode-web.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    RouterModule,
    SharedModule
    // BarcodeScannerLivestreamModule
  ]
})
export class StockbarcodeWebComponent {
  inwarditem: Inwarditem = {};
  viewProduct: Product = {};
  scanbarcode = '';
  scanbarcodeurl = '';
  status: Array<{ id: string; name: string }> = [
    { id: 'Inventory', name: 'Everything OK' },
    { id: 'Damage', name: 'Damage' },
    { id: 'Variant Not Match', name: 'Product Variant Not Match' },
    { id: 'Parameter Not Match', name: 'Product Parameter Not Match' }
  ];

  color: any = [];
  clr: any = [
    { name: 'aliceblue', value: '#F0F8FF' },
    { name: 'antiquewhite', value: '#FAEBD7' },
    { name: 'aqua', value: '#00FFFF' },
    { name: 'aquamarine', value: '#7FFFD4' },
    { name: 'azure', value: '#F0FFFF' },
    { name: 'beige', value: '#F5F5DC' },
    { name: 'bisque', value: '#FFE4C4' },
    { name: 'black', value: '#000000' },
    { name: 'blanchedalmond', value: '#FFEBCD' },
    { name: 'blue', value: '#0000FF' },
    { name: 'blueviolet', value: '#8A2BE2' },
    { name: 'brown', value: '#A52A2A' },
    { name: 'burlywood', value: '#DEB887' },
    { name: 'cadetblue', value: '#5F9EA0' },
    { name: 'chartreuse', value: '#7FFF00' },
    { name: 'chocolate', value: '#D2691E' },
    { name: 'coral', value: '#FF7F50' },
    { name: 'cornflowerblue', value: '#6495ED' },
    { name: 'cornsilk', value: '#FFF8DC' },
    { name: 'crimson', value: '#DC143C' },
    { name: 'cyan', value: '#00FFFF' },
    { name: 'darkblue', value: '#00008B' },
    { name: 'darkcyan', value: '#008B8B' },
    { name: 'darkgoldenrod', value: '#B8860B' },
    { name: 'darkgray', value: '#A9A9A9' },
    { name: 'darkgrey', value: '#A9A9A9' },
    { name: 'darkgreen', value: '#006400' },
    { name: 'darkkhaki', value: '#BDB76B' },
    { name: 'darkmagenta', value: '#8B008B' },
    { name: 'darkolivegreen', value: '#556B2F' },
    { name: 'darkorange', value: '#FF8C00' },
    { name: 'darkorchid', value: '#9932CC' },
    { name: 'darkred', value: '#8B0000' },
    { name: 'darksalmon', value: '#E9967A' },
    { name: 'darkseagreen', value: '#8FBC8F' },
    { name: 'darkslateblue', value: '#483D8B' },
    { name: 'darkslategray', value: '#2F4F4F' },
    { name: 'darkslategrey', value: '#2F4F4F' },
    { name: 'darkturquoise', value: '#00CED1' },
    { name: 'darkviolet', value: '#9400D3' },
    { name: 'deeppink', value: '#FF1493' },
    { name: 'deepskyblue', value: '#00BFFF' },
    { name: 'dimgray', value: '#696969' },
    { name: 'dimgrey', value: '#696969' },
    { name: ' dodgerblue', value: '#1E90FF' },
    { name: 'firebrick', value: '#B22222' },
    { name: 'floralwhite', value: '#FFFAF0' },
    { name: 'forestgreen', value: '#228B22' },
    { name: 'fuchsia', value: '#FF00FF' },
    { name: 'gainsboro', value: '#DCDCDC' },
    { name: 'ghostwhite', value: '#F8F8FF' },
    { name: 'gold', value: '#FFD700' },
    { name: 'goldenrod', value: '#DAA520' },
    { name: 'gray', value: '#808080' },
    { name: ' grey', value: '#808080' },
    { name: ' green', value: '#008000' },
    { name: ' greenyellow', value: '#ADFF2F' },
    { name: 'honeydew', value: '#F0FFF0' },
    { name: 'hotpink', value: '#FF69B4' },
    { name: ' indianred', value: '#CD5C5C' },
    { name: ' indigo', value: '#4B0082' },
    { name: ' ivory', value: '#FFFFF0' },
    { name: 'khaki', value: '#F0E68C' },
    { name: ' lavender', value: '#E6E6FA' },
    { name: ' lavenderblush', value: '#FFF0F5' },
    { name: ' lawngreen', value: '#7CFC00' },
    { name: ' lemonchiffon', value: '#FFFACD' },
    { name: 'lightblue', value: '#ADD8E6' },
    { name: ' lightcoral', value: '#F08080' },
    { name: ' lightcyan', value: '#E0FFFF' },
    { name: 'lightgoldenrodyellow', value: '#FAFAD2' },
    { name: 'lightgray', value: '#D3D3D3' },
    { name: 'lightgrey', value: '#D3D3D3' },
    { name: ' lightgreen', value: '#90EE90' },
    { name: 'lightpink', value: '#FFB6C1' },
    { name: 'lightsalmon', value: '#FFA07A' },
    { name: 'lightseagreen', value: '#20B2AA' },
    { name: 'lightskyblue', value: '#87CEFA' },
    { name: 'lightslategray', value: '#778899' },
    { name: 'lightslategrey', value: '#778899' },
    { name: 'lightsteelblue', value: '#B0C4DE' },
    { name: 'lightyellow', value: '#FFFFE0' },
    { name: 'lime', value: '#00FF00' },
    { name: 'limegreen', value: '#32CD32' },
    { name: 'linen', value: '#FAF0E6' },
    { name: 'magenta', value: '#FF00FF' },
    { name: 'maroon', value: '#800000' },
    { name: 'mediumaquamarine', value: '#66CDAA' },
    { name: 'mediumblue', value: '#0000CD' },
    { name: 'mediumorchid', value: '#BA55D3' },
    { name: 'mediumpurple', value: '#9370DB' },
    { name: 'mediumseagreen', value: '#3CB371' },
    { name: 'mediumslateblue', value: '#7B68EE' },
    { name: 'mediumspringgreen', value: '#00FA9A' },
    { name: 'mediumturquoise', value: '#48D1CC' },
    { name: 'mediumvioletred', value: '#C71585' },
    { name: 'midnightblue', value: '#191970' },
    { name: 'mintcream', value: '#F5FFFA' },
    { name: 'mistyrose', value: '#FFE4E1' },
    { name: 'moccasin', value: '#FFE4B5' },
    { name: 'navajowhite', value: '#FFDEAD' },
    { name: 'navy', value: '#000080' },
    { name: 'oldlace', value: '#FDF5E6' },
    { name: 'olive', value: '#808000' },
    { name: 'olivedrab', value: '#6B8E23' },
    { name: 'orange', value: '#FFA500' },
    { name: 'orangered', value: '#FF4500' },
    { name: 'orchid', value: '#DA70D6' },
    { name: 'palegoldenrod', value: '#EEE8AA' },
    { name: 'palegreen', value: '#98FB98' },
    { name: 'paleturquoise', value: '#AFEEEE' },
    { name: 'palevioletred', value: '#DB7093' },
    { name: 'papayawhip', value: '#FFEFD5' },
    { name: 'peachpuff', value: '#FFDAB9' },
    { name: 'peru', value: '#CD853F' },
    { name: 'pink', value: '#FFC0CB' },
    { name: 'plum', value: '#DDA0DD' },
    { name: 'powderblue', value: '#B0E0E6' },
    { name: 'purple', value: '#800080' },
    { name: 'rebeccapurple', value: '#663399' },
    { name: 'red', value: '#FF0000' },
    { name: 'rosybrown', value: '#BC8F8F' },
    { name: 'royalblue', value: '#4169E1' },
    { name: 'saddlebrown', value: '#8B4513' },
    { name: 'salmon', value: '#FA8072' },
    { name: 'sandybrown', value: '#F4A460' },
    { name: 'seagreen', value: '#2E8B57' },
    { name: 'seashell', value: '#FFF5EE' },
    { name: 'sienna', value: '#A0522D' },
    { name: 'silver', value: '#C0C0C0' },
    { name: 'skyblue', value: '#87CEEB' },
    { name: 'slateblue', value: '#6A5ACD' },
    { name: 'slategray', value: '#708090' },
    { name: 'slategrey', value: '#708090' },
    { name: 'snow', value: '#FFFAFA' },
    { name: 'springgreen', value: '#00FF7F' },
    { name: 'steelblue', value: '#4682B4' },
    { name: 'tan', value: '#D2B48C' },
    { name: 'teal', value: '#008080' },
    { name: 'thistle', value: '#D8BFD8' },
    { name: 'tomato', value: '#FF6347' },
    { name: 'turquoise', value: '#40E0D0' },
    { name: 'violet', value: '#EE82EE' },
    { name: 'wheat', value: '#F5DEB3' },
    { name: 'white', value: '#FFFFFF' },
    { name: 'whitesmoke', value: '#F5F5F5' },
    { name: 'yellow', value: '#FFFF00' },
    { name: 'yellowgreen', value: '#9ACD32' }
  ];

  stockapprove = { status: '', comments: '', image: '' };
  actionreason = false;
  submit: boolean = false;
  groupForm!: UntypedFormGroup;
  addstockForm!: UntypedFormGroup;
  variants: Productvariants[] = [];
  barcode: BarCode[] = [];
  issaved: boolean = false;
  variantsvalues: any = {};
  images: any;
  baseurl: string = '';
  insbulkitems: any[] = [];
  purchaseid: string = '0';
  resetdata!: UntypedFormArray;
  productmapparams: Productmapparam[] = [];
  purchase: Purchaseorder = {};
  modalRef: any = {};
  tableArray: any = [];
  shelfvariants: any = {};
  //// Dispute Form ///
  disputeForm!: FormGroup;
  gsubmit: Boolean = false;
  disputetypes: Array<{ id: string; name: string }> = [
    { id: 'Damage', name: 'Damage' },
    { id: 'Quality Issue', name: 'Quality Issue' },
    { id: 'Missing Parts', name: 'Missing Parts' },
    { id: 'Excess', name: 'Excess' },
    { id: 'Shortage', name: 'Shortage' },
    { id: 'Intransit Damage', name: 'Intransit Damage' },
    { id: 'PSID missing', name: 'PSID missing' },
    { id: 'Tag missing', name: 'Tag missing' },
    { id: 'PSID/Tag damage', name: 'PSID/Tag damage' }
  ];
  disputeimage: string = '';
  /////
  shelf: any = { id: 0 };
  shelves: any = '';
  firstscan = 0;
  qrResultString: string = '';
  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  hasPermission: boolean = false;

  data?: Purchaseorder = {};

  showShelf: boolean = false;
  showqcscan: boolean = true;
  showsubmit: boolean = true;
  variantLists: any = [];

  departments: Department[] = [];
  class: Categories[] = [];
  subclass: Subcategories[] = [];
  groups: Group[] = [];
  isupdate: boolean = false;
  selectedDept = '';
  selectedBrand = '';
  selectedClass = '';
  selectedSubclass = '';
  selectedGroup = '';

  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93
  ];

  // upload image
  addfile: string = '';
  fileName: any = '';
  barcodeLength: number = 0;
  barcodeValue: any;
  respArray: any = [];

  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  searchdepart = 0;
  vName: any;
  searching: boolean;
  vendors: Vendor[] = [];
  changevendor: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryservice: InventoryService,
    private barcodeservice: BarCodeServiceweb,
    private toast: ToastService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private utlis: UtilsService,
    private fbdisput: FormBuilder,
    private poservice: PurchaseorderService,
    private cdr: ChangeDetectorRef,
    private departmentservice: DepartmentsService,
    private productvariantsservice: ProductvariantsService,
    private productservice: ProductsService,
    private brandsservices: BrandsService,
    private porderservice: PurchaseorderService,
    private compressImage: CompressImageService // private warehouseservice: WarehouseManagerService,
  ) { }

  // searchcolor: OperatorFunction<string, readonly Group[]> = (text$: Observable<string>) =>
  // text$.pipe(
  // debounceTime(500),
  // distinctUntilChanged(),
  // map(term => this.searchEntries(term))
  // .subscribe(results => {
  //this.result = results;
  //})
  // );

  formatter = (x: any) => x.name;
  ngOnInit(): void {
    let uuid = this.route.snapshot.paramMap.get('barcode');
    // this.color = Object.keys(this.clr);
    this.baseurl = environment.WAREHOUSE_SITE_URL;
    this.addstockForm = this.fb.group({
      variantlist: this.fb.array([])
    });

    this.disputeForm = this.fbdisput.group({
      barcode: [''],
      image: [''],
      name: [''],
      shelf_id: [''],
      qty: [''],
      color: [''],
      barcodeinput: [''],
      v_name: [''],
      vendor_id: ['']
    });
    this.disputeForm.get('barcodeinput').setValue(uuid)
    this.scanbarcodeurl = this.disputeForm.get('barcodeinput').value

    // console.log( this.disputeForm.get('barcodeinput').value);

    this.barcodeservice.allvendor('6').subscribe({
      next: (data) => {
        this.vendors = data;
        this.cdr.detectChanges();
      }
    });

    this.departmentservice.findList().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: () => {
        this.departments = [];
      }
    });

    this.filteredOption = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.clr.splice()))
    );
  }
  filteredOption: Observable<any>;
  myControl = new FormControl();
  private _filter(name: string): any {
    const filterValue = name.toLocaleLowerCase();
    return this.clr.filter((clr: any) => clr.name.toLocaleLowerCase().indexOf(filterValue) == 0);
  }

  brands?: Brands[];
  list(): void {
    const params = this.utlis.getRequestParams(this.searchdepart + '#' + this.search, this.page, this.pageSize);
    this.brandsservices.getAll(params).subscribe({
      next: (brands) => {
        this.brands = brands.datas;
        this.count = brands.totalItems || 0;
        // this.cd.detectChanges();
        if (brands.totalItems) this.count = brands.totalItems;
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
  }
  changeV(val: any) {
    this.changevendor = true;
  }
  vendorchange(event: any) {
    // console.log(event.uid);
    this.disputeForm.get('vendor_id').setValue(event.uid);
  }
  itemsArray: any = [];
  verifyQRcode() {
    let insbulkitemscheck = this.insbulkitems.length;
    this.issaved = false;
    this.changevendor = false;
    // console.log(this.scanbarcode, this.data?.id || '', 'verify_code');
    this.barcodeLength = 0;
    if (insbulkitemscheck > 0) {
      this.scanQRcode();
    } else {
      this.isupdate = false;
      this.barcodeservice.view(this.scanbarcodeurl).subscribe({
        next: (items: any) => {
          this.barcode = items;
          this.images = items.image;
          this.vName = items.name;

          if (items.v_name == null) this.vName = items.name;
          else this.vName = items.v_name;

          this.barcodeLength = Object.keys(this.barcode).length;
          // items = items.data || {};
          if (this.isupdate == false) {
            this.disputeForm.get('name').setValue(items.name);
            this.disputeForm.get('image').setValue(items.image);
            this.disputeForm.get('qty').setValue(items.qty || null);
            this.disputeForm.get('shelf_id').setValue(items.shelf_id || null);
            this.disputeForm.get('barcode').setValue(items.barcode);
            this.disputeForm.get('color').setValue(items.color || null);
            this.disputeForm.get('barcode').disable();
            this.barcodeValue = items.barcode;
          }

          // console.log(items, this.disputeForm.value, this.disputeForm.value.color);
          let edit_color = this.disputeForm.value.color;
          const filter_clr = this.clr.filter(function (element: any) {
            return element.name == edit_color;
          });
          // console.log(filter_clr);
          this.color_code = filter_clr[0].value;
        },
        error: (err) => {
          // console.log(err, '=>', typeof err);
          this.toast.info(err);
          this.disputeForm.get('barcode').enable();
          this.issaved = false;
          this.barcodeLength = 1;
          this.isupdate = true;
          this.disputeForm.get('barcode').setValue(this.disputeForm.get('barcodeinput').value);
          this.disputeForm.get('v_name').setValue('');
          this.disputeForm.get('shelf_id').setValue('');
          this.disputeForm.get('qty').setValue('');
          // console.log('dispute', this.disputeForm.value);

          // this.disputeForm.reset()
        }
      });
      //}
    }
  }

  getVariantList() {
    this.poservice.getvariantlist('1').subscribe({
      next: (data) => {
        this.variantLists = data;
        // console.log(this.variantLists);
        // console.log(this.variantLists[0].productvariantvalues[0]);
        // this.cdr.detectChanges();
      },
      error: () => { }
    });
  }

  scanQRcode() {
    let length: number = this.insbulkitems.length || 1;
    this.shelfvariants.length = length + 1;
    this.inventoryservice.stockfind(this.scanbarcode, this.data?.id, this.shelfvariants, length).subscribe({
      next: (items) => {
        // console.log('Hellow world', items.data, this.shelfvariants.length, items.data.shelf);
        items = items.data || {};
        let shelf = items.shelf || {};
        this.shelves = items.shelf.shelfID;
        // if (!items.variants) {
        // this.toast.info('Item not found, please inform to warehouse operator.');
        // return;
        // }

        if (items.shelf != null && shelf.available < 1 && shelf.available < this.shelfvariants.length) {
          this.toast.info('Item not added... Shelf Maxcount reached, please create another shelf for this product.');
          return;
        }
        if (items.shelf == null) {
          this.toast.info('Shelf not found, please create shelf for this group.');
          return;
        } else {
          let variants = items.variants || {};
          let groupid = variants.group_id || '';
          let checkvariant = variants.sku || '';
          let findvariant = checkvariant.split('_');
          //console.log(this.shelf.group_id + '', groupid + '')
          // if (this.shelf.group_id + '' != groupid + '') {
          // this.toast.info('Item not added... Please Scan Same Product group and Variant PSID');
          // return;
          // }
          // else
          if (shelf.available < this.shelfvariants.length) {
            this.toast.info('Item not added... Shelf Maxcount reached, please create another shelf for this product.');
            return;
          } else {
            // logic checks if the items are already scanned
            let samepsid = this.insbulkitems.findIndex((res) => res.psid == items.psid);
            if (samepsid < 0) {
              this.inwarditem = items || {};
              this.insbulkitems.push(items);
              this.scanbarcode = '';
            } else {
              //this.toast.failure('Item already scanned, try different item !');
            }
          }
        }
        // this.cdr.detectChanges();
      },
      error: (err) => {
        this.scanbarcode = '';
        let msg = err ? err : 'Item not found';
        console.log(msg);
        this.toast.info(msg);
        if (err === 'Add Variant to Current Item') {
          // this.getVariantList()
        }
      }
    });
  }

  closeModal() {
    this.showqcscan = true;
    this.modalRef.close();
  }

  removepsid(i: number) {
    this.insbulkitems.splice(i, 1);
    if (this.insbulkitems.length === 0) this.purchaseid = '0';
  }

  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.stockapprove.image = file;
    }
  }

  updateformstatus() {
    if (this.stockapprove.status !== 'Stocked' && this.stockapprove.comments === '') {
      this.actionreason = true;
      return;
    } else {
      const formd: any = new FormData();
      formd.append('status', this.stockapprove.status);
      formd.append('comments', this.stockapprove.comments);
      formd.append('image', this.stockapprove.image);
      formd.append('items', this.insbulkitems);

      if (confirm('Are you sure you want to proceed ?')) {
        this.inventoryservice.bulkstockmovedispute(this.inwarditem.psid, formd).subscribe({
          next: (resp) => {
            this.toast.success('Successfully Updated');
            this.scanbarcode = '';
            this.stockapprove = { status: '', comments: '', image: '' };
            this.actionreason = false;
          },
          error: (err) => {
            this.toast.failure(err);
          }
        });
      }
    }
  }

  opentoShelfScan(shelfQRUUID: any): void {
    this.showqcscan = false;
    this.modalRef = this.modalService.open(shelfQRUUID, { size: 'sm', animation: true });
    this.modalRef.result.then(
      () => {
        this.showqcscan = false;
      },
      () => {
        //console.log('Hellow')
        this.showqcscan = true;
      }
    );
  }

  variantdata(): UntypedFormArray {
    return this.addstockForm.get('variantlist') as UntypedFormArray;
  }

  cancelAction(): void {
    this.modalService.dismissAll();
  }
  get stockform() {
    return this.addstockForm.controls;
  }

  scantoShelf(billCounterQR: string) {
    this.addalertsound();
    if (this.shelves !== billCounterQR) {
      this.toast.failure('Shelf Mismatch');
      this.showShelf == false;
    } else {
      this.showShelf = true;
      this.shelf.id = billCounterQR;
    }
  }

  /* @desc : Shelf QR scan success*/
  movetoShelf(billCounterQR: string) {
    let items = this.insbulkitems.map((res) => res.psid);
    let data = { items: items, shelf: this.shelf.id || '', poid: this?.data?.id };
    this.inventoryservice.movetoshelf(data).subscribe({
      next: (resp) => {
        this.showShelf = false;
        let insertiem = resp || [];
        if (resp) {
          insertiem.map((invitem: string) => {
            let findex = this.insbulkitems.findIndex((res) => res == invitem);
            this.insbulkitems.splice(findex, 1);
          });
        }
        if (this.insbulkitems.length > 0) {
          this.toast.success('Successfully moved to Shelf.Some items not move shelf. Inform warehouse Operator');
        } else {
          this.inventoryservice.syncinventory(this.data?.uuid || '').subscribe({
            next: (resp) => {
              this.router.navigate(['/warehouse/orders/qc']);
              this.toast.success('Successfully moved to Shelf. Please place the items to shelf.');
              this.shelf = {};
              this.insbulkitems = []; // the array is empty here since backend has valdiation to check if the items are already part of any shelf.
              this.variantdata().clear();
              this.inwarditem.psid = '';
              this.modalService.dismissAll();
              this.addstockForm.reset();
            },
            error: () => {
              this.router.navigate(['/app/orders/qc']);
              this.toast.success('Successfully moved to Shelf. Please place the items to shelf.');
            }
          });
        }
      },
      error: (err: any) => {
        this.toast.failure(err);
      }
    });
    // } else {
    // this.toast.failure('Shelf not found... Scan correct shelf.. ' + this.shelf.shelfID);
    // }
    //this.toast.success('Stock moved inventory successfully');
    //this.router.navigate(['/app']);
  }
  get disputeform() {
    return this.disputeForm.controls;
  }
  openDispute(content: any, psid: any = '', poorderitemdid: any = '') {
    this.modalService.dismissAll();
    this.disputeForm.get('psid')?.setValue(psid);
    let checkitemindex = this.insbulkitems.findIndex((res) => res.psid === psid);
    if (checkitemindex > 0) {
      if (this.insbulkitems[checkitemindex]['status'] === 'Dispute') {
        if (confirm('Remove Dispute Confirmation. Do you want to proceed? ')) {
          const formd: any = new FormData();
          formd.append('psid', psid);
          formd.append('status', 'Remove');
          this.inventoryservice.saveDisupteItem(formd).subscribe({
            next: () => {
              this.insbulkitems[checkitemindex]['status'] = 'Group';
              this.disputeimage = '';
              this.disputeForm.reset();
              this.modalService.dismissAll();
              this.toast.success('Successfully Saved');
              this.showsubmit = true;
            },
            error: (err: any) => {
              this.toast.failure(err?.error?.message);
              this.showsubmit = true;
            }
          });
        }
      } else {
        this.disputeForm.get('purchaseorderitem_id')?.setValue(poorderitemdid);
        this.modalService.open(content, { size: 'md' });
      }
    }
  }

  saveDispute() {
    this.gsubmit = true;
    if (this.disputeForm.invalid) {
      return;
    }
    let psid = this.disputeForm.get('psid')?.value;
    const formd: any = new FormData();
    formd.append('psid', psid);
    formd.append('purchaseorderitem_id', this.disputeForm.get('purchaseorderitem_id')?.value);
    formd.append('reason', this.disputeForm.get('reason')?.value);
    formd.append('image', this.disputeForm.get('photo')?.value);
    this.showsubmit = false;
    this.inventoryservice.saveDisupteItem(formd).subscribe({
      next: () => {
        let checkitemindex = this.insbulkitems.findIndex((res) => res.psid === psid);
        if (checkitemindex > 0) {
          this.insbulkitems[checkitemindex]['status'] = 'Dispute';
        }
        this.disputeimage = '';
        this.disputeForm.reset();
        this.modalService.dismissAll();
        this.toast.success('Successfully Saved');
        this.showsubmit = true;
      },
      error: (err: any) => {
        this.toast.failure(err?.error?.message);
        this.showsubmit = true;
      }
    });
  }

  onSelectedImage(event: any) {
    var mimeType = event.target.files[0].type;

    if (event.target.files && event.target.files[0] && mimeType.match('image.*')) {
      this.disputeForm.get('photo')?.setValue(event.target.files[0]);
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.disputeimage = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.disputeForm.get('photo')?.setValue('');
      this.toast.failure('Upload Image only');
    }
  }

  saveStock() {
    this.submit = true;
    if (this.addstockForm.invalid) {
      return;
    }
    let data = this.addstockForm.value;
    data.items = this.inwarditem.psid;

    this.inventoryservice.createqcstock(data).subscribe({
      next: (resp) => {
        //let valueform =this.addstockForm.value;
        let item: any = { item: data.items, value: [] };
        data.variantlist.forEach((resvariant: any) => {
          if (this.variantsvalues[resvariant.key]) {
            item.value.push(this.variantsvalues[resvariant.key]['value'][resvariant.variant] || '');
          }
        });
        this.toast.success('Stock added successfully');

        this.inwarditem.psid = '';
      },
      error: (err: any) => {
        this.toast.failure(err);
      }
    });
  }
  onCodeResult(resultString: string) {
    // console.log('Hellow', resultString);
    //this.qrResultString = resultString;
    this.addalertsound();
    this.scanbarcode = resultString;
    this.verifyQRcode();
  }
  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  toggleTorch(): void {
    this.torchEnabled = !this.torchEnabled;
  }

  toggleTryHarder(): void {
    this.tryHarder = !this.tryHarder;
  }
  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }
  clearResult(): void {
    this.qrResultString = '';
  }
  addalertsound() {
    var context = new window.AudioContext();
    var osc = context.createOscillator(); // instantiate an oscillator
    osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
    osc.frequency.value = 440; // Hz
    osc.connect(context.destination); // connect it to the destination
    osc.start(); // start the oscillator
    osc.stop(context.currentTime + 1); // stop 2 seconds after the current timecom
  }

  selproduct: Product = {};

  onSelectedFile_image(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      var mimeType = event.target.files[0].type;
      let cimage: File;
      //console.log(mimeType);

      if (!mimeType.match('image.*')) {
        this.toast.failure('Upload Image only');
        return;
      } else {
        this.addfile = file;
        const formsize: any = new FormData();
        this.compressImage
          .compress(file)
          .pipe(take(1))
          .subscribe((compressedImage: File) => {
            // formsize.append('image', compressedImage);
            cimage = compressedImage;
            formsize.append('image', cimage);
            this.barcodeservice.savesizechart(this.barcodeValue, formsize).subscribe({
              next: (resp) => {
                this.fileName = resp;
                // console.log(resp);
                this.toast.success('Successfully Updated');
                // this.disputeForm.get('image').setValue(resp.image)
                // this.disputeForm.get('image').setValue(this.fileName.image);
                this.cdr.detectChanges();
              },
              error: (err) => {
                this.toast.failure(err);
                console.log('error file');
              }
            });
            // console.log(`Image size after compressed: ${compressedImage.size} bytes.`);
          });
      }
    }
  }
  SelectedImage(event: any) {
    if (event.target.files.length > 0) {
      let file = event.target.files[0];
      var mimeType = event.target.files[0].type;
      let cimage: File;
      //console.log(mimeType);
      let image = event.target.files[0];
      // console.log(`Image size before compressed: ${image.size} bytes.`);

      if (!mimeType.match('image.*')) {
        this.toast.failure('Upload Image only');
        return;
      } else {
        this.addfile = image;
        const formsize: any = new FormData();
        this.compressImage
          .compress(file)
          .pipe(take(1))
          .subscribe((compressedImage: File) => {
            cimage = compressedImage;
            formsize.append('image', cimage);
            this.barcodeservice.saveimage(this.barcodeValue, formsize).subscribe({
              next: (resp) => {
                this.fileName = resp;
                // console.log(resp.image);
                this.toast.success('Successfully Updated');
                this.disputeForm.get('image').setValue(resp.image);
                this.disputeForm.get('image').setValue(this.fileName.image);
                this.cdr.detectChanges();
              },
              error: (err) => {
                this.toast.failure(err);
                // console.log('error file');
              }
            });
            // console.log(compressedImage);
            // console.log(`Image size after compressed: ${compressedImage.size} bytes.`);
          });
      }
    }
  }

  // barcodeArray: []= [];
  saveBarcodeDetail() {
    this.submit = true;
    this.color_code = '';
    // this.clr = this.clr;
    // this.disputeForm.get('image').setValue(this.fileName.image);
    if (this.disputeForm.invalid) {
      // console.log(this.disputeForm.value, this.disputeForm.value);
      return;
    }
    // console.log(this.disputeForm.value);
    let obj = this.tableArray.find((o: any) => o.barcode === this.disputeForm.get('barcode').value);

    // console.log('valueArr', this.disputeForm.value);
    if (!this.isupdate) {
      if (
        (this.disputeForm.get('qty').value == null ||
          this.disputeForm.get('image').value == '' ||
          this.disputeForm.get('shelf_id').value == '' ||
          this.disputeForm.get('color').value == '') &&
        this.isupdate == false
      ) {
        this.toast.failure('Fill all the required fields');
      } else {
        this.barcodeservice.create(this.disputeForm.value, this.barcodeValue).subscribe({
          next: (resp) => {
            // console.log(resp);
            this.respArray = resp;
            // console.log('valueArr', this.tableArray);
            if (this.tableArray.find((o: any) => o.barcode === this.disputeForm.get('barcode').value || undefined)) {
              this.toast.failure('Product already Added');
              this.disputeForm.reset();
            } else {
              this.changevendor = false;
              this.tableArray.push(this.respArray.data);
              // console.log(this.tableArray);
              this.toast.success('Product added Successfully');
              this.disputeForm.reset();
              this.submit = false;
              this.issaved = true;
            }
          },
          error: (err) => {
            this.toast.failure(err);
            this.disputeForm.reset();
          }
        });
      }
    }

    if (this.isupdate) {
      if (
        this.disputeForm.get('qty').value == null ||
        this.disputeForm.get('shelf_id').value == '' ||
        this.disputeForm.get('v_name').value == '' ||
        this.disputeForm.get('image').value == '' ||
        (this.disputeForm.get('color').value == '' && !this.isupdate)
      ) {
        this.toast.failure('Fill all the required fields');
      } else {
        // console.log(this.disputeForm.value);
        this.barcodeservice.newBarcode(this.disputeForm.value).subscribe({
          next: (resp) => {
            // console.log(resp);
            this.respArray = resp;
            // console.log(this.respArray, resp);

            this.tableArray.push(this.respArray);
            // console.log(this.tableArray);
            this.changevendor = false;
            this.toast.success('Product added Successfully');
            this.disputeForm.reset();
            this.issaved = true;
            this.isupdate = false;
          },
          error: (err) => {
            this.toast.failure(err);
          }
        });
      }
    }
  }

  deleteBarcode(barcode: BarCode): void {
    // console.log('inside', barcode.barcode);

    const modalRef = this.modalService.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Barcode Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then(
      (parameterResponse) => {
        this.barcodeservice.delete(barcode).subscribe({
          next: (resp: any) => {
            // console.log(resp);
            this.toast.success('Barcode Deleted Successfully');
            this.list();
            let found = this.tableArray.findIndex((x: { barcode: any }) => x.barcode == resp.data.barcode);
            // console.log(found);
            let removeObject = this.tableArray.splice(0, found).concat(this.tableArray.slice(found + 1));
            this.tableArray = removeObject;
          },
          error: (err: any) => {
            this.toast.failure(err);
          }
        });
      },
      (err: any) => {
        // console.log(err);
        this.toast.failure('Something went wrong.. Barcode does not delete.');
      }
    );
  }

  color_code: string;
  color_change(event: any) {
    // console.log(event, event.value);
    // console.log(event.target.value);

    // const filter_clr = this.clr.filter(function (element: any) {
    //   return element.name == event.target.value;
    // });
    // console.log(filter_clr);
    // this.color_code = filter_clr[0].value;
    this.color_code = event.value;
    // console.log(this.color_code);
    this.clr = [...this.clr];
  }
}
