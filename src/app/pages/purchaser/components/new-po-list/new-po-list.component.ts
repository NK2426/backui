import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductsService } from 'src/app/pages/category-head/services/products.service';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { ToastService } from 'src/app/_helpers/toast.service';
import { SharedModule } from 'src/app/_themes/shared/shared.module';
import { Product } from '../../models/product';
import { Department, Purchaseorder, Purchaseorderpaginate, Vendor, purchaseid } from '../../models/purchaseorder';
import { PurchaseorderService } from '../../services/purchaseorder.service';
import { UsersService } from 'src/app/pages/hr/services/users.service';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'app-new-po-list',
  standalone: true,
  imports: [
    DatePipe,
    NgFor,
    FormsModule,
    NgbTypeaheadModule,
    RouterModule,
    NgbPaginationModule,
    NgIf,
    SharedModule,
    NgSelectModule,
    NgxPermissionsModule
  ],
  providers: [DatePipe],
  templateUrl: './new-po-list.component.html',
  styleUrls: ['./new-po-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewPoListComponent {
  orders?: Purchaseorder[];
  ordersPaginate?: Purchaseorderpaginate;
  /// Paginate ////
  search = '';
  page: number = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];
  collectionSize: number = 0;
  title: any = 'Purchase Orders';
  public user = JSON.parse(sessionStorage.getItem('token') || '{}');
  type = '';

  departments: Department[] = [];
  products: Product[] = [];
  vendors: Vendor[] = [];
  selectedDept = '3';
  selectedProduct = '';
  selectedVendor = '';
  selectedWarehouse: number;
  selectedPurchaser = '';
  datas: any = [];
  purchaseid: purchaseid[] = [];
  routestate: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseorderservice: PurchaseorderService,
    private cd: ChangeDetectorRef,
    private modelservice: NgbModal,
    private toast: ToastService,
    private porderservice: PurchaseorderService,
    private productservice: ProductsService,
    private userservice: UsersService
  ) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        ////console.log('NavigationEnd --- ', event.url);
        this.routestate = event.url;
        this.type = this.routestate.split('/')[2];
        //console.log(this.routestate, "state", this.type, 'user =>', this.user)
        this.page = 1;
        this.count = 0;
        this.pageSize = 10;
        this.list();
      }
    });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    this.departmentlist();
    this.productservice.vendorlist().subscribe({
      next: (vendors: any) => {
        //console.log(vendors)
        this.vendors = vendors.filter((v: any) => v.name.toString().toLowerCase());
        //console.log(this.vendors)
      }
    });
    this.userservice.getPurchaserid().subscribe({
      next: (data) => {
        this.purchaseid = data.data;
        // console.log(this.purchaseid);

        this.cd.detectChanges();
      }
    });
    this.list();
    this.selectedWarehouse = this.user.warehouse_id;
  }
  list(): void {
    let type = this.route.snapshot.paramMap.get('status') || '';
    // console.log(type);
    this.type = type;

    let labels: any = {
      process: 'Pending for Approval',
      revise: 'Revise P.O',
      halt: 'Halted P.O',
      reject: 'Reject P.O',
      approved: 'Approved P.O',
      vendor_revise: 'Vendor Revise',
      accept: 'Vendor Approval',
      decline: 'Vendor Reject P.O'
    };
    if (this.type === '') this.title === 'Purchase Orders';
    else this.title === labels[type];

    const params = this.getRequestParams(
      this.search,
      this.selectedDept,
      this.selectedProduct,
      this.selectedVendor,
      this.page,
      this.pageSize,
      this.selectedPurchaser,
      (this.selectedWarehouse = this.user.warehouse_id)
    );

    this.purchaseorderservice.getAll(params, type).subscribe({
      next: (orders) => {
        this.orders = orders.datas;
        this.orders.map((e: any) => {
          let purchaserlist: any = this.purchaseid.filter((k) => k.uid == e.purchaseid);
          e.purchase = purchaserlist.length > 0 ? purchaserlist[0].uuid : '';
          return e;
        });
        // console.log(this.orders);
        this.count = orders.totalItems || 0;
        if (orders.totalItems) this.count = orders.totalItems;
        this.collectionSize = orders.totalItems !== undefined ? orders.totalItems : 0;
        this.cd.detectChanges();
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
  }
  getRequestParams(
    search: string,
    dept: string,
    prod: string,
    vendor: string,
    page: number,
    pageSize: number,
    purchaser: string,
    warehouse: number
  ): any {
    let params = { search: '', dept: '', prod: '', vendor: '', page: page, size: pageSize, purchaser: '', warehouse: warehouse };
    if (search) params['search'] = search;
    if (dept) params['dept'] = dept;
    if (prod) params['prod'] = prod;
    if (vendor) params['vendor'] = vendor;
    if (purchaser) params['purchaser'] = purchaser;
    if (warehouse) params['warehouse'] = warehouse;
    if (page) params['page'] = page - 1;
    if (pageSize) params['size'] = pageSize;

    return params;
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    //console.log(event);
    this.pageSize = event;
    this.page = 1;
    this.list();
  }

  deleteUser(Product: Product): void {
    //console.log('inside');

    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'P.O Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then(
      (parameterResponse) => {
        this.purchaseorderservice.delete(Product).subscribe({
          next: (resp) => {
            this.toast.success('Product Deleted Successfully');
            this.list();
          },
          error: (err) => {
            this.toast.failure(err);
          }
        });
      },
      (err: any) => {
        //console.log(err);
        this.toast.failure('Something went wrong.. Product does not delete.');
      }
    );
  }

  confirm(uuid: any) {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Are you auto generate this ' + uuid;
    modalRef.componentInstance.confirmationMessage = 'Do you want to do?';
    modalRef.result.then(
      (parameterResponse) => {
        this.router.navigate(['/app/clone/' + uuid], { state: { clone: 'autopo' } });
      },
      (err) => {
        //this.toast.failure('Something went wrong.. Product does not delete.');
      }
    );
  }

  getTotal(total: any, discounttype: any, discount: any, tax: any) {
    var taxvalue = 0;
    var totdiscount = 0;
    if (discounttype == '1') {
      totdiscount = discount;
    } else if (discounttype == '2') {
      totdiscount = (total * discount) / 100;
    }

    if (tax > 0) {
      taxvalue = ((total - totdiscount) * tax) / 100;
    }

    let overalltotal: any = total - totdiscount + taxvalue;

    overalltotal = parseInt(overalltotal) === overalltotal ? overalltotal : parseFloat(overalltotal).toFixed(2);
    return overalltotal;
  }

  departmentlist() {
    this.purchaseorderservice.departmentlist().subscribe({
      next: (data) => {
        this.departments = data;
        //console.log(data);

        // this.cd.detectChanges();
      }
    });
  }

  changeDepartment(dept: any) {
    if (dept) {
      this.selectedDept = dept.did;
      this.selectedProduct = '';
      this.selectedVendor = '';
      this.products = [];
      this.vendors = [];

      this.purchaseorderservice.productlist(dept.did).subscribe({
        next: (data) => {
          this.products = data;
          this.list();
        }
      });

      this.purchaseorderservice.allvendor(dept.did).subscribe({
        next: (vendors) => {
          let vendordata: Vendor[] = [];
          // if (vendors.length > 0) {
          //   vendors.forEach((val) => {
          //     if (val.user)
          //       vendordata.push({ id: val.vendor_id, name: val.user.name })
          //   })
          // }
          this.vendors = vendors;
        }
      });
    } else {
      this.selectedDept = '';
      this.selectedProduct = '';
      this.selectedVendor = '';
      this.products = [];
      this.vendors = [];
      this.list();
    }
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }
  searchVendors(event: Event) {
    // //console.log('inside');
    this.selectedVendor = (event.target as HTMLInputElement).value;
    //console.log(this.selectedVendor);
    // this.list();
  }

  changeProduct(product: any) {
    if (product) {
      this.selectedProduct = product.pid;
      let findproduct = this.products.find((val) => val.pid === product.pid);
      if (findproduct) {
        this.selectedVendor = '';
      }

      this.vendors = [];

      this.purchaseorderservice.vendorlist(product.pid).subscribe({
        next: (vendors) => {
          let vendordata: Vendor[] = [];
          if (vendors.length > 0) {
            vendors.forEach((val) => {
              if (val.user) vendordata.push({ id: val.vendor_id, name: val.user.name });
            });
          }
          this.vendors = vendordata;
        }
      });
    } else {
      this.selectedProduct = '';
      this.vendors = [];
      this.selectedVendor = '';
    }
    this.list();
  }

  changeVendor(vendor: any) {
    if (vendor) {
      this.selectedVendor = vendor.uid;
    } else {
      this.selectedVendor = '';
    }
    this.list();
  }
  changePurchaser(purchaser: any) {
    if (purchaser) {
      this.selectedPurchaser = purchaser.uid;
    } else {
      this.selectedPurchaser = '';
    }
    this.list();
  }

  viewEdit(link: string, id: any) {
    if (link === 'edit') {
      this.router.navigate(['/po/create-po/' + id]);
    }
    if (link === 'view') {
      this.router.navigate(['/po/view/' + id]);
    }
  }
}
