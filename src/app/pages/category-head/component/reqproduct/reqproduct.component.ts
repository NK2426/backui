import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/_helpers/toast.service';
import { Department } from '../../models/department';
import { Product, Productpaginate } from '../../models/product';
import { DepartmentsService } from '../../services/departments.service';
import { ProductsService } from '../../services/products.service';

import { Router } from '@angular/router';
import { ConfirmAlert } from 'src/app/_helpers/confirmalert/confirm-alert.component';
import { UtilsService } from 'src/app/_helpers/utils.service';
import { Brands } from '../../models/brands';
import { Categories } from '../../models/categories';
import { Subcategories } from '../../models/subcategories';
import { Vendor } from '../../models/vendor';

@Component({
  selector: 'app-reqproduct',
  templateUrl: './reqproduct.component.html',
  styleUrls: ['./reqproduct.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReqproductComponent implements OnInit {
  products?: Product[];
  productsPaginate?: Productpaginate;
  departments: Department[] = []
  searchdepart = 0;
  currentProduct: Product = {};
  vendors: Vendor[] = [];


  addAction = false;
  viewAction = false;
  viewValue = false;
  currentIndex = -1;

  /// Paginate ////
  search = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 20, 30, 50, 100];

  brands: Brands[] = [];
  class: Categories[] = [];
  subclass: Subcategories[] = [];
  selectedDept = ''; selectedBrand = ''; selectedClass = ''; selectedSubclass = ''; selectedVendor = '';

  constructor(private productservice: ProductsService, private modelservice: NgbModal, private toast: ToastService, private utlis: UtilsService, private departmentservice: DepartmentsService, private modalService: NgbModal, private router: Router, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.departmentservice.findList()
      .subscribe({
        next: (data: Department[]) => {
          this.departments = data;
          this.changeDepartment(this.departments[0]);
          // this.ref.detectChanges()
        },
        error: () => {
          this.departments = []
        }
      });
    this.productservice.vendorlist().subscribe({
      next: (vendors: Vendor[]) => {
        this.vendors = vendors
        // this.ref.detectChanges()
      }
    })
    this.list();
  }

  searchTable(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
    this.list();
  }

  list(): void {
    const params = this.getRequestParams(this.search, this.selectedDept, this.selectedBrand, this.selectedClass,
      this.selectedSubclass, this.selectedVendor, this.page, this.pageSize)
    this.productservice.getAllreq(params)
      .subscribe({
        next: (products: any) => {
          this.products = products.datas;
          this.count = products.totalItems || 0;
          if (products.totalItems)
            this.count = products.totalItems;
          this.ref.detectChanges()
        }, error: (error: any) => {
          //this.authRedirect.next(error)
        }
      })

    this.productservice.brandlist(this.selectedDept || 0)
      .subscribe({
        next: (data: Brands[]) => {
          this.brands = data;
        }
      });

  }

  getRequestParams(search: string, dept: string, brand: string, cat: string, subcat: string, vendor: string, page: number, pageSize: number): any {
    let params = { 'search': '', 'dept': '', 'brand': '', 'cat': '', 'subcat': '', 'vendor': '', 'page': page, 'size': pageSize };
    if (search)
      params['search'] = search;
    if (dept)
      params['dept'] = dept;
    if (brand)
      params['brand'] = brand;
    if (cat)
      params['cat'] = cat;
    if (subcat)
      params['subcat'] = subcat;
    if (vendor)
      params['vendor'] = vendor;
    if (page)
      params['page'] = page - 1;
    if (pageSize)
      params['size'] = pageSize;

    return params;
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

  deleteUser(Product: Product): void {
    const modalRef = this.modelservice.open(ConfirmAlert);
    modalRef.componentInstance.confirmationBoxTitle = 'Product Delete Confirmation';
    modalRef.componentInstance.confirmationMessage = 'Do you want to delete?';
    modalRef.result.then((parameterResponse: any) => {
      this.productservice.delete(Product).subscribe({
        next: (resp: any) => {
          this.toast.success('Product Deleted Successfully');
          this.list();
        }, error: (err: { error: { message: string; }; }) => {
          this.toast.failure(err.error.message);
        }
      })
    }, (err: any) => {
      //this.toast.failure('Something went wrong.. Product does not delete.');
    });
  }
  refreshList(type: any): void {
    this.addAction = false;
    if (type == 'cancel') {
      this.viewAction = true;
    } else {
      this.modalService.dismissAll();
      if (type == 'refresh')
        this.list();
      this.currentIndex = -1;
    }
  }
  editProduct(product: Product, value = ''): void {
    this.addAction = true;
    this.viewAction = false;
    let eproduct = Object.assign({}, product)
    this.currentProduct = eproduct;
  }

  setActiveProduct(content: any, product: Product, index: number, value = ''): void {
    this.modalService.open(content);
    this.currentIndex = index;
    this.currentProduct = product;
    //this.currentProduct.addValue = value === '' ? false : true;
    this.addAction = false;
    this.viewAction = true;
  }

  getStatus(id: any) {
    //console.log(id)
    if (id == 1)
      return 'Accepted';
    else if (id == 0)
      return 'Request for Approval'
    else
      return 'Rejected'
  }

  getColor(id: any) {
    if (id == 1)
      return 'green';
    else if (id == 0)
      return 'blue'
    else
      return 'red'
  }

  changeDepartment(dept: any) {
    this.selectedClass = '';
    this.selectedSubclass = '';
    this.selectedBrand = '';
    this.class = [];
    this.subclass = [];
    this.brands = [];
    if (dept) {
      this.selectedDept = dept.did;

      this.productservice.catlist(dept.did)
        .subscribe({
          next: (data: Categories[]) => {
            this.class = data;
            this.list()
          }
        });

    }
    else {
      this.selectedDept = ''
      this.list()
    }
  }

  changeCategory(category: any) {
    this.subclass = [];
    this.selectedSubclass = '';
    if (category) {
      this.selectedClass = category.cid;
      this.productservice.subcatlist(this.selectedClass)
        .subscribe({
          next: (subclass: Subcategories[]) => {
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
    }
    this.list()
  }

  changeVendor(vendor: any) {
    if (vendor) {
      this.selectedVendor = vendor.uid;
    }
    else {
      this.selectedVendor = ''
    }
    //console.log(this.selectedVendor)
    this.list()
  }

  changeBrand(brand: any) {
    if (brand) {
      this.selectedBrand = brand.bid;
    }
    else {
      this.selectedBrand = ''
    }
    this.list()
  }

  changeSubcategory(subcat: any) {
    if (subcat) {
      this.selectedSubclass = subcat.id;
    }
    else {
      this.selectedSubclass = ''
    }
    this.list()
  }


  src: string;
  showFullImage(event: any, image: any) {
    // console.log(event, event.target, event.target.src);
    this.modalService.open(image, { size: 'lg' });
    this.src = event.target.src;
  }
}
