import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QRCodeModule } from 'angularx-qrcode';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from 'src/app/_helpers/toast.service';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { environment } from 'src/environments/environment';
import { Inwarditem, Product, Productimage } from '../../models/product';
import { Productmapparam } from '../../models/productparameters';
import { Productvariants } from '../../models/productvariants';
import { Purchaseorder } from '../../models/purchaseorder';
import { InventoryService } from '../../services/inventory.service';
import { PurchaseorderService } from '../../services/purchaseorder.service';



@Component({
  selector: 'app-singleqcstock',
  templateUrl: './singleqcstock.component.html',
  styleUrls: ['./singleqcstock.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule, ZXingScannerModule]
})
export class SingleqcstockComponent implements OnInit {


  inwarditem: Inwarditem = {};
  viewProduct: Product = {};
  scanbarcode = '';
  status: Array<{ id: string, name: string }> = [{ id: 'Inventory', name: 'Everything OK' }, { id: 'Damage', name: 'Damage' }, { id: 'Variant Not Match', name: 'Product Variant Not Match' }, { id: 'Parameter Not Match', name: 'Product Parameter Not Match' }];
  stockapprove = { status: '', comments: '', image: '' };
  actionreason = false;
  submit: boolean = false;
  groupForm !: UntypedFormGroup;
  addstockForm !: UntypedFormGroup;
  variants: Productvariants[] = [];
  variantsvalues: any = {};
  images: Productimage[] = [];
  baseurl: string = ''
  insbulkitems: any[] = []
  purchaseid: string = '0';
  resetdata !: UntypedFormArray;
  productmapparams: Productmapparam[] = []
  purchase: Purchaseorder = {}
  modalRef: any = {}
  shelfvariants: any = {};
  //// Dispute Form ///
  disputeForm !: FormGroup;
  gsubmit: Boolean = false;
  disputetypes: Array<{ id: string, name: string }> = [{ id: 'Damage', name: 'Damage' }, { id: 'Quality Issue', name: 'Quality Issue' }, { id: 'Missing Parts', name: 'Missing Parts' }, { id: 'Excess', name: 'Excess' }, { id: 'Shortage', name: 'Shortage' }, { id: 'Intransit Damage', name: 'Intransit Damage' }, { id: 'PSID missing', name: 'PSID missing' }, { id: 'Tag missing', name: 'Tag missing' }, { id: 'PSID/Tag damage', name: 'PSID/Tag damage' }];
  disputeimage: string = '';
  /////
  shelf: any = { id: 0 }
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



  constructor(
    private route: ActivatedRoute, private router: Router,
    private inventoryservice: InventoryService, private toast: ToastService,
    private modalService: NgbModal, private fb: UntypedFormBuilder,
    private utlis: UtilsService,
    private fbdisput: FormBuilder,
    private poservice: PurchaseorderService
  ) { }
  ngOnInit(): void {
    this.baseurl = environment.WAREHOUSE_SITE_URL;
    this.addstockForm = this.fb.group({
      variantlist: this.fb.array([]),
    })

    this.disputeForm = this.fbdisput.group({
      psid: ['', [Validators.required]],
      purchaseorderitem_id: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      photo: ['']
    })

    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.poservice.fulldetail(uuid)
        .subscribe({
          next: data => {
            this.data = data;
          },
          error: () => {
          }
        });
    }

  }
  verifyQRcode() {
    let insbulkitemscheck = this.insbulkitems.length;
    if (insbulkitemscheck > 0) {
      this.scanQRcode()
    } else {
      //if (this.firstscan === 0) {
      //this.firstscan = 1;
      this.inventoryservice.stockfindsingle(this.scanbarcode, {})
        .subscribe({
          next: items => {
            items = items.data || {}
            let shelf = items.shelf || {}
            if (!items.variants) {
              this.toast.info('Item not found, please inform to warehouse operator.');
              return;
            }
            if (items.shelf == null) {
              this.toast.info('Shelf not found, please create shelf for this product variant.');
              return;
            }
            if (items.shelf != null && shelf.available < 1) {
              this.toast.info('Shelf Maxcount reached, please create another shelf for this product.');
              return;
            }

            let samepsid = this.insbulkitems.findIndex(res => res.psid == items.psid);
            if (samepsid < 0) {
              this.inwarditem = items || {};
              this.viewProduct = items.product || {}
              this.purchaseid = items.purchaseorder_id || '';
              if (items.productimages && items.productimages.length > 2) {
                this.images = items.productimages.slice(0, 2); // show only two images from the list
              } else {
                this.images = items.productimages || [];
              }
              let variantlist: Productvariants[] = [];
              this.purchase = items.purchaseorder || {}
              this.shelf = items.shelf || {}

              /// shelf products = productvariants ///
              this.shelfvariants = { variants: this.shelf.products || '', group: items.shelf.group_id || '', length: 1 }
              this.insbulkitems.push(this.inwarditem)
              this.firstscan = 0;
              if (this.variants.length === 0) {
                if (items && items.parameterlist)
                  this.productmapparams = items.parameterlist;

                this.resetdata = Object.assign([], this.variantdata());
                this.variants = variantlist;
              }
              this.scanbarcode = '';
            }
          },
          error: (err) => {
            this.scanbarcode = '';
            let msg = (err) ? err : 'Item not found';
            //this.inwarditem = {};
            //console.log(err.error.data)
            this.toast.info(err);
          }
        });
      //}
    }
  }
  scanQRcode() {
    let length: number = this.insbulkitems.length || 1

    ////console.log(this.insbulkitems, this.insbulkitems.includes(this.scanbarcode))

    if (this.insbulkitems.findIndex(res => res.psid == this.scanbarcode) < 0) {
      this.shelfvariants.length = (length + 1);
      this.inventoryservice.stockfindsingle(this.scanbarcode, this.shelfvariants)
        .subscribe({
          next: items => {
            items = items.data || {}
            let shelf = items.shelf || {}
            if (!items.variants) {
              this.toast.info('Item not found, please inform to warehouse operator.');
              return;
            }
            if (items.shelf == null) {
              this.toast.info('Shelf not found, please create shelf for this group and variant.');
              return;
            } else {
              let variants = items.variants || {}
              let groupid = variants.group_id || '';
              let checkvariant = variants.sku || ''
              let findvariant = checkvariant.split('_');
              // console.log(this.shelf.group_id + '' ,groupid + '' , findvariant.includes(shelf.products + ''))

              // if (this.shelf.group_id + '' != groupid + '' || findvariant.includes(shelf.products + '') === false) {
              //   this.toast.info('Item not added... Please Scan Same Product group and Variant Tag');
              //   return;
              // }
              // else 
              if (shelf.available < this.shelfvariants.length) {
                this.toast.info('Item not added... Shelf Maxcount reached, please create another shelf for this product.');
                return;
              }
              else { // logic checks if the items are already scanned
                let samepsid = this.insbulkitems.findIndex(res => res.psid == items.psid);
                if (samepsid < 0) {
                  this.inwarditem = items || {};
                  this.insbulkitems.push(items)
                  this.scanbarcode = '';
                } else {
                  //this.toast.failure('Item already scanned, try different item !');
                }
              }
            }
          },
          error: (err) => {
            this.scanbarcode = '';
            let msg = (err.error.message) ? err.error.message : 'Item not found';
            //this.inwarditem = {};
            //console.log(err.error.data)
            this.toast.info(err.error.data);
          }
        })
    }
  }
  closeModal() {
    this.showqcscan = true;
    this.modalRef.close();
  }
  removepsid(i: number) {
    this.insbulkitems.splice(i, 1);
    if (this.insbulkitems.length === 0)
      this.purchaseid = '0';
  }
  onSelectedFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.stockapprove.image = file
    }
  }
  updateformstatus() {
    if (this.stockapprove.status !== 'Stocked' && this.stockapprove.comments === '') {
      this.actionreason = true
      return
    } else {
      const formd: any = new FormData();
      formd.append('status', this.stockapprove.status);
      formd.append('comments', this.stockapprove.comments);
      formd.append('image', this.stockapprove.image);
      formd.append('items', this.insbulkitems);

      if (confirm('Do you want to proceed?')) {

        this.inventoryservice.bulkstockmovedispute(this.inwarditem.psid, formd).subscribe({
          next: resp => {
            this.toast.success('Successfully Updated');
            //this.inwarditem = {}
            //this.viewProduct = {}
            this.scanbarcode = '';
            this.stockapprove = { status: '', comments: '', image: '' };
            this.actionreason = false
          }, error: err => {
            this.toast.failure(err.error.message);
          }
        })
      }
    }
  }
  opentoShelfScan(shelfQRUUID: any): void {
    this.showqcscan = false;
    this.modalRef = this.modalService.open(shelfQRUUID, { size: 'sm', animation: true });
    this.modalRef.result.then(() => {
      this.showqcscan = false;
    }, () => {
      ////console.log('Hellow')
      this.showqcscan = true;
    })
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
    //if (billCounterQR === this.shelf.shelfID) {
    this.addalertsound()
    this.showShelf = true;
    this.shelf.id = billCounterQR;
    // } else {
    //   this.toast.failure('Shelf not found... Scan correct shelf.. ' + this.shelf.shelfID);
    // }
    //this.toast.success('Stock moved inventory successfully');
    //this.router.navigate(['/app']);
  }

  /* @desc : Shelf QR scan success  */
  movetoShelf(billCounterQR: string) {
    //if (billCounterQR === this.shelf.shelfID) {
    let items = this.insbulkitems.map(res => res.psid)
    let data = { items: items, shelf: this.shelf.id || '', poid: this?.data?.id }
    this.inventoryservice.returnsmovetoshelf(data).subscribe({
      next: resp => {
        this.showShelf = false;
        let insertiem = resp.data || []
        if (insertiem.length > 0) {
          this.toast.success('Successfully moved to Shelf.  Some items not move shelf.');
        } else {
          this.toast.success('Successfully moved to Shelf. Please place the items to shelf.');
          this.shelf = {}
          this.images = []
          this.insbulkitems = []; // the array is empty here since backend has valdiation to check if the items are already part of any shelf.
          this.variantdata().clear();
          this.inwarditem.psid = ''
          this.modalService.dismissAll();
          this.addstockForm.reset()
        }
      }, error: (err: any) => {
        this.toast.failure(err.error.message);
      }
    })
    // } else {
    //   this.toast.failure('Shelf not found... Scan correct shelf.. ' + this.shelf.shelfID);
    // }
    //this.toast.success('Stock moved inventory successfully');
    //this.router.navigate(['/app']);
  }
  get disputeform() {
    return this.disputeForm.controls;
  }
  openDispute(content: any, psid: any = '', poorderitemdid: any = '') {
    this.modalService.dismissAll();
    this.disputeForm.get("psid")?.setValue(psid);
    let checkitemindex = this.insbulkitems.findIndex(res => res.psid === psid);
    if (checkitemindex > 0) {
      if (this.insbulkitems[checkitemindex]['status'] === 'Dispute') {
        if (confirm('Are you ok to proceed?')) {

          const formd: any = new FormData();
          formd.append('psid', psid);
          formd.append('status', 'Remove');
          this.inventoryservice.saveDisupteItem(formd).subscribe({
            next: () => {
              this.insbulkitems[checkitemindex]['status'] = 'Group';
              this.disputeimage = '';
              this.disputeForm.reset()
              this.modalService.dismissAll();
              this.toast.success('Successfully Saved');
              this.showsubmit = true;
            }, error: (err: any) => {
              this.toast.failure(err?.error?.message);
              this.showsubmit = true;
            }
          });
        }
      } else {
        this.disputeForm.get("purchaseorderitem_id")?.setValue(poorderitemdid);
        this.modalService.open(content, { size: 'md' });
      }
    }
  }
  saveDispute() {
    this.gsubmit = true;
    if (this.disputeForm.invalid) {
      return;
    }
    // let psid = this.disputeForm.get('psid')?.value;
    // const formd: any = new FormData();
    // formd.append('psid', psid);
    // formd.append('purchaseorderitem_id', this.disputeForm.get('purchaseorderitem_id')?.value);
    // formd.append('reason', this.disputeForm.get('reason')?.value);
    // formd.append('image', this.disputeForm.get('photo')?.value);
    // this.showsubmit = false;
    // this.inventoryservice.saveDisupteItem(formd).subscribe({
    //   next: () => {
    //     let checkitemindex = this.insbulkitems.findIndex(res => res.psid === psid);
    //     if (checkitemindex > 0) {
    //       this.insbulkitems[checkitemindex]['status'] = 'Dispute';
    //     }
    //     this.disputeimage = '';
    //     this.disputeForm.reset()
    //     this.modalService.dismissAll();
    //     this.toast.success('Successfully Saved');
    //     this.showsubmit = true;
    //   }, error: (err: any) => {
    //     this.toast.failure(err?.error?.message);
    //     this.showsubmit = true;
    //   }
    // });
  }


  onSelectedImage(event: any) {
    var mimeType = event.target.files[0].type;

    if (event.target.files && event.target.files[0] && mimeType.match('image.*')) {
      this.disputeForm.get("photo")?.setValue(event.target.files[0]);
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.disputeimage = event.target.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else {
      this.disputeForm.get("photo")?.setValue('');
      this.toast.failure("Upload Image only");
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
      next: resp => {
        //let valueform =  this.addstockForm.value;
        let item: any = { item: data.items, value: [] };
        data.variantlist.forEach((resvariant: any) => {
          if (this.variantsvalues[resvariant.key]) {
            item.value.push(this.variantsvalues[resvariant.key]['value'][resvariant.variant] || '')
          }
        })
        // let checkitem = this.insbulkitems.findIndex(res => res.item === this.inwarditem.psid);
        // if (checkitem >= 0) {
        //   this.insbulkitems.splice(checkitem, 1);
        //   this.insbulkitems.push(item)
        // } else {
        //   this.insbulkitems.push(item)
        // }
        //this.addstockForm.reset(this.resetdata)
        this.toast.success('Stock added successfully');
        //this.variantdata().clear();
        this.inwarditem.psid = ''
        //this.modalService.dismissAll();
        //this.addstockForm.reset()
        //this.router.navigate(['/app/stocks']);
      }, error: (err: any) => {
        this.toast.failure(err.error.message);
      }
    })
  }
  onCodeResult(resultString: string) {
    //this.qrResultString = resultString;
    this.addalertsound()
    this.scanbarcode = resultString;
    this.verifyQRcode()
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
    var context = new (window.AudioContext)();
    var osc = context.createOscillator(); // instantiate an oscillator
    osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
    osc.frequency.value = 440; // Hz
    osc.connect(context.destination); // connect it to the destination
    osc.start(); // start the oscillator
    osc.stop(context.currentTime + 1); // stop 2 seconds after the current time
  }

}