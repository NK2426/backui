import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { InventoryService } from '../../services/inventory.service';
import { PurchaseorderService } from '../../services/purchaseorder.service';
import { Categories, Inwarditem, Product, Productimage, Subcategories } from '../../models/product';
import { Productmapparam } from '../../models/productparameters';
import { Productvariants } from '../../models/productvariants';
import { Purchaseorder, Purchaseitem } from '../../models/purchaseorder';
import { DepartmentsService } from 'src/app/pages/category-head/services/departments.service';
import { Department } from '../../models/department';
import { Group } from 'src/app/pages/category-head/models/groups';
import { ProductvariantsService } from 'src/app/pages/category-head/services/productvariants.service';
import { Grn, Grnitem } from '../../models/grn';


@Component({
  selector: 'app-addqgrnqcstock',
  templateUrl: './addqgrnqcstock.component.html',
  styleUrls: ['./addqgrnqcstock.component.scss'],
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule, RouterModule, QRCodeModule, ZXingScannerModule]
})
export class AddgrnqcstockComponent implements OnInit {

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
  shelves: any = '';
  firstscan = 0;
  qrResultString: string = '';
  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  tryHarder = false;
  hasPermission: boolean = false;

  data?: Grn = {};

  showShelf: boolean = false;
  showqcscan: boolean = true;
  showsubmit: boolean = true;
  variantLists:any=[];
  currentgrnitem: Grnitem = {}

  departments: Department[] = []
  class: Categories[] = [];
  subclass: Subcategories[] = [];
  groups: Group[] = [];
  list: {
    receviedqty: any
  }
  selectedDept = ''; selectedBrand = ''; selectedClass = ''; selectedSubclass = ''; selectedGroup = '';
  scan: boolean = true;



  constructor(
    private route: ActivatedRoute, private router: Router,
    private inventoryservice: InventoryService, private toast: ToastService,
    private modalService: NgbModal, private fb: UntypedFormBuilder,
    private utlis: UtilsService,
    private fbdisput: FormBuilder,
    private poservice: PurchaseorderService,
    private cdr: ChangeDetectorRef,
    private departmentservice: DepartmentsService,
    private productvariantsservice: ProductvariantsService,
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
      photo: [''],
      grn_id:['', [Validators.required]]
    })

    let uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.poservice.inwardgrnDetail(uuid)
        .subscribe({
          next: data => {
            this.data = data;
            // this.cdr.detectChanges();
          },
          error: () => {
          }
        });
    }

    // this.poservice.fulldetail(uuid)
    // .subscribe({
    //   next: data => {
    //     this.data = data;
    //             // this.cdr.detectChanges();
        
    //   },
    //   error: () => {
    //   }
    // });
    // console.log( this.list);
    

    this.departmentservice.findList()
      .subscribe({
        next: data => {
          this.departments = data;
        },
        error: () => {
          this.departments = []
        }
      });

  }
  verifyQRcode() {
    let insbulkitemscheck = this.insbulkitems.length;
    if (insbulkitemscheck > 0) {
      this.scanQRcode()
    } else {
      this.inventoryservice.grnstockfind(this.scanbarcode, (this.data?.purchaseorder?.id || ''), {})
        .subscribe({
          next: items => {
            let initems = items.data || {}
            let shelf = initems.shelf || {}

            if (!initems.variants) {
              this.toast.info('Item not found, please inform to warehouse operator.');
              return;
            }
            // if (initems.shelf == null) {
            //   this.toast.info('Shelf not found, please create shelf for this product variant.');
            //   return;
            // }
            // if (initems.shelf != null && shelf.available < 1) {
            //   this.toast.info('Shelf Maxcount reached, please create another shelf for this product.');
            //   return;
            // }

            let samepsid = this.insbulkitems.findIndex(res => res.psid == initems.psid);
            if (samepsid < 0) {
              this.inwarditem = initems || {};
              this.viewProduct = initems.product || {}
              this.purchaseid = initems.purchaseorder_id || '';

              this.currentgrnitem = this.data?.grnitems?.find(x => x.id == initems?.grnitem_id) || {}
              let insertedvarcount = this.insbulkitems.filter(y => y.grnitem_id == this.inwarditem?.grnitem_id && y.status != "Dispute")
              let overallinwardqty = parseInt(insertedvarcount.length + initems.inwardcount)
              if (this.currentgrnitem && this.currentgrnitem?.receivedqty) {
                if (this.currentgrnitem?.receivedqty <= overallinwardqty) {
                  this.toast.info('you are not able to scan this item psid against invoice qty.');
                  return;
                }
              }

              if (initems.productimages && initems.productimages.length > 2) {
                this.images = initems.productimages.slice(0, 2); // show only two images from the list
              } else {
                this.images = initems.productimages || [];
              }
              let variantlist: Productvariants[] = [];
              this.purchase = initems.purchaseorder || {}
              this.shelf = initems.shelf || { shelfID:1 }

              /// shelf products = productvariants ///
              this.shelfvariants = { variants: '', group:  '', length: 1 }//initems.shelf.group_id || //this.shelf.products || 
              this.insbulkitems.push(this.inwarditem)
              this.firstscan = 0;
              if (this.variants.length === 0) {
                if (initems && initems.parameterlist)
                  this.productmapparams = initems.parameterlist;

                this.resetdata = Object.assign([], this.variantdata());
                this.variants = variantlist;
              }
              this.scanbarcode = '';
            }
          },
          error: (err:any) => {
            this.scanbarcode = '';
            //let msg = (err.error.message) ? err.error.message : 'Item not found';
            //this.inwarditem = {};
            console.log(err)
            this.toast.info(err);
          }
        });
      //}
    }
  }
  getVariantList() {
    this.modalService.open("novarients");
    this.poservice.getvariantlist('2544')
      .subscribe({
        next: data => {
          this.variantLists = data
          // console.log(this.variantLists);
          // console.log(this.variantLists[0].productvariantvalues[0]);
          // this.cdr.detectChanges();
        },
        error: () => {
        }
      });
  }
  scanQRcode() {
    let length: number = this.insbulkitems.length || 1
    this.shelfvariants.length = (length + 1);
    this.inventoryservice.grnstockfind(this.scanbarcode, this.data?.purchaseorder?.id, this.shelfvariants)
      .subscribe({
        next: items => {
          let initems = items.data || {}
          let shelf = initems.shelf || {}
          if (!initems.variants) {
            this.toast.info('Item not found, please inform to warehouse operator.');
            return;
          }
          this.currentgrnitem = this.data?.grnitems?.find(x => x.id == initems?.grnitem_id) || {}
          let inwardcount = this.insbulkitems.filter(x => x.grnitem_id == initems?.grnitem_id && x.status != "Dispute")
          //console.log(inwardcount);
          //console.log(initems.inwardcount)
          let overallinwardqty = parseInt(inwardcount.length + initems.inwardcount)
          if (this.currentgrnitem && this.currentgrnitem?.receivedqty) {
            //console.log(this.currentgrnitem?.receivedqty + "<=" + overallinwardqty)
            if (this.currentgrnitem?.receivedqty <= overallinwardqty) {
              this.toast.info('you are not able to scan this item psid against invoice qty.');
              return;
            }
          }
          // if (initems.shelf == null) {
          //   this.toast.info('Shelf not found, please create shelf for this group and variant.');
          //   return;
          // } else {
            let variants = initems.variants || {}
            let groupid = variants.group_id || '';
            let checkvariant = variants.sku || ''
            let findvariant = checkvariant.split('_');
            this.shelf = initems.shelf || { shelfID: 1 };

            // if (this.shelf.group_id + '' != groupid + '') {//|| findvariant.includes(shelf.products + '') === false
            //   this.toast.info('Item not added... Please Scan Same Product group and Variant PSID');
            //   return;
            // }
            // else if (shelf.available < this.shelfvariants.length) {
            //   this.toast.info('Item not added... Shelf Maxcount reached, please create another shelf for this product.');
            //   return;
            // }
            // else { // logic checks if the items are already scanned
              let samepsid = this.insbulkitems.findIndex(res => res.psid == initems.psid);
              if (samepsid < 0) {
                this.inwarditem = initems || {};
                this.insbulkitems.push(initems)
                this.scanbarcode = '';
              } else {
                //this.toast.failure('Item already scanned, try different item !');
              }
            //}
          //}
        },
        error: (err) => {
          this.scanbarcode = '';
          //let msg = (err.error.message) ? err.error.message : 'Item not found';
          //this.inwarditem = {};
          console.log(err.error.data)
          this.toast.info(err.error.data);
        }
      })
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

      if (confirm('Are you sure you want to proceed ?')) {
        this.inventoryservice.bulkstockmovedispute(this.inwarditem.psid, formd).subscribe({
          next: resp => {
            this.toast.success('Successfully Updated');
            this.scanbarcode = '';
            this.stockapprove = { status: '', comments: '', image: '' };
            this.actionreason = false
          }, error: err => {
            this.toast.failure(err);
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
      //console.log('Hellow')
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
    this.addalertsound()
    if (this.shelves !== billCounterQR) {
      this.toast.failure('Shelf Mismatch')
      this.showShelf == false
    } else {
      this.showShelf = true;
      this.shelf.id = billCounterQR;
    }
  }

  /* @desc : Shelf QR scan success  */
  movetoShelf(billCounterQR: string) {
    console.log(billCounterQR)
    let items = this.insbulkitems.map(res => res.psid)
    let data = { items: items, shelf: this.shelf.id || '', poid: this?.data?.purchaseorder?.id, grnid: this?.data?.grnid, id: this?.data?.id }
    this.inventoryservice.grnmovetoshelf(data).subscribe({
      next: resp => {
        this.showShelf = false;
        let insertiem = resp || []
        let insbulkitems = this.insbulkitems.filter(x=>(x.status!=='Dispute'))
        if (resp) {
          insertiem.map((invitem: string) => {
            let findex = insbulkitems.findIndex(res => res == invitem);
            insbulkitems.splice(findex, 1)
          })
        }
        console.log(insbulkitems)
        if (insbulkitems.length > 0) {
          this.toast.success('Successfully moved to Shelf.  Some items not move shelf. Inform warehouse Operator');
        } else {
          this.inventoryservice.grnsyncinventory(this.data?.grnid || '').subscribe({
            next: resp => {
              this.router.navigate(['/warehouse/orders/grnqc']);
              this.toast.success('Successfully moved to inventory.');
              this.shelf = {}
              this.insbulkitems = []; // the array is empty here since backend has valdiation to check if the items are already part of any shelf.
              this.variantdata().clear();
              this.inwarditem.psid = ''
              this.modalService.dismissAll();
              this.addstockForm.reset()
            },
            error: () => {
              this.router.navigate(['/warehouse/orders/grnqc']);
              this.toast.success('Successfully moved to inventory.');
            }
          })
        }
      }, error: (err: any) => {
        this.toast.failure(err);
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
    if (checkitemindex >= 0) {
      if (this.insbulkitems[checkitemindex]['status'] === 'Dispute') {

        if (confirm('Remove Dispute Confirmation. Do you want to proceed? ')) {

          const formd: any = new FormData();
          formd.append('psid', psid);
          formd.append('status', 'Remove');
          this.inventoryservice.savegrnDisupteItem(formd).subscribe({
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
        this.disputeForm.get("grn_id")?.setValue(this.data?.id);
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
    formd.append('grn_id', this.disputeForm.get('grn_id')?.value);
    this.showsubmit = false;
    this.inventoryservice.savegrnDisupteItem(formd).subscribe({
      next: () => {
        let checkitemindex = this.insbulkitems.findIndex(res => res.psid === psid);
        if (checkitemindex >= 0) {
          this.insbulkitems[checkitemindex]['status'] = 'Dispute';
        }
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
        this.toast.success('Stock added successfully');

        this.inwarditem.psid = ''

      }, error: (err: any) => {
        this.toast.failure(err);
      }
    })
  }
  onCodeResult(resultString: string) {
    //console.log("Hellow")
    //this.qrResultString = resultString;
    this.addalertsound()
    this.scanbarcode = resultString;
    if (this.scan)
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

  changeDepartment(dept: any) {
    this.selectedClass = '';
    this.selectedSubclass = '';
    this.selectedBrand = '';
    this.class = [];
    this.subclass = [];

    // console.log('if condition start');
    if (dept) {
      // console.log('inside if');
      this.selectedDept = dept.did;

      this.productvariantsservice.catlist(dept.did)
        .subscribe({
          next: data => {
            this.class = data;
            // console.log(this.class);
            // this.list()
          }
        });

      this.productvariantsservice.subcatlist(dept.did, '0')
        .subscribe({
          next: data => {
            this.subclass = data;
            // console.log(this.subclass);
            // this.list()
          }
        });

      this.productvariantsservice.grouplist(dept.did, '0')
        .subscribe({
          next: data => {
            this.groups = data;
            // console.log('groups =>', this.groups);
            // this.list()
          }
        });
    }
    else {
      this.selectedDept = ''
      // this.list()
      console.log('error');
    }
  }

  changeCategory(category: any) {
    this.selectedSubclass = '';
    if (category) {
      this.selectedClass = category.cid;
      this.productvariantsservice.subcatlist(this.selectedDept, this.selectedClass)
        .subscribe({
          next: subclass => {
            // let subclassdata: Subcategories[] = []
            // if (subclass.length > 0) {
            //   vendors.forEach((val) => {
            //     if (val.user)
            //       vendordata.push({ id: val.vendor_id, name: val.user.name })
            //   })
            // }
            this.subclass = subclass;
          }
        });
    }
    else {
      this.selectedClass = '';
      this.productvariantsservice.subcatlist(this.selectedDept, '0')
        .subscribe({
          next: subclass => {
            // let subclassdata: Subcategories[] = []
            // if (subclass.length > 0) {
            //   vendors.forEach((val) => {
            //     if (val.user)
            //       vendordata.push({ id: val.vendor_id, name: val.user.name })
            //   })
            // }
            this.subclass = subclass;
          }
        });
      this.productvariantsservice.grouplist(this.selectedDept, '0')
        .subscribe({
          next: groups => {
            this.groups = groups;
          }
        });
    }
    // this.list()
  }

  changeSubcategory(subcat: any) {
    this.groups = [];
    this.selectedGroup = ''
    if (subcat) {
      this.selectedSubclass = subcat.id;
      this.productvariantsservice.grouplist(this.selectedDept, this.selectedSubclass)
        .subscribe({
          next: groups => {
            this.groups = groups;
          }
        });

    }
    else {
      this.selectedSubclass = ''
      this.productvariantsservice.grouplist(this.selectedDept, '0')
        .subscribe({
          next: groups => {
            this.groups = groups;
          }
        });
    }
    // this.list()
  }

  changeGroup(group: any) {
    if (group) {
      this.selectedGroup = group.id;
    }
    else {
      this.selectedGroup = ''
    }
    // this.list()
  }

}