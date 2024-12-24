import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../../models/product';
import { Department, Purchaseorder, Purchaseorderpaginate, Vendor } from '../../models/purchaseorder';
import { PurchaseorderService } from '../../services/purchaseorder.service';
@Component({
  selector: 'app-hold-po',
  standalone: true,
  imports: [DatePipe, NgFor, FormsModule, NgbTypeaheadModule, NgbPaginationModule, NgIf, RouterModule],
  providers: [
    DatePipe
  ],
  templateUrl: './hold-po.component.html',
  styleUrls: ['./hold-po.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldPoComponent {
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
  public user = JSON.parse(sessionStorage.getItem('auth_user') || '{}');
  type = '';

  departments: Department[] = [];
  products: Product[] = [];
  vendors: Vendor[] = [];
  selectedDept = '';
  selectedProduct = '';
  selectedVendor = '';
  datas: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseorderservice: PurchaseorderService,
    private cd: ChangeDetectorRef
  ) { }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      //console.log(paramMap)
    });
    this.list();
    this.departmentlist();
  }
  list(): void {
    let type = this.route.snapshot.paramMap.get('status') || '';
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

    this.title = labels[type] || 'Purchase Orders';

    const params = this.getRequestParams(
      this.search,
      this.selectedDept,
      this.selectedProduct,
      this.selectedVendor,
      this.page,
      this.pageSize
    );
    this.purchaseorderservice.getAll(params, type).subscribe({
      next: (orders) => {
        this.orders = orders.datas;
        //console.log(orders.datas);
        if (orders.totalItems) this.count = orders.totalItems;
        this.collectionSize = orders.totalItems !== undefined ? orders.totalItems : 0;
        this.cd.detectChanges();
      },
      error: (error) => {
        //this.authRedirect.next(error)
      }
    });
  }
  getRequestParams(search: string, dept: string, prod: string, vendor: string, page: number, pageSize: number): any {
    let params = { search: '', dept: '', prod: '', vendor: '', page: page, size: pageSize };
    if (search) params['search'] = search;
    if (dept) params['dept'] = dept;
    if (prod) params['prod'] = prod;
    if (vendor) params['vendor'] = vendor;
    if (page) params['page'] = page - 1;
    if (pageSize) params['size'] = pageSize;

    return params;
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.list();
  }
  handlePageSizeChange(event: any): void {
    //console.log(event)
    this.pageSize = event;
    this.page = 1;
    this.list();
  }

  deleteUser(Product: Product): void {
    // const modalRef = this.modelservice.open(ConfirmAlert);
    // modalRef.componentInstance.confirmationBoxTitle = 'P.O Delete Confirmation';
    // modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    // modalRef.result.then((parameterResponse) => {
    //   this.purchaseorderservice.delete(Product).subscribe({
    //     next: resp => {
    //       this.toast.success('Product Deleted Successfully');
    //       this.list();
    //     }, error: err => {
    //       this.toast.failure(err.error.message);
    //     }
    //   })
    // }, (err: any) => {
    //   //console.log(err);

    //   //this.toast.failure('Something went wrong.. Product does not delete.');
    // });
  }

  confirm(uuid: any) {
    // const modalRef = this.modelservice.open(ConfirmAlert);
    // modalRef.componentInstance.confirmationBoxTitle = 'Are you auto generate this '+uuid;
    // modalRef.componentInstance.confirmationMessage = 'Do you want to do?';
    // modalRef.result.then((parameterResponse) => {
    //   this.router.navigate(['/app/clone/'+uuid], { state: { 'clone': 'autopo' } });
    // }, err => {
    //   //this.toast.failure('Something went wrong.. Product does not delete.');
    // });
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
        this.cd.detectChanges()
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

  changeProduct(product: any) {

    if (product) {
      this.selectedProduct = product.pid;
      let findproduct = this.products.find(val => val.pid === product.pid)
      if (findproduct) {
        this.selectedVendor = '';
      }

      this.vendors = [];

      this.purchaseorderservice.vendorlist(product.pid)
        .subscribe({
          next: vendors => {
            let vendordata: Vendor[] = []
            if (vendors.length > 0) {
              vendors.forEach((val) => {
                if (val.user)
                  vendordata.push({ id: val.vendor_id, name: val.user.name })
              })
            }
            this.vendors = vendordata;
          }
        });
    }
    else {
      this.selectedProduct = '';
      this.vendors = [];
      this.selectedVendor = '';
    }
    this.list()

  }

  changeVendor(vendor: any) {
    if (vendor) {
      this.selectedVendor = vendor.uid;
    } else {
      this.selectedVendor = '';
    }
    this.list();
  }

}
